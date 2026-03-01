// 游戏状态管理 - 使用React Context和useReducer

import React, { createContext, useContext, useReducer } from 'react';
import { generateIdentity } from '../data/identities.js';
import { drawProject } from '../data/projects.js';
import { shopItems } from '../data/shop.js';
import { checkEnding } from '../data/endings.js';
import { addTimestamp } from '../utils/formatters.js';
import {
    calculateProgressGrowth,
    calculateQualityGrowth,
    applyLearningDecay,
    clampAttribute,
    clampStress,
    WEEKLY_LIVING_COST,
    getStressLevel
} from './calculator.js';
import { conductMidtermReview, conductFinalReview, shouldTriggerReview, isMiddtermWeek } from './reviewSystem.js';
import { drawWeeklyEvent, applyEventEffects, applyChoiceEffect, formatEffectsForLog, recoverWeights } from './eventEngine.js';
import { shouldTriggerModel } from '../data/models.js';
import { drawTutor, drawMission, updateTutorWeights, isMissionComplete, applyTutorEffects } from '../data/tutors.js';
import { defenseStrategies } from '../data/defense.js';

// 初始状态
const initialState = {
    initialized: false,
    identity: null,
    attributes: {
        design: 0,
        software: 0,
        stress: 0,
        money: 0
    },
    progress: {
        year: 1,
        week: 1,
        semester: 1,
        totalWeeks: 0
    },
    currentProject: {
        name: '',
        progress: 0,
        quality: 0,
        hasModel: false
    },
    history: {
        grades: [],
        warningCount: 0,
        stressMaxWeeks: 0
    },
    ui: {
        screen: 'init', // init, game, review, model, shop, ending, choice, defense
        narrative: '欢迎来到《建筑生模拟器》',
        logs: [],
        pendingChoice: null,
        reviewResult: null,
        currentEvent: null,
        showEventModal: false
    },
    inventory: [],
    skillCooldown: 0,
    weeklyActions: {
        count: 0,
        limit: 2
    },
    weeklyFlags: {
        modelShown: false,
        reviewShown: false,
        defenseShown: false    // 汇报策略是否已展示
    },
    // ===== 导师系统 =====
    tutor: null,               // 当前导师对象
    tutorMission: null,        // 当前阶段活跃任务
    tutorMissionPhase: 0,      // 0=未开始, 1=阶段一(W1-W6), 2=阶段二(W7-W12)
    phaseMissionId: null,      // 阶段一任务ID（用于阶段二排除重复）
    tutorMissionTracking: {
        actionCounts: {},      // { polish: 0, lecture: 0, ... }
        softwareStart: 0,
        designStart: 0,
        semesterSpending: 0,   // 非生活费主动消费
    },
    tutorMissionResult: null,  // 最近一次导师任务判定结果 { success, comment }
    tutorWeights: {},          // 导师抽取权重
    tutorAppearHistory: [],    // 已出现导师ID列表
    // ===== 汇报系统 =====
    defenseResult: null,       // { strategy, success, narrative, effects }
    // ===== 导师奖励特殊状态 =====
    qualityDoubleCount: 0,     // 张姐奖励：剩余质量翻倍次数（当学期有效）
    weeklyStressReduction: 0,  // 赵哥奖励：每周压力自增减少量
    qualityMultiplier: 1,      // 陈工奖励：期末评图质量乘数
};

// Action类型
export const ActionTypes = {
    INIT_GAME: 'INIT_GAME',
    PERFORM_ACTION: 'PERFORM_ACTION',
    NEXT_WEEK: 'NEXT_WEEK',
    CHANGE_SCREEN: 'CHANGE_SCREEN',
    MAKE_CHOICE: 'MAKE_CHOICE',
    MAKE_MODEL: 'MAKE_MODEL',
    TAKE_JOB: 'TAKE_JOB',
    BUY_ITEM: 'BUY_ITEM',
    USE_SKILL: 'USE_SKILL',
    ADD_LOG: 'ADD_LOG',
    CLOSE_EVENT_MODAL: 'CLOSE_EVENT_MODAL',
    CHOOSE_DEFENSE: 'CHOOSE_DEFENSE',
    DRAW_TUTOR: 'DRAW_TUTOR',
};

// Reducer函数
function gameReducer(state, action) {
    switch (action.type) {
        case ActionTypes.INIT_GAME: {
            // 优先使用 InitScreen 抽取并传入的 identity，无则兜底随机生成
            const identity = action.payload?.identity ?? generateIdentity();
            const firstProject = drawProject(1);
            const initAttrs = { ...identity.initialAttributes };

            // 预先生成3位候选导师供玩家选择（第一周）
            const candidates = [];
            let tempWeights = { ...state.tutorWeights };
            const usedIds = new Set();
            for (let i = 0; i < 3; i++) {
                const candidate = drawTutor(tempWeights);
                candidates.push(candidate);
                usedIds.add(candidate.id);
                // 临时降权避免重复出现在候选列表
                tempWeights = { ...tempWeights, [candidate.id]: 0.01 };
            }

            return {
                ...state,
                initialized: true,
                identity,
                attributes: initAttrs,
                currentProject: firstProject,
                tutor: null,
                tutorMission: null,
                tutorMissionPhase: 0,
                phaseMissionId: null,
                tutorMissionTracking: {
                    actionCounts: {},
                    softwareStart: initAttrs.software,
                    designStart: initAttrs.design,
                    semesterSpending: 0,
                },
                tutorMissionResult: null,
                defenseResult: null,
                qualityDoubleCount: 0,
                weeklyStressReduction: 0,
                qualityMultiplier: 1,
                pendingNewSemester: {
                    candidates,
                    newProject: firstProject,
                    nextYear: 1,
                    nextSemester: 1,
                    isFirstSemester: true, // 标记为第一学期
                },
                ui: {
                    ...state.ui,
                    screen: 'tutorDraw',
                    narrative: `${identity.narrative.title}\n\n${identity.narrative.description}\n\n本学期课题: ${firstProject.name}\n\n请抽取本学期导师。`,
                    logs: ['── 第1年 Week 1 ──', '游戏开始!', addTimestamp('新学期开始！请选择本学期导师。')]
                },
                progress: { year: 1, week: 1, semester: 1, totalWeeks: 1 }
            };
        }

        case ActionTypes.PERFORM_ACTION: {
            const { actionType } = action.payload;
            let newState = { ...state };
            let logMessage = '';

            switch (actionType) {
                case 'redbull': // 通宵画图
                    newState.currentProject.progress += 15;
                    newState.attributes.stress += 15;
                    logMessage = addTimestamp('通宵画图: 进度+15, 压力+15');
                    break;

                case 'polish': // 方案推敲
                    newState.currentProject.quality += 8;
                    newState.attributes.stress += 8;
                    const designGain = applyLearningDecay(state.attributes.design, 0.5);
                    newState.attributes.design += designGain;
                    logMessage = addTimestamp(`方案推敲: 质量+8, 压力+8, 设计+${designGain.toFixed(1)}`);
                    break;

                case 'bilibili': // 软件教程
                    const softwareGain = applyLearningDecay(state.attributes.software, 2);
                    newState.attributes.software += softwareGain;
                    logMessage = addTimestamp(`软件教程: 软件+${softwareGain.toFixed(1)}`);
                    break;

                case 'lecture': // 学术讲座
                    const lectureGain = applyLearningDecay(state.attributes.design, 1);
                    newState.attributes.design += lectureGain;
                    logMessage = addTimestamp(`学术讲座: 设计+${lectureGain.toFixed(1)}`);
                    break;

                case 'rooftop': // 天台放空
                    newState.attributes.stress -= 20;
                    logMessage = addTimestamp('天台放空: 压力-20');
                    break;

                case 'hotpot': // 社交大餐
                    newState.attributes.stress -= 50;
                    newState.attributes.money -= 600;
                    logMessage = addTimestamp('社交大餐: 压力-50, 金钱-¥600');
                    break;
            }

            // 被动道具: 压力增量乘法减免
            const stressBefore = state.attributes.stress;
            const stressDelta = newState.attributes.stress - stressBefore;
            if (stressDelta > 0) {
                let multiplier = 1;
                if (state.inventory.includes('headphone')) multiplier *= 0.9;
                if (state.inventory.includes('chair')) multiplier *= 0.8;
                newState.attributes.stress = stressBefore + Math.round(stressDelta * multiplier);
            }

            // 张姐奖励：质量增长翻倍
            if (newState.qualityDoubleCount > 0 && actionType === 'polish') {
                const qualityBefore = state.currentProject.quality;
                const qualityGain = newState.currentProject.quality - qualityBefore;
                if (qualityGain > 0) {
                    newState.currentProject.quality += qualityGain; // 再加一次 = 翻倍
                    newState.qualityDoubleCount -= 1;
                    logMessage = logMessage.replace(/质量\+\d+/, `质量+${qualityGain * 2}(翻倍!)`);
                }
            }

            // 属性边界检查
            newState.attributes.design = clampAttribute(newState.attributes.design);
            newState.attributes.software = clampAttribute(newState.attributes.software);
            newState.attributes.stress = clampStress(newState.attributes.stress);
            newState.attributes.money = Math.max(0, newState.attributes.money);
            if (newState.currentProject) {
                newState.currentProject.progress = Math.max(0, newState.currentProject.progress);
                newState.currentProject.quality = Math.max(0, newState.currentProject.quality);
            }

            // 增加每周行动次数
            newState.weeklyActions = {
                ...state.weeklyActions,
                count: state.weeklyActions.count + 1
            };

            // 导师任务追踪：行动计数
            const newTracking = {
                ...state.tutorMissionTracking,
                actionCounts: {
                    ...state.tutorMissionTracking.actionCounts,
                    [actionType]: (state.tutorMissionTracking.actionCounts[actionType] || 0) + 1,
                },
            };
            // 追踪主动消费（用于孙工任务判定）
            if (actionType === 'hotpot') {
                newTracking.semesterSpending += 600;
            }
            newState.tutorMissionTracking = newTracking;

            // 添加日志 (持久化,不删除历史)
            const logs = [...state.ui.logs, logMessage];
            newState.ui.logs = logs;
            newState.ui.currentEvent = null; // 清除事件

            return newState;
        }

        case ActionTypes.NEXT_WEEK: {
            let newState = { ...state };
            const currentWeek = state.progress.week;
            const currentYear = state.progress.year;
            const weeklyFlags = state.weeklyFlags || { modelShown: false, reviewShown: false, defenseShown: false };

            // 1. 模型制作周（W5、W11）——只展示一次，不推进周数
            if (shouldTriggerModel(currentWeek) && !weeklyFlags.modelShown) {
                return {
                    ...state,
                    weeklyFlags: { ...weeklyFlags, modelShown: true },
                    ui: {
                        ...state.ui,
                        screen: 'model'
                    }
                };
            }

            // 2. 评图周（W6、W12）的汇报策略环节——在评图前触发
            if (shouldTriggerReview(currentWeek) && !weeklyFlags.defenseShown) {
                // 判定导师任务
                let tutorJudgmentResult = null;
                const isMidterm = isMiddtermWeek(currentWeek);

                if (state.tutor && state.tutorMission) {
                    // 院士特殊：仅期末结算
                    const shouldJudge = state.tutor.isSpecial ? !isMidterm : true;

                    if (shouldJudge) {
                        const success = isMissionComplete(state.tutorMission, state, state.tutorMissionTracking);
                        const effects = success ? state.tutor.successReward : state.tutor.failPenalty;
                        const comment = success ? state.tutor.successComment : state.tutor.failComment;

                        // 应用导师奖惩（使用不可变方式）
                        const { newState: afterEffects, logs: effectLogs } = applyTutorEffects(newState, effects);
                        newState = afterEffects;

                        tutorJudgmentResult = {
                            success,
                            comment,
                            tutorName: state.tutor.name,
                            missionDesc: state.tutorMission.description,
                            effectSummary: effectLogs.join(', '),
                        };

                        const judgLog = success
                            ? `✅ 导师任务达成! ${state.tutor.name}: ${effectLogs.join(', ')}`
                            : `❌ 导师任务未完成. ${state.tutor.name}: ${effectLogs.join(', ')}`;

                        newState = {
                            ...newState,
                            ui: {
                                ...(newState.ui || state.ui),
                                logs: [...(newState.ui?.logs || state.ui.logs), judgLog],
                            },
                        };
                    } else {
                        // 院士期中不结算，给提示
                        tutorJudgmentResult = {
                            success: null, // 未结算
                            comment: '院士的任务将在期末评图时统一结算。',
                            tutorName: state.tutor.name,
                            missionDesc: state.tutorMission.description,
                            effectSummary: '',
                        };
                    }
                }

                return {
                    ...newState,
                    weeklyFlags: { ...weeklyFlags, defenseShown: true },
                    tutorMissionResult: tutorJudgmentResult,
                    defenseResult: null, // 清除之前的汇报结果
                    ui: {
                        ...(newState.ui || state.ui),
                        screen: 'defense',
                    }
                };
            }

            // 3. 评图周（W6、W12）——只展示一次，不推进周数
            if (shouldTriggerReview(currentWeek) && !weeklyFlags.reviewShown) {
                const reviewType = isMiddtermWeek(currentWeek) ? 'midterm' : 'final';
                const reviewFunc = reviewType === 'midterm' ? conductMidtermReview : conductFinalReview;

                // 陈工奖励：期末评图 quality × qualityMultiplier
                let effectiveQuality = state.currentProject.quality;
                if (reviewType === 'final' && state.qualityMultiplier > 1) {
                    effectiveQuality = Math.floor(effectiveQuality * state.qualityMultiplier);
                }

                // 临时修改 quality 用于评图计算，然后恢复
                const originalQuality = newState.currentProject.quality;
                newState.currentProject.quality = effectiveQuality;
                const reviewResult = reviewFunc(newState);
                newState.currentProject.quality = originalQuality; // 恢复

                reviewResult.type = reviewType;

                // 情感共鸣失败时评价降级
                if (state.defenseResult && state.defenseResult.effects?.gradeDowngrade && reviewResult.grade) {
                    const gradeOrder = ['A', 'B', 'C', 'E'];
                    const idx = gradeOrder.indexOf(reviewResult.grade);
                    if (idx >= 0 && idx < gradeOrder.length - 1) {
                        reviewResult.grade = gradeOrder[idx + 1];
                        reviewResult.comment = reviewResult.comment + '\n（因汇报失败，评价被降级）';
                    }
                }

                if (reviewResult.consequence === 'warning') {
                    newState.history.warningCount += 1;
                }
                newState.history.grades.push({
                    year: state.progress.year,
                    week: currentWeek,
                    grade: reviewResult.grade || 'F',
                    type: reviewType
                });

                return {
                    ...newState,
                    weeklyFlags: { ...weeklyFlags, reviewShown: true },
                    ui: {
                        ...state.ui,
                        screen: 'review',
                        reviewResult,
                        logs: [...(newState.ui?.logs || state.ui.logs), `── Week ${currentWeek} `
                            + (reviewType === 'midterm' ? '(期中评图)' : '(期末评图)') + ` ──`]
                    }
                };
            }

            // 4. 计算真实的下一周(处理学期末回绕)
            let nextWeek = currentWeek + 1;
            let nextYear = currentYear;
            let nextSemester = state.progress.semester;

            if (nextWeek > 12) {
                nextWeek = 1;
                nextSemester += 1;
                if (nextSemester % 2 === 1) nextYear += 1; // 奇数学期 = 新学年
            }

            // 分隔符：只在实际推进时添加，使用真实的nextWeek
            let logs = [
                ...state.ui.logs,
                `── 第${nextYear}年 Week ${nextWeek} ──`
            ];

            // 新学期：抽取新课题 + 重置学期复购商品 + 展示导师抽取界面
            if (nextWeek === 1 && nextSemester !== state.progress.semester) {
                const newProject = drawProject(nextYear);

                // 学期复购商品重置
                const semesterRepeatableIds = shopItems.filter(i => i.semesterRepeatable).map(i => i.id);
                const semInventory = newState.inventory.filter(id => !semesterRepeatableIds.includes(id));

                // 预先生成3位候选导师供玩家选择
                const candidates = [];
                let tempWeights = { ...state.tutorWeights };
                const usedIds = new Set();
                for (let i = 0; i < 3; i++) {
                    const candidate = drawTutor(tempWeights);
                    candidates.push(candidate);
                    usedIds.add(candidate.id);
                    // 临时降权避免重复出现在候选列表
                    tempWeights = { ...tempWeights, [candidate.id]: 0.01 };
                }

                // 存储候选信息和新课题，等玩家选择后再正式推进
                return {
                    ...newState,
                    inventory: semInventory,
                    // 临时存储候选和新课题
                    pendingNewSemester: {
                        candidates,
                        newProject,
                        nextYear,
                        nextSemester,
                    },
                    ui: {
                        ...state.ui,
                        screen: 'tutorDraw',
                        logs: [
                            ...state.ui.logs,
                            `── 第${nextYear}年 Week ${nextWeek} ──`,
                            addTimestamp('新学期开始！请选择本学期导师。'),
                        ],
                    }
                };
            }

            // W7：发布阶段二任务（非院士）+ 重置行动追踪
            if (nextWeek === 7 && state.tutor && !state.tutor.isSpecial) {
                const phase2Mission = drawMission(state.tutor, state.phaseMissionId);
                newState.tutorMission = phase2Mission;
                newState.tutorMissionPhase = 2;
                // 重置追踪计数器（但保留花费追踪，因为孙工任务跨整学期）
                newState.tutorMissionTracking = {
                    ...newState.tutorMissionTracking,
                    actionCounts: {},
                    softwareStart: newState.attributes.software,
                    designStart: newState.attributes.design,
                };
                newState.defenseResult = null;
                logs.push(`📋 导师新任务: ${phase2Mission.description}`);
            }

            // 重置weeklyFlags（新的一周，标志清零）
            newState.weeklyFlags = { modelShown: false, reviewShown: false, defenseShown: false };

            // 5. 每周压力自动增长(受商店道具和赵哥奖励影响)
            let weeklyStressGrowth = 10;
            if (newState.inventory.includes('headphone')) weeklyStressGrowth *= 0.9;
            if (newState.inventory.includes('chair')) weeklyStressGrowth *= 0.8;
            // 赵哥奖励：每周压力自增减少
            weeklyStressGrowth -= (newState.weeklyStressReduction || 0);
            weeklyStressGrowth = Math.max(0, Math.round(weeklyStressGrowth));
            newState.attributes.stress += weeklyStressGrowth;

            // 学校自然增长
            if (state.identity.school.weeklyGrowth > 0) {
                newState.attributes.design += state.identity.school.weeklyGrowth;
            }

            // 4. 生活费扣除
            newState.attributes.money -= WEEKLY_LIVING_COST;
            logs.push(addTimestamp(`生活费-¥${WEEKLY_LIVING_COST}`));

            // 5. 每月生活费(每4周)
            if (currentWeek % 4 === 0) {
                newState.attributes.money += state.identity.family.monthlyAllowance;
                logs.push(addTimestamp(`收到生活费+¥${state.identity.family.monthlyAllowance}`));
            }

            // 5.5 商店被动效果
            // 星巴克永久会员: 每周压力-5
            if (newState.inventory.includes('starbucks')) {
                newState.attributes.stress -= 5;
            }

            // 红牛整箱: 下一周AP+1，使用后移出背包(可再次购买)
            if (newState.inventory.includes('redbull')) {
                newState.inventory = newState.inventory.filter(id => id !== 'redbull');
                newState.redbullAPBoost = true;
                logs.push(addTimestamp('🥫 红牛生效: 本周AP+1'));
            }

            // 6. 压力连续满值检测
            const stressLevel = getStressLevel(newState.attributes.stress);
            if (stressLevel === 'breakdown') {
                newState.history.stressMaxWeeks += 1;
            } else {
                newState.history.stressMaxWeeks = 0; // 重置
            }

            // 7. 技能冷却减少
            if (newState.skillCooldown > 0) {
                newState.skillCooldown -= 1;
            }

            // 9. 每周必触发一个事件(随机事件 or 交互抉择)
            recoverWeights(); // 每周恢复所有事件权重
            const weeklyEvent = drawWeeklyEvent();

            if (weeklyEvent.type === 'random') {
                // 随机事件: 立即应用效果，显示弹窗
                const evt = weeklyEvent.data;
                newState = applyEventEffects(newState, evt.effects);
                const effectLog = formatEffectsForLog(evt.effects);
                logs.push(`📌 随机事件 [${evt.name}] ${effectLog}`);

                // 11. 更新进度状态
                newState.progress = {
                    year: nextYear,
                    week: nextWeek,
                    semester: nextSemester,
                    totalWeeks: state.progress.totalWeeks + 1
                };
                newState.weeklyActions = { count: 0, limit: newState.redbullAPBoost ? 3 : 2 };
                newState.redbullAPBoost = false;

                // 13. 检查结局
                const endingR = checkEnding(newState);
                if (endingR) {
                    return {
                        ...newState,
                        ui: {
                            ...state.ui,
                            screen: 'ending',
                            ending: endingR,
                            narrative: endingR.description,
                            logs
                        }
                    };
                }

                newState.attributes.design = clampAttribute(newState.attributes.design);
                newState.attributes.software = clampAttribute(newState.attributes.software);
                newState.attributes.stress = clampStress(newState.attributes.stress);
                newState.attributes.money = Math.max(0, newState.attributes.money);
                if (newState.currentProject) {
                    newState.currentProject.progress = Math.max(0, newState.currentProject.progress);
                    newState.currentProject.quality = Math.max(0, newState.currentProject.quality);
                }
                newState.ui.logs = logs;
                newState.ui.narrative = `第${nextYear}学年 第${nextWeek}周`;

                return {
                    ...newState,
                    ui: {
                        ...newState.ui,
                        showEventModal: true,
                        currentEvent: {
                            name: evt.name,
                            description: evt.description,
                            effects: evt.effects
                        },
                        logs
                    }
                };

            } else {
                // 交互抉择: 切换到choice screen
                const choice = weeklyEvent.data;
                logs.push(`🎲 交互抉择 [${choice.name}]`);

                // 先更新进度再返回，防止重复
                newState.progress = {
                    year: nextYear,
                    week: nextWeek,
                    semester: nextSemester,
                    totalWeeks: state.progress.totalWeeks + 1
                };
                newState.weeklyActions = { count: 0, limit: newState.redbullAPBoost ? 3 : 2 };
                newState.redbullAPBoost = false;

                return {
                    ...newState,
                    ui: {
                        ...state.ui,
                        screen: 'choice',
                        pendingChoice: choice,
                        narrative: choice.description,
                        logs,
                        currentEvent: null
                    }
                };
            }

            // 11. 更新进度状态
            newState.progress = {
                year: nextYear,
                week: nextWeek,
                semester: nextSemester,
                totalWeeks: state.progress.totalWeeks + 1
            };

            // 12. 重置每周行动次数
            newState.weeklyActions = {
                count: 0,
                limit: newState.redbullAPBoost ? 3 : 2
            };
            newState.redbullAPBoost = false;

            // 13. 检查结局
            const ending = checkEnding(newState);
            if (ending) {
                return {
                    ...newState,
                    ui: {
                        ...state.ui,
                        screen: 'ending',
                        ending,
                        narrative: ending.description,
                        logs
                    }
                };
            }

            // 属性边界检查
            newState.attributes.design = clampAttribute(newState.attributes.design);
            newState.attributes.software = clampAttribute(newState.attributes.software);
            newState.attributes.stress = clampStress(newState.attributes.stress);
            newState.attributes.money = Math.max(0, newState.attributes.money);
            if (newState.currentProject) {
                newState.currentProject.progress = Math.max(0, newState.currentProject.progress);
                newState.currentProject.quality = Math.max(0, newState.currentProject.quality);
            }

            newState.ui.logs = logs;
            newState.ui.narrative = eventNarrative;

            return newState;
        }

        case ActionTypes.MAKE_CHOICE: {
            const { optionIndex } = action.payload;
            const choice = state.ui.pendingChoice;
            const option = choice.options[optionIndex];

            const { newState: updatedState, result, appliedEffects } = applyChoiceEffect(state, option);

            const resultText = result === 'success' ? ' ✓ 成功' : result === 'fail' ? ' ✗ 失败' : '';
            const effectSummary = formatEffectsForLog(appliedEffects);
            const choiceLog = `  → 选择「${option.text}」${resultText}  ${effectSummary}`;

            return {
                ...updatedState,
                ui: {
                    ...updatedState.ui,
                    screen: 'game',
                    pendingChoice: null,
                    currentEvent: null,
                    narrative: `${choice.name}\n\n你选择了: ${option.text}${resultText}`,
                    logs: [...updatedState.ui.logs, choiceLog]
                }
            };
        }

        case ActionTypes.MAKE_MODEL: {
            const { modelOption } = action.payload;
            let newState = { ...state };

            newState.attributes.money -= modelOption.cost;
            newState.currentProject.quality += modelOption.qualityBonus;
            newState.currentProject.hasModel = true;

            // 追踪模型花费（非生活费主动消费）
            newState.tutorMissionTracking = {
                ...state.tutorMissionTracking,
                semesterSpending: (state.tutorMissionTracking.semesterSpending || 0) + modelOption.cost,
            };

            return {
                ...newState,
                ui: {
                    ...state.ui,
                    screen: 'game',
                    currentEvent: null,
                    narrative: `模型制作完成

${modelOption.description}

质量+${modelOption.qualityBonus}`,
                    logs: [...state.ui.logs, addTimestamp(`模型制作: ${modelOption.name}, 质量+${modelOption.qualityBonus}, 金钱-¥${modelOption.cost}`)]
                }
            };
        }

        case ActionTypes.PURCHASE_ITEM: {
            const { item } = action.payload;
            let newState = { ...state };

            newState.attributes.money -= item.price;
            newState.inventory.push(item.id);

            // 应用道具效果
            if (item.effect.design) {
                newState.attributes.design += item.effect.design;
            }
            if (item.effect.software) {
                newState.attributes.software += item.effect.software;
            }
            if (item.effect.stress) {
                newState.attributes.stress += item.effect.stress;
            }

            const purchaseLog = addTimestamp(`🛒 购买: ${item.name} -¥${item.price}`);

            return {
                ...newState,
                ui: {
                    ...state.ui,
                    narrative: `购买成功: ${item.name}\n\n${item.description}`,
                    logs: [...state.ui.logs, purchaseLog]
                }
            };
        }

        case ActionTypes.USE_SKILL: {
            const skill = state.identity.family.skill;

            // 检查冷却
            if (state.skillCooldown > 0) {
                return {
                    ...state,
                    ui: {
                        ...state.ui,
                        narrative: `技能冷却中,还需${state.skillCooldown}周`
                    }
                };
            }

            let newState = { ...state };

            // 应用技能效果
            const effect = skill.effect;
            if (effect.quality) {
                newState.currentProject.quality += effect.quality;
            }
            if (effect.progress) {
                newState.currentProject.progress += effect.progress;
            }
            if (effect.stress) {
                newState.attributes.stress = clampStress(newState.attributes.stress + effect.stress);
            }
            if (effect.moneyCost) {
                newState.attributes.money -= effect.moneyCost;
            }

            // 设置冷却
            newState.skillCooldown = skill.cooldown;

            // 技能效果日志
            const skillEffects = [];
            if (effect.quality) skillEffects.push(`质量+${effect.quality}`);
            if (effect.progress) skillEffects.push(`进度+${effect.progress}`);
            if (effect.stress) skillEffects.push(`压力+${effect.stress}`);
            if (effect.moneyCost) skillEffects.push(`花费¥${effect.moneyCost.toLocaleString()}`);
            const skillLog = addTimestamp(`⚡ 使用技能 [${skill.name}] ${skillEffects.join(', ')}`);

            return {
                ...newState,
                ui: {
                    ...state.ui,
                    narrative: `使用技能: ${skill.name}\n\n${skill.description}`,
                    logs: [...state.ui.logs, skillLog]
                }
            };
        }

        case ActionTypes.TAKE_JOB: {
            const { job } = action.payload;
            let newState = { ...state };

            newState.attributes.money += job.payment;
            newState.attributes.stress = clampStress(newState.attributes.stress + 20); // 接私活增加压力

            // 消耗1个行动点（与其他行动保持一致）
            newState.weeklyActions = {
                ...state.weeklyActions,
                count: state.weeklyActions.count + 1
            };

            const newLog = `接私活「${job.name}」: 金钱+¥${job.payment}, 压力+20`;

            return {
                ...newState,
                ui: {
                    ...state.ui,
                    screen: 'game', // 接单后返回游戏主界面
                    narrative: `💼 接私活：${job.name}\n\n"${job.description}"\n\n获得 ¥${job.payment}，压力+20`,
                    logs: [...state.ui.logs, newLog]
                }
            };
        }

        case ActionTypes.CHANGE_SCREEN: {
            return {
                ...state,
                ui: {
                    ...state.ui,
                    screen: action.payload.screen
                }
            };
        }

        case ActionTypes.ADD_LOG: {
            const logs = [...state.ui.logs, addTimestamp(action.payload.message)];
            return {
                ...state,
                ui: {
                    ...state.ui,
                    logs
                }
            };
        }

        case ActionTypes.CLOSE_EVENT_MODAL: {
            return {
                ...state,
                ui: {
                    ...state.ui,
                    showEventModal: false,
                    currentEvent: null
                }
            };
        }

        case ActionTypes.BUY_ITEM: {
            const { item } = action.payload;
            // 扣钱并加入inventory
            const newAttrs = { ...state.attributes, money: state.attributes.money - item.price };
            // 应用即时属性效果
            if (item.effect.design) newAttrs.design = clampAttribute(newAttrs.design + item.effect.design);
            if (item.effect.software) newAttrs.software = clampAttribute(newAttrs.software + item.effect.software);
            if (item.effect.stress) newAttrs.stress = clampStress(newAttrs.stress + item.effect.stress);
            const newLog = addTimestamp(`购买: ${item.name} -¥${item.price}`);

            // 追踪商店花费（非生活费主动消费）
            const updatedTracking = {
                ...state.tutorMissionTracking,
                semesterSpending: (state.tutorMissionTracking.semesterSpending || 0) + item.price,
            };

            return {
                ...state,
                attributes: newAttrs,
                inventory: [...state.inventory, item.id],
                tutorMissionTracking: updatedTracking,
                ui: {
                    ...state.ui,
                    logs: [...state.ui.logs, newLog]
                }
            };
        }

        case ActionTypes.CHOOSE_DEFENSE: {
            const { strategyId } = action.payload;
            const strategy = defenseStrategies.find(s => s.id === strategyId);
            if (!strategy) return state;

            // 概率判定
            const roll = Math.random();
            const success = roll < strategy.successRate;
            const effects = success ? strategy.successEffects : strategy.failEffects;
            const narrative = success ? strategy.successNarrative : strategy.failNarrative;

            // 不可变方式更新属性
            let newAttrs = { ...state.attributes };
            let newTracking = { ...state.tutorMissionTracking };
            let newProject = { ...state.currentProject };

            if (effects.design) newAttrs.design = clampAttribute(newAttrs.design + effects.design);
            if (effects.software) newAttrs.software = clampAttribute(newAttrs.software + effects.software);
            if (effects.stress) newAttrs.stress = clampStress(newAttrs.stress + effects.stress);
            if (effects.money) {
                newAttrs.money = Math.max(0, newAttrs.money + effects.money);
                // 策略花费也算入非生活费消费
                if (effects.money < 0) {
                    newTracking = {
                        ...newTracking,
                        semesterSpending: (newTracking.semesterSpending || 0) + Math.abs(effects.money),
                    };
                }
            }
            if (effects.quality) newProject.quality = Math.max(0, newProject.quality + effects.quality);
            if (effects.progress) newProject.progress = Math.max(0, newProject.progress + effects.progress);

            // 存储汇报结果（quality 和 gradeDowngrade 在评图时用）
            const defResult = {
                strategy: strategy.name,
                success,
                narrative,
                effects,
            };

            // 构建效果日志
            const defLogs = [];
            if (effects.design) defLogs.push(`设计${effects.design > 0 ? '+' : ''}${effects.design}`);
            if (effects.software) defLogs.push(`软件${effects.software > 0 ? '+' : ''}${effects.software}`);
            if (effects.stress) defLogs.push(`压力${effects.stress > 0 ? '+' : ''}${effects.stress}`);
            if (effects.money) defLogs.push(`金钱${effects.money > 0 ? '+' : ''}¥${Math.abs(effects.money)}`);
            if (effects.quality) defLogs.push(`评图质量补正${effects.quality > 0 ? '+' : ''}${effects.quality}`);

            const logEntry = success
                ? `🎯 汇报策略「${strategy.name}」成功! ${defLogs.join(', ')}`
                : `💥 汇报策略「${strategy.name}」失败! ${defLogs.join(', ')}`;

            return {
                ...state,
                attributes: newAttrs,
                currentProject: newProject,
                tutorMissionTracking: newTracking,
                defenseResult: defResult,
                ui: {
                    ...state.ui,
                    screen: 'game', // 返回 game，下次 NEXT_WEEK 会触发评图
                    showEventModal: true,
                    currentEvent: {
                        type: 'defense_result',
                        name: `汇报策略: ${strategy.name}`,
                        description: narrative,
                        success,
                        effects
                    },
                    narrative: `🏭 汇报策略: ${strategy.name}\n\n${narrative}`,
                    logs: [...state.ui.logs, logEntry]
                }
            };
        }

        case ActionTypes.DRAW_TUTOR: {
            // 玩家从候选列表中选择了导师
            const { tutorId } = action.payload;
            const pending = state.pendingNewSemester;
            if (!pending) return state;

            // 从 pendingNewSemester.candidates 找出选中的导师
            const chosenTutor = pending.candidates.find(c => c.id === tutorId);
            if (!chosenTutor) return state;

            const chosenMission = drawMission(chosenTutor);
            const { newWeights: finalWeights, updatedHistory: finalHistory } = updateTutorWeights(
                state.tutorWeights, chosenTutor.id, state.tutorAppearHistory
            );

            const newLogsBase = [...(state.ui?.logs || [])];
            if (!pending.isFirstSemester) {
                newLogsBase.push(addTimestamp(`新学期课题: ${pending.newProject.name}`));
            }
            newLogsBase.push(`👨‍🏫 导师: ${chosenTutor.name}`);
            newLogsBase.push(`📋 任务: ${chosenMission.description}`);

            const newProgress = pending.isFirstSemester ? state.progress : {
                year: pending.nextYear,
                week: 1,
                semester: pending.nextSemester,
                totalWeeks: state.progress.totalWeeks
            };

            return {
                ...state,
                currentProject: pending.newProject,
                pendingNewSemester: null,
                tutor: chosenTutor,
                tutorMission: chosenMission,
                tutorMissionPhase: chosenTutor.isSpecial ? 0 : 1,
                phaseMissionId: chosenMission.id,
                tutorMissionTracking: {
                    actionCounts: {},
                    softwareStart: state.attributes.software,
                    designStart: state.attributes.design,
                    semesterSpending: 0,
                },
                tutorMissionResult: null,
                tutorWeights: finalWeights,
                tutorAppearHistory: finalHistory,
                defenseResult: null,
                qualityDoubleCount: 0,
                weeklyStressReduction: 0,
                qualityMultiplier: 1,
                progress: newProgress,
                weeklyActions: { count: 0, limit: 2 },
                weeklyFlags: { modelShown: false, reviewShown: false, defenseShown: false },
                ui: {
                    ...state.ui,
                    screen: 'game',
                    narrative: pending.isFirstSemester
                        ? `${state.identity.narrative.title}\n\n${state.identity.narrative.description}\n\n本学期课题: ${pending.newProject.name}\n\n👨‍🏫 本学期导师: ${chosenTutor.name}`
                        : `新学期开始了。\n\n本学期课题: ${pending.newProject.name}\n\n👨‍🏫 本学期导师: ${chosenTutor.name}`,
                    logs: newLogsBase,
                }
            };
        }

        default:
            return state;
    }
}

// Context
const GameContext = createContext();

// Provider组件
export function GameProvider({ children }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    return (
        <GameContext.Provider value={{ state, dispatch, ActionTypes }}>
            {children}
        </GameContext.Provider>
    );
}

// Hook
export function useGame() {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within GameProvider');
    }
    return context;
}
