// 游戏状态管理 - 使用React Context和useReducer

import React, { createContext, useContext, useReducer } from 'react';
import { generateIdentity } from '../data/identities.js';
import { drawProject } from '../data/projects.js';
import { shopItems } from '../data/shop.js';
import { checkFailureEnding, endings } from '../data/endings.js';
import { internships, canIntern } from '../data/employment.js';
import { atlasMilestones } from '../data/atlas.js';
import { addTimestamp } from '../utils/formatters.js';
import {
    calculateProgressGrowth,
    calculateQualityGrowth,
    applyLearningDecay,
    clampAttribute,
    clampStress,
    WEEKLY_LIVING_COST,
    getStressLevel,
    getQualityCap
} from './calculator.js';
import { conductMidtermReview, conductFinalReview, shouldTriggerReview, isMidtermWeek } from './reviewSystem.js';
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
    portfolio: [],       // 作品集档案
    portfolioScore: 0,   // 作品集总荣誉分数
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
    jobTakenThisWeek: false,
    weeklyFlags: {
        modelShown: false,
        reviewShown: false,
        defenseShown: false,   // 汇报策略是否已展示
        tutorJudgmentShown: false  // 导师任务结算是否已展示
    },
    currentIntern: null,           // 当前学年实习 { id, name, icon, year }
    usedEventIds: [],              // 已抽取的事件ID（不重复）
    // ===== 毕业分流路线相关数据 =====
    bestIelts: 0,              // 雅思最高分
    ieltsYearTaken: 0,         // 记录最近一次参加雅思的学年（每年只能报名一次）
    internHistory: [],         // 实习记录 (存 id)
    // ===== 导师系统 =====
    tutor: null,               // 当前导师对象
    tutorMission: null,        // 当前阶段活跃任务
    tutorMissionPhase: 0,      // 0=未开始, 1=阶段一(W1-W6), 2=阶段二(W7-W12)
    phaseMissionId: null,      // 阶段一任务ID（用于阶段二排除重复）
    tutorMissionTracking: {
        actionCounts: {},      // { polish: 0, lecture: 0, ... }
        softwareStart: 0,
        designStart: 0,
        yearSpending: 0,       // 非生活费主动消费
    },
    tutorMissionResult: null,  // 最近一次导师任务判定结果 { success, comment }
    tutorWeights: {},          // 导师抽取权重
    tutorAppearHistory: [],    // 已出现导师ID列表
    chosenTutorIds: [],         // 已选择过的导师ID（绝对不重复出现）
    // ===== 汇报系统 =====
    defenseResult: null,       // { strategy, success, narrative, effects }
    // ===== 导师奖励特殊状态 =====
    qualityDoubleCount: 0,     // 张姐奖励：剩余质量翻倍次数（当学期有效）
    weeklyStressReduction: 0,  // 赵哥奖励：每周压力自增减少量
    qualityMultiplier: 1,      // 陈工奖励：期末评图质量乘数
    // ===== 游戏提示系统 =====
    gameTip: null,                 // 当前待显示的游戏提示 { type, title, icon, message }
    competitionReminderWeek: 0,    // 当前学年竞赛提醒目标周
    // ===== 建筑朝圣之旅 =====
    atlas: {
        unlocked: false,            // 是否已解锁（大二开始）
        visited: [],                // 已点亮的建筑ID列表
        currentExpedition: null,    // 当前考察 { buildingId, weeksLeft }
        expeditionComplete: null,   // 待展示的完成通知 { buildingId }
        pendingMilestone: null,     // 待展示的里程碑 { title, desc, reward }
        claimedMilestones: [],      // 已领取的里程碑 count列表
    },
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
    RECORD_INTERN: 'RECORD_INTERN',
    UPDATE_IELTS: 'UPDATE_IELTS',
    TRIGGER_ENDING: 'TRIGGER_ENDING',
    APPLY_CUSTOM_EFFECTS: 'APPLY_CUSTOM_EFFECTS',
    PROCEED_TO_DEFENSE: 'PROCEED_TO_DEFENSE',
    COMPLETE_REVIEW_FLOW: 'COMPLETE_REVIEW_FLOW',
    TRIGGER_BANKRUPT: 'TRIGGER_BANKRUPT',
    DISMISS_GAME_TIP: 'DISMISS_GAME_TIP',
    START_EXPEDITION: 'START_EXPEDITION',
    DISMISS_EXPEDITION_COMPLETE: 'DISMISS_EXPEDITION_COMPLETE',
};

// ===== 游戏提示生成辅助函数 =====
function generateGameTip(week, year, state) {
    // 实习提醒：大一~大四 每学年第3周
    if (week === 3 && year <= 4) {
        if (state.currentIntern) return null; // 已投递，不提醒
        const hasEligible = internships.some(intern => canIntern(intern, state));
        if (hasEligible) {
            return {
                type: 'intern',
                title: '💡 实习推荐',
                icon: '🤝',
                message: '你的属性能力值已经够格投递实习了！点击左下角「实习与工作」查看可投递的岗位。好机会不等人，快去投递吧！'
            };
        } else {
            return null; // 无可投递实习，不弹提醒
        }
    }

    // 雅思提醒：每学年第9周
    if (week === 9 && year >= 2) {
        if (state.ieltsYearTaken === year) return null; // 当年已报考
        const best = state.bestIelts || 0;
        if (best >= 7.5) return null; // 高分不提醒
        if (best === 0) {
            return {
                type: 'ielts',
                title: '✈️ 雅思报考提醒',
                icon: '📝',
                message: '还没考过雅思？如果你有出国留学的打算，现在开始准备不算晚！点击左下角「出国留学」报名参加雅思考试。'
            };
        } else {
            return {
                type: 'ielts',
                title: '📝 雅思刷分建议',
                icon: '🎯',
                message: `你目前的雅思最高分是 ${best.toFixed(1)} 分，距离顶级名校要求的 7.5 分还有一段距离。再冲刺一次，说不定就飞跃了！`
            };
        }
    }

    // 竞赛投递提醒：大二开始，命中当年随机周
    if (year >= 2 && week === (state.competitionReminderWeek || 0)) {
        const unsubmitted = (state.portfolio || []).filter(p => !p.is_submitted);
        if (unsubmitted.length > 0) {
            return {
                type: 'competition',
                title: '🏆 竞赛投递提醒',
                icon: '🏅',
                message: '你的作品集里有尚未参赛的优秀作品！建筑竞赛是积攒荣誉与奖金的黄金机会，点击左下角「竞赛投稿」试试运气吧！'
            };
        }
    }

    return null;
}

// 金钱预警检测辅助函数
function checkMoneyWarning(state) {
    const weeklyLivingCost = state.identity?.family?.weeklyLivingCost || WEEKLY_LIVING_COST;
    return state.attributes.money > 0 && state.attributes.money < weeklyLivingCost * 2;
}

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
                const candidate = drawTutor(tempWeights, [], 1);
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
                    yearSpending: 0, // 原semesterSpending改为yearSpending
                },
                tutorMissionResult: null,
                defenseResult: null,
                qualityDoubleCount: 0,
                weeklyStressReduction: 0,
                qualityMultiplier: 1,
                // 是否开启/显示全局新手指引
                tutorialActive: false,
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
                    narrative: `${identity.narrative.title}\n\n${identity.narrative.description}\n\n本学年课题: ${firstProject.name}\n\n请抽取本年度导师。`,
                    logs: ['── 第1年 Week 1 ──', '游戏开始!', addTimestamp('新学年开始！请选择本年度导师。')]
                },
                progress: { year: 1, week: 1, totalWeeks: 1 }
            };
        }

        case ActionTypes.PERFORM_ACTION: {
            const { actionType } = action.payload;
            let newState = {
                ...state,
                attributes: { ...state.attributes },
                currentProject: { ...state.currentProject },
            };
            let logMessage = '';

            switch (actionType) {
                case 'redbull': // 通宵画图
                    const progressIncr = Math.floor(5 + (state.attributes.software * 0.1));
                    newState.currentProject.progress += progressIncr;
                    newState.attributes.stress += 8;
                    const softwareGainAllNight = applyLearningDecay(state.attributes.software, 0.5);
                    newState.attributes.software += softwareGainAllNight;
                    logMessage = addTimestamp(`通宵画图: 进度+${progressIncr}, 压力+8, 软件+${softwareGainAllNight.toFixed(1)}`);
                    break;

                case 'polish': { // 方案推敲
                    const qualityCap = getQualityCap(state.progress.year);
                    let qualityIncr = Math.floor(4 + (state.attributes.design * 0.08));
                    // 如果已达到质量上限则不再增加
                    if (newState.currentProject.quality >= qualityCap) {
                        qualityIncr = 0;
                    } else if (newState.currentProject.quality + qualityIncr > qualityCap) {
                        qualityIncr = qualityCap - newState.currentProject.quality;
                    }
                    newState.currentProject.quality += qualityIncr;
                    newState.attributes.stress += 8;
                    const designGain = applyLearningDecay(state.attributes.design, 0.5);
                    newState.attributes.design += designGain;
                    logMessage = addTimestamp(`方案推敲: 质量+${qualityIncr}, 压力+8, 设计+${designGain.toFixed(1)}`);
                    break;
                }

                case 'bilibili': // 软件教程
                    const softwareGain = state.attributes.software > 120 ? 3 : 5;
                    newState.attributes.software += softwareGain;
                    logMessage = addTimestamp(`软件教程: 软件+${softwareGain}`);
                    break;

                case 'lecture': // 学术讲座
                    const lectureGain = state.attributes.design > 150 ? 2 : 3;
                    newState.attributes.design += lectureGain;
                    logMessage = addTimestamp(`学术讲座: 设计+${lectureGain}`);
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
                newTracking.yearSpending += 600;
            }
            newState.tutorMissionTracking = newTracking;

            // 添加日志 (持久化,不删除历史)
            const logs = [...state.ui.logs, logMessage];
            newState.ui.logs = logs;
            newState.ui.currentEvent = null; // 清除事件

            // 重新检测金钱预警（防止行动扣费后不弹窗）
            newState.ui.moneyWarning = checkMoneyWarning(newState);

            return newState;
        }

        case ActionTypes.APPLY_CUSTOM_EFFECTS: {
            const { effects, narrative, logMessage } = action.payload;
            let newState = { ...state };

            if (effects) {
                newState = applyEventEffects(newState, effects);
            }
            if (narrative) {
                newState.ui.narrative = narrative;
            }

            const finalLog = logMessage || narrative || '进行了特殊行动';
            newState.ui.logs = [...newState.ui.logs, addTimestamp(finalLog)];

            // 属性边界检查
            newState.attributes.design = clampAttribute(newState.attributes.design);
            newState.attributes.software = clampAttribute(newState.attributes.software);
            newState.attributes.stress = clampStress(newState.attributes.stress);
            newState.attributes.money = Math.max(0, newState.attributes.money);

            return newState;
        }

        case ActionTypes.NEXT_WEEK: {
            let newState = { ...state };
            const currentWeek = state.progress.week;
            const currentYear = state.progress.year;
            const weeklyFlags = state.weeklyFlags || { modelShown: false, reviewShown: false, defenseShown: false, tutorJudgmentShown: false };

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

            // 2. 评图周（W6、W12）——一体化流程（导师结算+汇报策略+评图）
            if (shouldTriggerReview(currentWeek) && !weeklyFlags.tutorJudgmentShown) {
                // 判定导师任务
                let tutorJudgmentResult = null;
                const isMidterm = isMidtermWeek(currentWeek);

                if (state.tutor && state.tutorMission) {
                    const shouldJudge = state.tutor.isSpecial ? !isMidterm : true;

                    if (shouldJudge) {
                        const success = isMissionComplete(state.tutorMission, state, state.tutorMissionTracking);
                        const effects = success ? state.tutor.successReward : state.tutor.failPenalty;
                        const comment = success ? state.tutor.successComment : state.tutor.failComment;

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
                        tutorJudgmentResult = {
                            success: null,
                            comment: '院士的任务将在期末评图时统一结算。',
                            tutorName: state.tutor.name,
                            missionDesc: state.tutorMission.description,
                            effectSummary: '',
                        };
                    }
                }

                // 预计算评图结果（存储在 state 中供 ReviewFlowScreen 使用）
                const reviewType = isMidterm ? 'midterm' : 'final';
                const reviewFunc = reviewType === 'midterm' ? conductMidtermReview : conductFinalReview;

                let effectiveQuality = newState.currentProject.quality;
                if (reviewType === 'final' && state.qualityMultiplier > 1) {
                    effectiveQuality = Math.floor(effectiveQuality * state.qualityMultiplier);
                }

                const originalQuality = newState.currentProject.quality;
                newState.currentProject.quality = effectiveQuality;
                const preReviewResult = reviewFunc(newState);
                newState.currentProject.quality = originalQuality;
                preReviewResult.type = reviewType;
                preReviewResult.effectiveQuality = effectiveQuality;

                return {
                    ...newState,
                    weeklyFlags: { ...weeklyFlags, tutorJudgmentShown: true, defenseShown: true },
                    tutorMissionResult: tutorJudgmentResult,
                    defenseResult: null,
                    pendingReviewResult: preReviewResult,  // 预计算的评图结果
                    ui: {
                        ...(newState.ui || state.ui),
                        screen: 'reviewFlow',  // 一体化评图流程界面
                    }
                };
            }

            // 3. 评图周（W6、W12）——只展示一次，不推进周数
            if (shouldTriggerReview(currentWeek) && !weeklyFlags.reviewShown) {
                const reviewType = isMidtermWeek(currentWeek) ? 'midterm' : 'final';
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
                    const gradeOrder = ['S', 'A', 'B', 'C', 'D'];
                    const idx = gradeOrder.indexOf(reviewResult.grade);
                    if (idx >= 0 && idx < gradeOrder.length - 1) {
                        reviewResult.grade = gradeOrder[idx + 1];
                        reviewResult.comment = reviewResult.comment + '\n（因汇报失败，评价被降级）';
                    }
                }

                if (reviewResult.consequence === 'warning') {
                    // D级的处理，不再计入警告，只记录（由于D不挂科不警告，这里可以作为历史或者直接跳过不累计warningCount）
                    // 用户说“不计入挂科”，我们可以移除它的warningCount或者单独保留。
                    // 之前的逻辑里只有最终导致退学的是 warningCount。为了安全，我们将F定为唯一导致游戏退学（挂科数+1）
                }
                if (reviewResult.consequence === 'fail') {
                    newState.history.warningCount += 1; // 只有F计入挂科/严重警告
                }

                newState.history.grades.push({
                    year: state.progress.year,
                    week: currentWeek,
                    grade: reviewResult.grade || 'F',
                    type: reviewType
                });

                // ========== 作品集入库拦截 (仅期末且达到S/A) ==========
                if (reviewType === 'final' && ['S', 'A'].includes(reviewResult.grade)) {
                    const increment = effectiveQuality; // 不再对A级作品加权，统一使用实际质量分

                    const savedProject = {
                        id: 'proj_' + Date.now() + Math.floor(Math.random() * 1000),
                        projectId: state.currentProject.id,
                        title: state.currentProject.name,
                        semester: `大${['一', '二', '三', '四', '五'][state.progress.year - 1]}`, // 改为只显示大几
                        tutorId: state.tutor?.id || 'unknown',
                        tutorName: state.tutor?.name || '无名导师',
                        qualityScore: effectiveQuality,
                        grade: reviewResult.grade
                    };

                    newState.portfolio = [...state.portfolio, savedProject];
                    newState.portfolioScore = (state.portfolioScore || 0) + increment;

                    // 用作下一屏UI弹窗提示的Flag
                    newState.ui.newPortfolioProject = savedProject;
                }

                return {
                    ...newState,
                    weeklyFlags: { ...weeklyFlags, reviewShown: true },
                    ui: {
                        ...state.ui,
                        screen: 'review',
                        reviewResult,
                        newPortfolioProject: newState.ui.newPortfolioProject,
                        logs: [...(newState.ui?.logs || state.ui.logs), `── Week ${currentWeek} `
                            + (reviewType === 'midterm' ? '(期中评图)' : '(期末评图)') + ` ──`]
                    }
                };
            }

            // 4. 计算真实的下一周(处理学年末回绕)
            let nextWeek = currentWeek + 1;
            let nextYear = currentYear;

            if (nextWeek > 12) {
                nextWeek = 1;
                nextYear += 1;
            }

            // 分隔符：只在实际推进时添加，使用真实的nextWeek
            let logs = [
                ...state.ui.logs,
                `── 第${nextYear}年 Week ${nextWeek} ──`
            ];

            // 新学年：抽取新课题 + 重置年度复购商品 + 展示导师抽取界面
            if (nextWeek === 1 && nextYear !== currentYear) {
                const newProject = drawProject(nextYear);

                // 年度复购商品重置 (原学期复购)
                const semesterRepeatableIds = shopItems.filter(i => i.semesterRepeatable).map(i => i.id);
                const semInventory = newState.inventory.filter(id => !semesterRepeatableIds.includes(id));

                // 预先生成3位候选导师供玩家选择
                const candidates = [];
                let tempWeights = { ...state.tutorWeights };
                const usedIds = new Set();
                for (let i = 0; i < 3; i++) {
                    const candidate = drawTutor(tempWeights, state.chosenTutorIds || [], nextYear);
                    candidates.push(candidate);
                    usedIds.add(candidate.id);
                    // 临时降权避免重复出现在候选列表
                    tempWeights = { ...tempWeights, [candidate.id]: 0 };
                }

                // 新学年随机选定竞赛提醒周（大二起生效）
                let newCompWeek = state.competitionReminderWeek || 0;
                if (nextYear >= 2) {
                    const candidateWeeks = [2, 4, 8, 10];
                    newCompWeek = candidateWeeks[Math.floor(Math.random() * candidateWeeks.length)];
                }

                // 存储候选信息和新课题，等玩家选择后再正式推进
                return {
                    ...newState,
                    inventory: semInventory,
                    currentIntern: null,  // 新学年清空实习状态
                    competitionReminderWeek: newCompWeek,
                    atlas: {
                        ...(newState.atlas || { unlocked: false, visited: [], currentExpedition: null, expeditionComplete: null, pendingMilestone: null, claimedMilestones: [] }),
                        unlocked: nextYear >= 2 ? true : (newState.atlas || {}).unlocked || false
                    },
                    // 临时存储候选和新课题
                    pendingNewSemester: {
                        candidates,
                        newProject,
                        nextYear,
                    },
                    ui: {
                        ...state.ui,
                        screen: 'tutorDraw',
                        logs: [
                            ...state.ui.logs,
                            `── 第${nextYear}年 Week ${nextWeek} ──`,
                            addTimestamp('新学年开始！请选择本年度导师。'),
                        ],
                    }
                };
            }

            // W7：发布阶段二任务（非院士）+ 重置行动追踪
            if (nextWeek === 7 && state.tutor && !state.tutor.isSpecial) {
                const phase2Mission = state.tutor.missions[1];
                newState.tutorMission = phase2Mission;
                newState.tutorMissionPhase = 2;
                newState.phaseMissionId = phase2Mission.id;
                // 重置追踪计数器，但必须保留半学期初时的softwareStart和designStart用于B阶跨期判定
                newState.tutorMissionTracking = {
                    ...newState.tutorMissionTracking,
                    actionCounts: {},
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

            // 4. 生活费扣除（根据家庭背景不同）
            const weeklyLivingCost = state.identity.family.weeklyLivingCost || WEEKLY_LIVING_COST;
            newState.attributes.money -= weeklyLivingCost;
            logs.push(addTimestamp(`生活费-¥${weeklyLivingCost}`));

            // 实习工资
            if (state.currentIntern) {
                const activeInternInfo = internships.find(i => i.id === state.currentIntern || i.id === state.currentIntern?.id);
                if (activeInternInfo && activeInternInfo.salary !== undefined) {
                    newState.attributes.money += activeInternInfo.salary;
                    if (activeInternInfo.salary > 0) {
                        logs.push(addTimestamp(`【${activeInternInfo.name}】实习周薪 +¥${activeInternInfo.salary}`));
                    } else if (activeInternInfo.salary < 0) {
                        logs.push(addTimestamp(`缴纳【${activeInternInfo.name}】实习位费 -¥${Math.abs(activeInternInfo.salary)}`));
                    }
                }
            }

            // 5. 每月生活费(每4周)
            if (currentWeek % 4 === 0) {
                newState.attributes.money += state.identity.family.monthlyAllowance;
                logs.push(addTimestamp(`收到生活费+¥${state.identity.family.monthlyAllowance}`));
            }
            // (新学年生活费已移至 DRAW_TUTOR handler 中发放，确保在W1时就到账)



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

            // 8. 建筑朝圣之旅：考察倒计时（解锁已在新学年早期返回中处理）
            const atlasState = newState.atlas || { unlocked: false, visited: [], currentExpedition: null, expeditionComplete: null, pendingMilestone: null, claimedMilestones: [] };
            newState.atlas = atlasState;
            if (atlasState.currentExpedition) {
                const exp = { ...newState.atlas.currentExpedition };
                exp.weeksLeft -= 1;
                if (exp.weeksLeft <= 0) {
                    // 考察完成
                    const newVisited = [...newState.atlas.visited, exp.buildingId];
                    // 检查里程碑
                    let pendingMilestone = null;
                    for (const ms of atlasMilestones) {
                        if (newVisited.length >= ms.count && !(newState.atlas.claimedMilestones || []).includes(ms.count)) {
                            pendingMilestone = ms;
                            // 应用里程碑奖励
                            if (ms.reward.design) newState.attributes.design += ms.reward.design;
                            if (ms.reward.software) newState.attributes.software += ms.reward.software;
                            if (ms.reward.portfolioScore) newState.portfolioScore = (newState.portfolioScore || 0) + ms.reward.portfolioScore;
                            break; // 一次只弹一个
                        }
                    }
                    newState.atlas = {
                        ...newState.atlas,
                        visited: newVisited,
                        currentExpedition: null,
                        expeditionComplete: { buildingId: exp.buildingId },
                        pendingMilestone,
                        claimedMilestones: pendingMilestone
                            ? [...(newState.atlas.claimedMilestones || []), pendingMilestone.count]
                            : (newState.atlas.claimedMilestones || []),
                    };
                } else {
                    newState.atlas = { ...newState.atlas, currentExpedition: exp };
                }
            }

            // 9. 每周必触发一个事件(随机事件 or 交互抉择)
            recoverWeights();
            const weeklyEvent = drawWeeklyEvent(state.usedEventIds || []);

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
                    totalWeeks: state.progress.totalWeeks + 1
                };
                newState.weeklyActions = { count: 0, limit: newState.redbullAPBoost ? 3 : 2 };
                newState.redbullAPBoost = false;
                newState.jobTakenThisWeek = false;

                // 13. 检查结局
                const endingR = checkFailureEnding(newState);
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

                // 金钱预警检测
                const warningThreshold = (state.identity.family.weeklyLivingCost || WEEKLY_LIVING_COST) * 2;
                const showMoneyWarning = newState.attributes.money > 0 && newState.attributes.money < warningThreshold;

                // 游戏提示生成（在事件和金钱预警之后展示）
                const eventTip = generateGameTip(nextWeek, nextYear, newState);

                return {
                    ...newState,
                    gameTip: eventTip,
                    usedEventIds: [...(state.usedEventIds || []), evt.id],
                    ui: {
                        ...newState.ui,
                        showEventModal: true,
                        currentEvent: {
                            name: evt.name,
                            description: evt.description,
                            effects: evt.effects
                        },
                        moneyWarning: showMoneyWarning,
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
                    totalWeeks: state.progress.totalWeeks + 1
                };
                newState.weeklyActions = { count: 0, limit: newState.redbullAPBoost ? 3 : 2 };
                newState.redbullAPBoost = false;
                newState.jobTakenThisWeek = false;

                // 金钱预警检测
                const choiceWarningThreshold = (state.identity.family.weeklyLivingCost || WEEKLY_LIVING_COST) * 2;
                const showChoiceMoneyWarning = newState.attributes.money > 0 && newState.attributes.money < choiceWarningThreshold;

                // 游戏提示生成
                const choiceTip = generateGameTip(nextWeek, nextYear, newState);

                return {
                    ...newState,
                    gameTip: choiceTip,
                    usedEventIds: [...(state.usedEventIds || []), choice.id],
                    ui: {
                        ...state.ui,
                        screen: 'choice',
                        pendingChoice: choice,
                        narrative: choice.description,
                        logs,
                        currentEvent: null,
                        moneyWarning: showChoiceMoneyWarning
                    }
                };
            }

            // (已删除不可达的死代码: 原L719-L777)
        }

        case ActionTypes.MAKE_CHOICE: {
            const { optionIndex } = action.payload;
            const choice = state.ui.pendingChoice;
            const option = choice.options[optionIndex];

            const { newState: updatedState, result, appliedEffects } = applyChoiceEffect(state, option);

            const resultText = result === 'success' ? ' ✓ 成功' : result === 'fail' ? ' ✗ 失败' : '';
            const effectSummary = formatEffectsForLog(appliedEffects);
            const choiceLog = `  → 选择「${option.text}」${resultText}  ${effectSummary}`;

            const endingR = checkFailureEnding(updatedState);
            if (endingR) {
                return {
                    ...updatedState,
                    ui: {
                        ...updatedState.ui,
                        screen: 'ending',
                        ending: endingR,
                        narrative: endingR.description
                    }
                };
            }

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
            let newState = {
                ...state,
                attributes: { ...state.attributes },
                currentProject: { ...state.currentProject },
            };

            newState.attributes.money -= modelOption.cost;
            newState.currentProject.quality += modelOption.qualityBonus;
            newState.currentProject.hasModel = true;

            // 追踪模型花费（非生活费主动消费）
            newState.tutorMissionTracking = {
                ...state.tutorMissionTracking,
                yearSpending: (state.tutorMissionTracking.yearSpending || 0) + modelOption.cost,
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
                    logs: [...state.ui.logs, addTimestamp(`模型制作: ${modelOption.name}, 质量+${modelOption.qualityBonus}, 金钱-¥${modelOption.cost}`)],
                    moneyWarning: checkMoneyWarning(newState)
                }
            };
        }

        case ActionTypes.PURCHASE_ITEM: {
            const { item } = action.payload;

            // 深拷贝避免状态突变（React StrictMode下reducer执行两次）
            const newAttrs = { ...state.attributes };
            newAttrs.money -= item.price;
            if (item.effect.design) newAttrs.design += item.effect.design;
            if (item.effect.software) newAttrs.software += item.effect.software;
            if (item.effect.stress) newAttrs.stress += item.effect.stress;

            const newInventory = [...state.inventory, item.id];
            const purchaseLog = addTimestamp(`🛒 购买: ${item.name} -¥${item.price}`);

            const newState = {
                ...state,
                attributes: newAttrs,
                inventory: newInventory,
            };

            const endingR = checkFailureEnding(newState);
            if (endingR) {
                return {
                    ...newState,
                    ui: {
                        ...state.ui,
                        screen: 'ending',
                        ending: endingR,
                        narrative: endingR.description
                    }
                };
            }

            return {
                ...newState,
                ui: {
                    ...state.ui,
                    narrative: `购买成功: ${item.name}\n\n${item.description}`,
                    logs: [...state.ui.logs, purchaseLog],
                    moneyWarning: checkMoneyWarning(newState)
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

            let newState = {
                ...state,
                attributes: { ...state.attributes },
                currentProject: { ...state.currentProject },
            };

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
                    logs: [...state.ui.logs, skillLog],
                    moneyWarning: effect.moneyCost ? checkMoneyWarning(newState) : state.ui.moneyWarning
                }
            };
        }

        case ActionTypes.TAKE_JOB: {
            const { job } = action.payload;
            let newState = {
                ...state,
                attributes: { ...state.attributes },
            };

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
                jobTakenThisWeek: true,
                ui: {
                    ...state.ui,
                    screen: 'game', // 接单后返回游戏主界面
                    narrative: `💼 接私活：${job.name}\n\n"${job.description}"\n\n获得 ¥${job.payment}，压力+20`,
                    logs: [...state.ui.logs, newLog]
                }
            };
        }

        case ActionTypes.CHANGE_SCREEN: {
            let targetScreen = action.payload.screen;
            // 路由拦截：处于抽取导师等待状态下，任何试图切回主界面(game)的操作都会被强制导向 tutorDraw
            if (targetScreen === 'game' && state.pendingNewSemester) {
                targetScreen = 'tutorDraw';
            }
            return {
                ...state,
                ui: {
                    ...state.ui,
                    screen: targetScreen
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
                    currentEvent: null,
                    newPortfolioProject: null // 关闭弹窗时同时销毁作品集入库表彰提示
                }
            };
        }

        case 'DISMISS_MONEY_WARNING': {
            return {
                ...state,
                ui: { ...state.ui, moneyWarning: false }
            };
        }

        case 'DISMISS_GAME_TIP': {
            return {
                ...state,
                gameTip: null
            };
        }

        case 'START_EXPEDITION': {
            const { buildingId, cost, weeks } = action.payload;
            const newAttrs = {
                ...state.attributes,
                money: state.attributes.money - cost
            };
            const newExpState = { ...state, attributes: newAttrs };
            return {
                ...state,
                attributes: newAttrs,
                atlas: {
                    ...state.atlas,
                    currentExpedition: { buildingId, weeksLeft: weeks }
                },
                ui: {
                    ...state.ui,
                    moneyWarning: checkMoneyWarning(newExpState)
                }
            };
        }

        case 'DISMISS_EXPEDITION_COMPLETE': {
            // 两步流程：先关闭考察完成，再关闭里程碑
            if (state.atlas.expeditionComplete) {
                return {
                    ...state,
                    atlas: {
                        ...state.atlas,
                        expeditionComplete: null
                    }
                };
            }
            return {
                ...state,
                atlas: {
                    ...state.atlas,
                    pendingMilestone: null
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
                yearSpending: (state.tutorMissionTracking.yearSpending || 0) + item.price,
            };

            return {
                ...state,
                attributes: newAttrs,
                inventory: [...state.inventory, item.id],
                tutorMissionTracking: updatedTracking,
                ui: {
                    ...state.ui,
                    logs: [...state.ui.logs, newLog],
                    moneyWarning: checkMoneyWarning({ ...state, attributes: newAttrs })
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
                        yearSpending: (newTracking.yearSpending || 0) + Math.abs(effects.money),
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
                    screen: 'reviewFlow', // 返回评图流程界面而不是主界面
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

            const chosenMission = chosenTutor.missions[0];
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
                totalWeeks: state.progress.totalWeeks
            };

            // 大二刚选完导师后，弹出建筑朝圣之旅解锁提示
            const atlasTip = (pending.nextYear === 2 && !pending.isFirstSemester) ? {
                type: 'atlas_unlock',
                title: '🌍 建筑朝圣之旅已解锁！',
                icon: '✈️',
                message: '恭喜你踏入大二！全球12座殿堂级建筑正等待你前往朝圣。点击左侧「建筑朝圣之旅」开启探索之旅，点亮图鉴获取属性加成与作品集加分！'
            } : null;

            // 大五刚选完导师后，弹出毕业季提醒
            const year5Tip = (pending.nextYear === 5 && !pending.isFirstSemester) ? {
                type: 'year5_final',
                title: '🎓 最后一年，何去何从？',
                icon: '🎓',
                message: '欢迎来到大五——你的建筑学生涯最后一年。从现在起，以下毕业通道已全部开放：保研复试、出国留学投递、研究生统考、公务员考试、以及秋季招聘求职。你可以在左下角的对应入口中选择自己的命运，也可以什么都不做，以一个普通毕业生的身份默默离场。无论你选择哪条路，祝你好运，建筑人。'
            } : null;

            // 新学年生活费发放（大二及以后，选完导师即刻到账，对应W1）
            const newAttributes = !pending.isFirstSemester && pending.nextYear >= 2
                ? { ...state.attributes, money: state.attributes.money + state.identity.family.monthlyAllowance }
                : { ...state.attributes };
            if (!pending.isFirstSemester && pending.nextYear >= 2) {
                newLogsBase.push(addTimestamp(`新学年生活费+¥${state.identity.family.monthlyAllowance}`));
            }

            return {
                ...state,
                attributes: newAttributes,
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
                    yearSpending: 0,
                },
                tutorMissionResult: null,
                tutorWeights: finalWeights,
                tutorAppearHistory: finalHistory,
                chosenTutorIds: [...(state.chosenTutorIds || []), chosenTutor.id],
                defenseResult: null,
                qualityDoubleCount: 0,
                weeklyStressReduction: 0,
                qualityMultiplier: 1,
                progress: newProgress,
                weeklyActions: { count: 0, limit: 2 },
                weeklyFlags: { modelShown: false, reviewShown: false, defenseShown: false },
                gameTip: atlasTip || year5Tip,
                ui: {
                    ...state.ui,
                    screen: 'game',
                    narrative: pending.isFirstSemester
                        ? `${state.identity.narrative.title}\n\n${state.identity.narrative.description}\n\n本学年课题: ${pending.newProject.name}\n\n👨‍🏫 本学年导师: ${chosenTutor.name}`
                        : `新学年开始了。\n\n本学年课题: ${pending.newProject.name}\n\n👨‍🏫 本学年导师: ${chosenTutor.name}`,
                    logs: newLogsBase,
                }
            };
        }

        case ActionTypes.RECORD_INTERN: {
            const { internId, stressPenalty, year } = action.payload;
            const internData = internships.find(i => i.id === internId) || {};
            const internName = internData.name || internId;
            const salaryString = internData.salary > 0 
                ? `周薪 ¥${internData.salary}` 
                : (internData.salary < 0 
                    ? `花费 ¥${Math.abs(internData.salary)}/周` 
                    : '无薪资');
            return {
                ...state,
                internHistory: [...(state.internHistory || []), { id: internId, year: year || state.progress.year }],
                currentIntern: { id: internId, name: internName, icon: internData.icon, year: state.progress.year },
                weeklyStressReduction: (state.weeklyStressReduction || 0) - stressPenalty,
                ui: {
                    ...state.ui,
                    logs: [...state.ui.logs, addTimestamp(`💼 本学年已入职「${internName}」，每周压力+${stressPenalty}，${salaryString}。下一学年可重新选择。`)]
                }
            };
        }

        case ActionTypes.PROCEED_TO_DEFENSE: {
            // 保留向后兼容（ReviewFlowScreen内部使用）
            return state;
        }

        case ActionTypes.COMPLETE_REVIEW_FLOW: {
            // 一体化评图流程完成：应用评图结果 + 自动推进周数
            let newState = { ...state };
            const currentWeek = state.progress.week;
            const weeklyFlags = state.weeklyFlags || {};
            const reviewResult = { ...(state.pendingReviewResult || {}) };
            const reviewType = reviewResult.type || 'midterm';
            const effectiveQuality = reviewResult.effectiveQuality || state.currentProject.quality;

            // 情感共鸣失败时评价降级
            if (state.defenseResult && state.defenseResult.effects?.gradeDowngrade && reviewResult.grade) {
                const gradeOrder = ['S', 'A', 'B', 'C', 'D'];
                const idx = gradeOrder.indexOf(reviewResult.grade);
                if (idx >= 0 && idx < gradeOrder.length - 1) {
                    reviewResult.grade = gradeOrder[idx + 1];
                    reviewResult.comment = (reviewResult.comment || '') + '\n（因汇报失败，评价被降级）';
                }
            }

            if (reviewResult.consequence === 'fail') {
                newState.history = { ...newState.history, warningCount: (newState.history.warningCount || 0) + 1 };
            }
            newState.history = {
                ...newState.history,
                grades: [...(newState.history.grades || []), {
                    year: state.progress.year,
                    week: currentWeek,
                    grade: reviewResult.grade || 'F',
                    type: reviewType
                }]
            };

            // 作品集入库（仅期末且达到S/A）
            let newPortfolioProject = null;
            if (reviewType === 'final' && ['S', 'A'].includes(reviewResult.grade)) {
                const savedProject = {
                    id: 'proj_' + Date.now() + Math.floor(Math.random() * 1000),
                    projectId: state.currentProject.id,
                    title: state.currentProject.name,
                    semester: `大${['一', '二', '三', '四', '五'][state.progress.year - 1]}`,
                    tutorId: state.tutor?.id || 'unknown',
                    tutorName: state.tutor?.name || '无名导师',
                    qualityScore: effectiveQuality,
                    grade: reviewResult.grade
                };
                newState.portfolio = [...(state.portfolio || []), savedProject];
                newState.portfolioScore = (state.portfolioScore || 0) + effectiveQuality;
                newPortfolioProject = savedProject;
            }

            // 自动推进周数
            let nextWeek = currentWeek + 1;
            let nextYear = state.progress.year;
            let screenToNav = 'game';
            let extraUpdates = {};

            // W7：发布阶段二任务（非院士）
            if (nextWeek === 7 && state.tutor && !state.tutor.isSpecial) {
                const phase2Mission = state.tutor.missions[1];
                extraUpdates.tutorMission = phase2Mission;
                extraUpdates.tutorMissionPhase = 2;
                extraUpdates.phaseMissionId = phase2Mission.id;
                // 重置阶段追踪计数器（保留起初状态记录用于B阶跨期对比）
                extraUpdates.tutorMissionTracking = {
                    ...state.tutorMissionTracking,
                    actionCounts: {},
                };
                extraUpdates.defenseResult = null;
                extraUpdates.ui = {
                    ...state.ui,
                    logs: [...(extraUpdates.ui?.logs || state.ui.logs), `📋 导师新阶段任务: ${phase2Mission.description}`]
                };
            }

            if (nextWeek > 12) {
                nextWeek = 1;
                nextYear += 1;

                // === 新学年结算逻辑 ===
                const newProject = drawProject(nextYear);
                const semesterRepeatableIds = shopItems.filter(i => i.semesterRepeatable).map(i => i.id);
                const semInventory = newState.inventory.filter(id => !semesterRepeatableIds.includes(id));

                const candidates = [];
                let tempWeights = { ...state.tutorWeights };
                const usedIds = new Set();
                for (let i = 0; i < 3; i++) {
                    const candidate = drawTutor(tempWeights, state.chosenTutorIds || [], nextYear);
                    candidates.push(candidate);
                    usedIds.add(candidate.id);
                    tempWeights = { ...tempWeights, [candidate.id]: 0 };
                }

                screenToNav = 'tutorDraw';

                // 竞赛提醒周随机选定（大二起）
                let newCompWeek = state.competitionReminderWeek || 0;
                if (nextYear >= 2) {
                    const candidateWeeks = [2, 4, 8, 10];
                    newCompWeek = candidateWeeks[Math.floor(Math.random() * candidateWeeks.length)];
                }

                extraUpdates = {
                    inventory: semInventory,
                    currentIntern: null, // 清空实习状态
                    competitionReminderWeek: newCompWeek,
                    atlas: {
                        ...(state.atlas || { unlocked: false, visited: [], currentExpedition: null, expeditionComplete: null, pendingMilestone: null, claimedMilestones: [] }),
                        unlocked: nextYear >= 2 ? true : (state.atlas || {}).unlocked || false
                    },
                    pendingNewSemester: {
                        candidates,
                        newProject,
                        nextYear,
                    }
                };
            }

            newState.progress = {
                year: nextYear,
                week: nextWeek,
                totalWeeks: state.progress.totalWeeks + 1
            };
            newState.weeklyFlags = { modelShown: false, reviewShown: false, defenseShown: false, tutorJudgmentShown: false };
            newState.weeklyActions = { count: 0, limit: newState.redbullAPBoost ? 3 : 2 };
            newState.redbullAPBoost = false;
            newState.jobTakenThisWeek = false;
            newState.pendingReviewResult = null;
            Object.assign(newState, extraUpdates);

            const logs = [...(state.ui.logs || []),
            `── Week ${currentWeek} ` + (reviewType === 'midterm' ? '(期中评图)' : '(期末评图)') + ` ──`
            ];

            if (nextWeek === 1) {
                logs.push(`── 第${nextYear}年 Week ${nextWeek} ──`);
                logs.push(addTimestamp('新学年开始！请选择本年度导师。'));
            }

            return {
                ...newState,
                ui: {
                    ...state.ui,
                    screen: screenToNav,
                    reviewResult: screenToNav === 'game' ? reviewResult : null,
                    newPortfolioProject: screenToNav === 'game' ? newPortfolioProject : null,
                    narrative: `第${nextYear}学年 第${nextWeek}周`,
                    logs
                }
            };
        }

        case ActionTypes.UPDATE_IELTS: {
            const { newScore } = action.payload;
            const updatedScore = Math.max(state.bestIelts || 0, newScore);
            return {
                ...state,
                bestIelts: updatedScore,
                ieltsYearTaken: state.progress.year  // 记录考试年度由此限制每年仅一次
            };
        }

        case ActionTypes.TRIGGER_ENDING: {
            const { ending } = action.payload;
            return {
                ...state,
                ui: {
                    ...state.ui,
                    screen: 'ending',
                    ending,
                    narrative: ending.description
                }
            };
        }

        case ActionTypes.TRIGGER_BANKRUPT: {
            const ending = endings.bankrupt;
            return {
                ...state,
                ui: {
                    ...state.ui,
                    screen: 'ending',
                    ending,
                    narrative: ending.description
                }
            };
        }

        case 'TOGGLE_TUTORIAL': {
            return {
                ...state,
                tutorialActive: action.payload !== undefined ? action.payload : !state.tutorialActive
            };
        }

        case 'MARK_TUTORIAL_SHOWN': {
            return {
                ...state,
                tutorialShown: true
            };
        }

        case 'LOAD_CLOUD_SAVE': {
            // 从云端存档恢复完整游戏状态
            const cloudData = action.payload.saveData;
            if (!cloudData || typeof cloudData !== 'object') return state;
            return {
                ...initialState,
                ...cloudData,
                ui: {
                    ...(initialState.ui || {}),
                    ...(cloudData.ui || {}),
                    screen: cloudData.ui?.screen || 'game'
                }
            };
        }

        case 'HARD_RESET_GAME': {
            return {
                ...initialState
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
