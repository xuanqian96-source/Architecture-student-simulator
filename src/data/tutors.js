// 导师数据库 - 7位导师完整定义 + 抽取/判定系统

export const tutors = [
    {
        id: 'wang',
        name: '【建构狂人】老王',
        icon: '👨‍🔧',
        bio: '某甲级大院的技术总工，坚定的唯物主义建构者。他能一眼看出你剖面图里梁柱交接的逻辑错误。在他眼里，任何不能用砖头和钢筋实现的"诗意空间"都是耍流氓。',
        isSpecial: false,
        missions: [
            {
                id: 'wang_m1',
                description: '软件能力需提升15点',
                type: 'attributeGain',
                target: 'software',
                amount: 15,
            },
            {
                id: 'wang_m2',
                description: '执行3次「方案推敲」',
                type: 'actionCount',
                actionId: 'polish',
                count: 3,
            },
        ],
        successReward: { progress: 20, quality: 15 },
        failPenalty: { stress: 20 },
        successComment: '"不错，构造逻辑很诚实。这才是建筑该有的样子，不仅仅是几根线条。"',
        failComment: '"又是这些漂浮的盒子。你的房子是靠意念撑起来的吗？重画剖面！"',
    },
    {
        id: 'chen',
        name: '【空间哲学家】陈工',
        icon: '🧑‍🎨',
        bio: '海归先锋建筑师，满口海德格尔和现象学。他很少看你的平面功能，只关心你的建筑是否探讨了"场所的本质"。和他聊天，你总觉得自己的大脑需要安装一个翻译插件。',
        isSpecial: false,
        missions: [
            {
                id: 'chen_m1',
                description: '设计能力需达到120',
                type: 'attributeThreshold',
                target: 'design',
                threshold: 120,
            },
            {
                id: 'chen_m2',
                description: '执行3次「学术讲座」',
                type: 'actionCount',
                actionId: 'lecture',
                count: 3,
            },
        ],
        // qualityMultiplier: 期末评图时 quality × 1.2 后再评级
        successReward: { design: 5, qualityMultiplier: 1.2 },
        failPenalty: { stress: 25 },
        successComment: '"我听到了空间的叙事。这种对边界的模糊处理，确实有一点\'诗意\'的影子。"',
        failComment: '"平庸，太死板了。你只是在堆砖头，你根本没有触及建筑的灵魂。"',
    },
    {
        id: 'li',
        name: '【DDL 杀手】李姐',
        icon: '👩‍💼',
        bio: '学院最年轻的副教授，以严苛的时间管理著称。她坚信建筑学是一场极限耐力赛。在她的工作室，没有"还没画完"这个借口，只有"行不行"和"滚出去"。',
        isSpecial: false,
        missions: [
            {
                id: 'li_m1',
                description: '进度需达到70%',
                type: 'progressThreshold',
                threshold: 70,
            },
            {
                id: 'li_m2',
                description: '压力需低于40',
                type: 'stressBelow',
                threshold: 40,
            },
        ],
        successReward: { progress: 30, money: 500 },
        failPenalty: { warning: 1, stress: 35 },
        successComment: '"准时，且完整。这种职业素养是你未来在行业生存唯一的本钱。继续保持。"',
        failComment: '"你是把设计课当成业余爱好吗？这种进度，期末直接准备重修吧。"',
    },
    {
        id: 'zhang',
        name: '【视觉大拿】张姐',
        icon: '👩‍🎨',
        bio: '顶级表现公司艺术顾问。她对像素和光影有近乎变态的执着。她认为好的建筑师必须首先是顶级的视觉传达大师，"图都画不好看，甲方凭什么相信你的方案？"',
        isSpecial: false,
        missions: [
            {
                id: 'zhang_m1',
                description: '软件能力需达到130',
                type: 'attributeThreshold',
                target: 'software',
                threshold: 130,
            },
            {
                id: 'zhang_m2',
                description: '执行2次「软件教程」',
                type: 'actionCount',
                actionId: 'bilibili',
                count: 2,
            },
        ],
        // qualityDoubleCount: 接下来2次质量增长翻倍（当学期有效）
        successReward: { qualityDoubleCount: 2, software: 5 },
        failPenalty: { stress: 15 },
        successComment: '"图面表现力极佳！这几张透视图展现了某种神性。你的审美终于在线了。"',
        failComment: '"这种配景人就像是从上世纪穿越过来的。图面脏乱，我完全没兴趣看你的方案。"',
    },
    {
        id: 'sun',
        name: '【社会观察者】孙工',
        icon: '🧑‍🌾',
        bio: '深入基层的实践派。他常年穿着褪色的工装，反感一切昂贵的材料堆砌。他关心楼梯下的储物空间，关心外来务工者的纳凉处，他是建筑界最清醒的苦行僧。',
        isSpecial: false,
        missions: [
            {
                id: 'sun_m1',
                description: '本学期非生活费花销低于¥1500',
                type: 'spendingBelow',
                threshold: 1500,
            },
            {
                id: 'sun_m2',
                description: '执行2次「天台放空」',
                type: 'actionCount',
                actionId: 'rooftop',
                count: 2,
            },
        ],
        successReward: { design: 8, money: 1000 },
        failPenalty: { stress: 20 },
        successComment: '"难得看到现在的学生能关注到真实的尺度，而不是一味追求参数化异形。"',
        failComment: '"你在自嗨什么？这个旋转楼梯能解决老百姓的买菜问题吗？太浮躁了。"',
    },
    {
        id: 'academician',
        name: '【学术权威】院士',
        icon: '👴',
        bio: '站在金字塔尖的人物，资源遍布全国。他的话不多，但每一句都能直接定生死。在他的工作室，你接触的是国家级课题，面对的是从未有过的降维打击。',
        isSpecial: true, // 一学期仅一个任务，仅期末结算
        missions: [
            {
                id: 'academician_m1',
                description: '进度>90% 且 质量>200',
                type: 'compound',
                conditions: [
                    { target: 'progress', threshold: 90 },
                    { target: 'quality', threshold: 200 },
                ],
            },
        ],
        // "保研推荐信碎片"仅为叙事文案，实际效果为全属性+10
        successReward: { design: 10, software: 10, stress: -10, money: 1000 },
        failPenalty: { stress: 50 },
        successComment: '"很好，这种全局观和执行力，确实有几分我年轻时的风范。保研的事我有数了。"',
        failComment: '"失望。你在浪费我的资源，也在浪费你自己的天赋。你的心根本不在这里。"',
    },
    {
        id: 'zhao',
        name: '【温柔的混子】赵哥',
        icon: '🧑‍🍳',
        bio: '曾经也是卷王，现在看透了人生。他会劝你早点转行做 UI，或者带你去工作室后街吃火锅。虽然他不能带你拿奖，但他能保住你的头发。',
        isSpecial: false,
        missions: [
            {
                id: 'zhao_m1',
                description: '执行1次「社交大餐」',
                type: 'actionCount',
                actionId: 'hotpot',
                count: 1,
            },
            {
                id: 'zhao_m2',
                description: '压力需低于50',
                type: 'stressBelow',
                threshold: 50,
            },
        ],
        // 成功: 压力-30 + 本学期每周压力自增减少2
        successReward: { stress: -30, weeklyStressReduction: 2 },
        // 失败: 无惩罚, 赵哥请你喝奶茶 (压力-5 安慰)
        failPenalty: { stress: -5 },
        successComment: '"行啊，活下来了。我就说嘛，人生除了画图还有火锅，别太压力大了。"',
        failComment: '"赵哥不怪你，确实太卷了。早点睡吧，明天要是还画不出来，就去楼下散散心。"',
    },
];

// ============ 抽取系统 ============

const DEFAULT_WEIGHT = 10;
const DRAWN_WEIGHT = 2;

/**
 * 根据权重随机抽取导师
 * @param {Object} weights - { tutorId: weight }
 * @returns {Object} 导师对象
 */
export function drawTutor(weights = {}) {
    const totalWeight = tutors.reduce((sum, t) => sum + (weights[t.id] || DEFAULT_WEIGHT), 0);
    let random = Math.random() * totalWeight;

    for (const tutor of tutors) {
        const weight = weights[tutor.id] || DEFAULT_WEIGHT;
        random -= weight;
        if (random <= 0) return tutor;
    }

    return tutors[tutors.length - 1]; // fallback
}

/**
 * 为导师抽取任务，排除指定任务ID（防止同学期两阶段任务重复）
 * @param {Object} tutor - 导师对象
 * @param {string|null} excludeMissionId - 要排除的任务ID
 * @returns {Object} 任务对象
 */
export function drawMission(tutor, excludeMissionId = null) {
    const available = tutor.missions.filter(m => m.id !== excludeMissionId);
    if (available.length === 0) return tutor.missions[0]; // fallback
    return available[Math.floor(Math.random() * available.length)];
}

/**
 * 更新抽取权重：被抽中后降权，全部出现后恢复
 * @param {Object} weights - 当前权重
 * @param {string} drawnTutorId - 被抽中的导师ID
 * @param {string[]} appearHistory - 已出现导师ID列表
 * @returns {Object} 新权重
 */
export function updateTutorWeights(weights, drawnTutorId, appearHistory) {
    const newWeights = { ...weights };
    newWeights[drawnTutorId] = 0.01; // 极大幅度降权，几乎不会被抽到

    // 检查是否所有导师都已出现
    const updatedHistory = [...new Set([...appearHistory, drawnTutorId])];
    const allAppeared = updatedHistory.length >= tutors.length;

    if (allAppeared) {
        // 全部出现过，恢复所有权重，开启新一轮循环
        tutors.forEach(t => {
            newWeights[t.id] = DEFAULT_WEIGHT;
        });
        return { newWeights, updatedHistory: [drawnTutorId], allAppeared };
    } else {
        // 每学期其余导师权重逐渐回升（+1.5）直到恢复 DEFAULT_WEIGHT
        // 尽量保证未抽到的老师具有最高优先级
        tutors.forEach(t => {
            if (t.id !== drawnTutorId && newWeights[t.id] < DEFAULT_WEIGHT) {
                newWeights[t.id] = Math.min(DEFAULT_WEIGHT, newWeights[t.id] + 1.5);
            }
        });
    }

    return { newWeights, updatedHistory, allAppeared };
}

// ============ 任务判定系统 ============

/**
 * 判定导师任务是否完成
 * @param {Object} mission - 任务对象
 * @param {Object} state - 游戏状态
 * @param {Object} tracking - 追踪数据 (actionCounts, softwareStart, designStart, semesterSpending)
 * @returns {boolean}
 */
export function isMissionComplete(mission, state, tracking) {
    switch (mission.type) {
        case 'attributeGain': {
            const currentVal = state.attributes[mission.target];
            const startKey = mission.target === 'software' ? 'softwareStart' : 'designStart';
            const startVal = tracking[startKey] || 0;
            return (currentVal - startVal) >= mission.amount;
        }

        case 'actionCount':
            return (tracking.actionCounts[mission.actionId] || 0) >= mission.count;

        case 'attributeThreshold':
            return state.attributes[mission.target] >= mission.threshold;

        case 'progressThreshold':
            return (state.currentProject?.progress || 0) >= mission.threshold;

        case 'stressBelow':
            return state.attributes.stress < mission.threshold;

        case 'spendingBelow':
            return (tracking.semesterSpending || 0) < mission.threshold;

        case 'compound':
            return mission.conditions.every(cond => {
                if (cond.target === 'progress') return (state.currentProject?.progress || 0) >= cond.threshold;
                if (cond.target === 'quality') return (state.currentProject?.quality || 0) >= cond.threshold;
                return false;
            });

        default:
            return false;
    }
}

/**
 * 获取任务进度描述文本（用于UI显示）
 * @param {Object} mission - 任务对象
 * @param {Object} state - 游戏状态
 * @param {Object} tracking - 追踪数据
 * @returns {string} 进度文本
 */
export function getMissionProgress(mission, state, tracking) {
    switch (mission.type) {
        case 'attributeGain': {
            const currentVal = state.attributes[mission.target];
            const startKey = mission.target === 'software' ? 'softwareStart' : 'designStart';
            const startVal = tracking[startKey] || 0;
            const gained = Math.max(0, Math.floor(currentVal - startVal));
            return `已提升 ${gained} / ${mission.amount} 点`;
        }
        case 'actionCount': {
            const count = tracking.actionCounts[mission.actionId] || 0;
            return `已执行 ${count} / ${mission.count} 次`;
        }
        case 'attributeThreshold':
            return `当前 ${Math.floor(state.attributes[mission.target])} / 目标 ${mission.threshold}`;
        case 'progressThreshold':
            return `当前 ${Math.floor(state.currentProject?.progress || 0)}% / 目标 ${mission.threshold}%`;
        case 'stressBelow':
            return `当前 ${Math.floor(state.attributes.stress)} / 需低于 ${mission.threshold}`;
        case 'spendingBelow':
            return `已花费 ¥${Math.floor(tracking.semesterSpending || 0)} / 需低于 ¥${mission.threshold}`;
        case 'compound':
            return mission.conditions.map(cond => {
                if (cond.target === 'progress')
                    return `进度 ${Math.floor(state.currentProject?.progress || 0)}%/${cond.threshold}%`;
                if (cond.target === 'quality')
                    return `质量 ${Math.floor(state.currentProject?.quality || 0)}/${cond.threshold}`;
                return '';
            }).join(' · ');
        default:
            return '';
    }
}

/**
 * 应用导师任务奖惩效果（不可变方式，返回新 state 和日志）
 * @param {Object} state - 当前游戏状态
 * @param {Object} effects - 奖励或惩罚效果对象
 * @returns {{ newState: Object, logs: string[] }}
 */
export function applyTutorEffects(state, effects) {
    const logs = [];

    // 深拷贝嵌套对象，避免 mutation
    let newAttributes = { ...state.attributes };
    let newProject = { ...state.currentProject };
    let newHistory = { ...state.history };
    let newState = {
        ...state,
        attributes: newAttributes,
        currentProject: newProject,
        history: newHistory,
    };

    if (effects.progress) {
        newState.currentProject.progress += effects.progress;
        logs.push(`进度${effects.progress > 0 ? '+' : ''}${effects.progress}`);
    }
    if (effects.quality) {
        newState.currentProject.quality += effects.quality;
        logs.push(`质量${effects.quality > 0 ? '+' : ''}${effects.quality}`);
    }
    if (effects.design) {
        newState.attributes.design += effects.design;
        logs.push(`设计${effects.design > 0 ? '+' : ''}${effects.design}`);
    }
    if (effects.software) {
        newState.attributes.software += effects.software;
        logs.push(`软件${effects.software > 0 ? '+' : ''}${effects.software}`);
    }
    if (effects.stress) {
        newState.attributes.stress = Math.max(0, newState.attributes.stress + effects.stress);
        logs.push(`压力${effects.stress > 0 ? '+' : ''}${effects.stress}`);
    }
    if (effects.money) {
        newState.attributes.money = Math.max(0, newState.attributes.money + effects.money);
        logs.push(`金钱${effects.money > 0 ? '+' : ''}¥${Math.abs(effects.money)}`);
    }
    if (effects.warning) {
        newState.history.warningCount += effects.warning;
        logs.push(`⚠️ 获得警告×${effects.warning}`);
    }
    if (effects.qualityDoubleCount) {
        newState.qualityDoubleCount = (state.qualityDoubleCount || 0) + effects.qualityDoubleCount;
        logs.push(`🔥 下${effects.qualityDoubleCount}次质量增长翻倍`);
    }
    if (effects.weeklyStressReduction) {
        newState.weeklyStressReduction = (state.weeklyStressReduction || 0) + effects.weeklyStressReduction;
        logs.push(`😌 每周压力自增减少${effects.weeklyStressReduction}`);
    }
    if (effects.qualityMultiplier) {
        newState.qualityMultiplier = effects.qualityMultiplier;
        logs.push(`📐 期末评图质量系数×${effects.qualityMultiplier}`);
    }

    return { newState, logs };
}
