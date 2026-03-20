// 成就系统 - 25个成就定义 + localStorage 工具函数

export const achievements = [
    // ——— 🟢 入门难度（7个）———
    {
        id: 'ach_first_game',
        name: '建筑萌新',
        icon: '🐣',
        description: '欢迎来到建筑系，准备好你的肝、你的腰和你的发际线。',
        hint: '完成你的第一局游戏',
        difficulty: 'easy',
        points: 100,
    },
    {
        id: 'ach_first_allnighter',
        name: '第一条线',
        icon: '📐',
        description: '每个大师都是从拉第一条轴线开始的。虽然你的轴线歪了。',
        hint: '首次执行「通宵画图」行动',
        difficulty: 'easy',
        points: 100,
    },
    {
        id: 'ach_first_polish',
        name: '灵感降临',
        icon: '🤔',
        description: '你盯着白纸看了三小时，然后突然"悟了"。',
        hint: '首次执行「方案推敲」行动',
        difficulty: 'easy',
        points: 100,
    },
    {
        id: 'ach_first_freelance',
        name: '第一桶金',
        icon: '💰',
        description: '虽然只够买两卷硫酸纸，但这是你的劳动所得。',
        hint: '首次执行「接私活」行动',
        difficulty: 'easy',
        points: 100,
    },
    {
        id: 'ach_first_portfolio',
        name: '档案管理员',
        icon: '📁',
        description: '你的作品集终于不再是空的了。',
        hint: '作品集中收录第一个项目',
        difficulty: 'easy',
        points: 100,
    },
    {
        id: 'ach_first_intern',
        name: '社畜预备役',
        icon: '🏢',
        description: '恭喜你提前体验了996的生活。',
        hint: '首次入职任意实习单位',
        difficulty: 'easy',
        points: 100,
    },
    {
        id: 'ach_first_shop',
        name: '剁手党',
        icon: '🛒',
        description: '建筑系学生的钱，都花在了不该花的地方。',
        hint: '首次在商店购买任意物品',
        difficulty: 'easy',
        points: 100,
    },

    // ——— 🔵 中等难度（8个）———
    {
        id: 'ach_portfolio_4',
        name: '作品等身',
        icon: '📚',
        description: '四年积累，终于有了拿得出手的作品集。',
        hint: '单局内作品集中至少收录4个作品',
        difficulty: 'medium',
        points: 200,
    },
    {
        id: 'ach_shop_all',
        name: '氪金玩家',
        icon: '🛍️',
        description: '商店里每一件商品都被你买过了，你是建筑系最大的甲方。',
        hint: '单局内购买过所有商店物品',
        difficulty: 'medium',
        points: 200,
    },
    {
        id: 'ach_first_s_ending',
        name: '初露锋芒',
        icon: '🌟',
        description: '第一个S级结局，证明建筑系也能活得体面。',
        hint: '达成任意一个S级结局',
        difficulty: 'medium',
        points: 200,
    },
    {
        id: 'ach_design_180',
        name: '设计之刃',
        icon: '💪',
        description: '你的设计直觉已经远超同龄人。',
        hint: '单局内设计能力达到180',
        difficulty: 'medium',
        points: 200,
    },
    {
        id: 'ach_software_180',
        name: '参数化狂人',
        icon: '💻',
        description: 'Grasshopper 对你来说已经是玩具了。',
        hint: '单局内软件能力达到180',
        difficulty: 'medium',
        points: 200,
    },
    {
        id: 'ach_stress_control',
        name: '压力管理大师',
        icon: '🧘',
        description: '四年下来你的压力从没爆过表，你是怎么做到的？',
        hint: '单局内压力从未超过90',
        difficulty: 'medium',
        points: 200,
    },
    {
        id: 'ach_no_warning',
        name: '好好先生',
        icon: '🎓',
        description: '四年没挂过科，导师对你很满意。',
        hint: '从未收到警告并完成游戏',
        difficulty: 'medium',
        points: 200,
    },
    {
        id: 'ach_academician',
        name: '院士门生',
        icon: '👑',
        description: '传说中的学术泰山北斗竟然成了你的导师。',
        hint: '被院士导师带过一年',
        difficulty: 'medium',
        points: 200,
    },

    // ——— 🟡 高难度（6个）———
    {
        id: 'ach_all_s_endings',
        name: '人生赢家',
        icon: '🏆',
        description: '所有S级结局你都解锁了，建筑人生的天花板就是你。',
        hint: '达成所有S级结局',
        difficulty: 'hard',
        points: 400,
    },
    {
        id: 'ach_atlas_all',
        name: '世界建筑百科',
        icon: '🗺️',
        description: '你踏遍了全球每一座殿堂级建筑。',
        hint: '点亮全部12座建筑朝圣图鉴',
        difficulty: 'hard',
        points: 400,
    },
    {
        id: 'ach_rich',
        name: '富可敌国',
        icon: '💸',
        description: '你的存款比你导师一年工资还高。',
        hint: '单局内金钱达到¥80,000',
        difficulty: 'hard',
        points: 400,
    },
    {
        id: 'ach_max_both',
        name: '全能建筑师',
        icon: '🏅',
        description: '设计和软件都点满了，你是建筑系真正的六边形战士。',
        hint: '单局内设计能力和软件能力同时达到满值',
        difficulty: 'hard',
        points: 400,
    },
    {
        id: 'ach_all_tutors',
        name: '集邮达人',
        icon: '👨‍🏫',
        description: '建筑系所有导师都被你体验了一遍，你到底想选谁？',
        hint: '历史游戏中体验过所有7个导师',
        difficulty: 'hard',
        points: 400,
    },
    {
        id: 'ach_legendary_identity',
        name: '天选之子',
        icon: '✦',
        description: '你抽到了传说级身份，别人三辈子修不来的好命。',
        hint: '开局抽到S·传说稀有度身份',
        difficulty: 'hard',
        points: 400,
    },

    // ——— 🔴 隐藏/趣味成就（3个）———
    {
        id: 'ach_redbull_30',
        name: '续命专家',
        icon: '🥫',
        description: '30罐红牛下肚，你的血管里流的不是血，是牛磺酸。',
        hint: '单局内购买红牛超过30次',
        difficulty: 'hidden',
        points: 500,
    },
    {
        id: 'ach_redraw_all',
        name: '命运赌徒',
        icon: '🎰',
        description: '你把所有重抽机会都用完了，是选择困难症吧？',
        hint: '开局身份抽卡时用完全部3次重抽机会',
        difficulty: 'hidden',
        points: 500,
    },
    {
        id: 'ach_fail_collection',
        name: '建筑系全家桶',
        icon: '📉',
        description: '破产、崩溃、劝退，恭喜你，建筑系三大噩梦都被你遇见了。',
        hint: '在历史中集齐3个FAIL特殊结局',
        difficulty: 'hidden',
        points: 500,
    },
];

// ===== localStorage 工具函数 =====

const STORAGE_KEY = 'archsim_achievements';

export function getAchievementRecord() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch (e) {
        return {};
    }
}

export function isAchievementUnlocked(achId) {
    const record = getAchievementRecord();
    return !!record[achId]?.unlocked;
}

export function unlockAchievement(achId) {
    if (isAchievementUnlocked(achId)) return false; // 已解锁，不重复
    const record = getAchievementRecord();
    record[achId] = { unlocked: true, date: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(record));
    return true; // 新解锁
}

export function getUnlockedCount() {
    const record = getAchievementRecord();
    return Object.values(record).filter(v => v.unlocked).length;
}

// ===== 成就检测函数 =====

// 行动相关检测（PERFORM_ACTION 后调用）
export function checkActionAchievements(actionType, gameState) {
    const newlyUnlocked = [];

    if (actionType === 'redbull' && unlockAchievement('ach_first_allnighter')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_allnighter'));
    }
    if (actionType === 'polish' && unlockAchievement('ach_first_polish')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_polish'));
    }
    if (actionType === 'freelance' && unlockAchievement('ach_first_freelance')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_freelance'));
    }

    return newlyUnlocked;
}

// 属性阈值检测（每次属性变化后可调用）
export function checkAttributeAchievements(gameState) {
    const newlyUnlocked = [];
    const { design, software, money } = gameState.attributes;

    if (design >= 180 && unlockAchievement('ach_design_180')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_design_180'));
    }
    if (software >= 180 && unlockAchievement('ach_software_180')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_software_180'));
    }
    if (money >= 80000 && unlockAchievement('ach_rich')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_rich'));
    }
    // 满值检测：设计和软件同时达到上限（200）
    if (design >= 200 && software >= 200 && unlockAchievement('ach_max_both')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_max_both'));
    }

    return newlyUnlocked;
}

// 作品集检测（评图完成后调用）
export function checkPortfolioAchievements(portfolio) {
    const newlyUnlocked = [];
    if (portfolio.length >= 1 && unlockAchievement('ach_first_portfolio')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_portfolio'));
    }
    if (portfolio.length >= 4 && unlockAchievement('ach_portfolio_4')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_portfolio_4'));
    }
    return newlyUnlocked;
}

// 实习入职检测
export function checkInternAchievement() {
    const newlyUnlocked = [];
    if (unlockAchievement('ach_first_intern')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_intern'));
    }
    return newlyUnlocked;
}

// 商店购买检测
export function checkShopAchievements(inventory, redbullPurchaseCount) {
    const newlyUnlocked = [];
    if (unlockAchievement('ach_first_shop')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_shop'));
    }

    // 检查是否购买过所有商店物品（非重复类的唯一商品）
    const allUniqueItemIds = ['elcroquis', 'rhino', 'headphone', 'chair', 'manuscript', 'course', 'redbull', 'studytour', 'mouse', 'starbucks'];
    const allBought = allUniqueItemIds.every(id => inventory.includes(id));
    if (allBought && unlockAchievement('ach_shop_all')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_shop_all'));
    }

    // 红牛购买超过30次
    if (redbullPurchaseCount >= 30 && unlockAchievement('ach_redbull_30')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_redbull_30'));
    }

    return newlyUnlocked;
}

// 选导师后检测
export function checkTutorAchievements(tutor, chosenTutorIds) {
    const newlyUnlocked = [];

    // 院士门生
    if (tutor.isSpecial && unlockAchievement('ach_academician')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_academician'));
    }

    // 集邮达人：7个导师全部体验过（跨局累计，需要用 localStorage 存储）
    const ALL_TUTOR_IDS = ['wang', 'chen', 'li', 'zhang', 'sun', 'academician', 'ai'];
    // 合并当前局的 chosenTutorIds 与历史记录
    const historicalTutors = getHistoricalTutors();
    const combined = new Set([...historicalTutors, ...chosenTutorIds, tutor.id]);
    saveHistoricalTutors([...combined]);
    if (ALL_TUTOR_IDS.every(id => combined.has(id)) && unlockAchievement('ach_all_tutors')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_all_tutors'));
    }

    return newlyUnlocked;
}

// 结局触发时的检测
// unlockedEndingIds: 已解锁的结局ID数组, endingCounts: { endingId: count } 字典
export function checkEndingAchievements(endingId, endingType, gameState, unlockedEndingIds, endingCounts) {
    const newlyUnlocked = [];

    // 建筑萌新：完成第一局游戏
    if (unlockAchievement('ach_first_game')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_game'));
    }

    // 初露锋芒：任意S级结局
    if (endingType === 'S' && unlockAchievement('ach_first_s_ending')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_first_s_ending'));
    }

    // 人生赢家：所有S级结局
    const S_ENDING_IDS = ['postgrad_s', 'abroad_s', 'job_s', 'grad_s'];
    const allEndings = new Set([...(unlockedEndingIds || []), endingId]);
    if (S_ENDING_IDS.every(id => allEndings.has(id)) && unlockAchievement('ach_all_s_endings')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_all_s_endings'));
    }

    // 好好先生：warningCount 为 0
    if ((gameState.history?.warningCount || 0) === 0 && unlockAchievement('ach_no_warning')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_no_warning'));
    }

    // 压力管理大师：整局游戏压力从未超过90（使用 localStorage 标记）
    const stressExceeded = localStorage.getItem('archsim_stress_exceeded_90') === 'true';
    if (!stressExceeded && unlockAchievement('ach_stress_control')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_stress_control'));
    }



    // 建筑系全家桶：破产+崩溃+劝退
    const FAIL_SPECIAL_IDS = ['bankrupt', 'breakdown', 'expelled'];
    if (FAIL_SPECIAL_IDS.every(id => allEndings.has(id)) && unlockAchievement('ach_fail_collection')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_fail_collection'));
    }

    // 全能建筑师（结局时再次检查）
    if (gameState.attributes.design >= 200 && gameState.attributes.software >= 200 && unlockAchievement('ach_max_both')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_max_both'));
    }

    return newlyUnlocked;
}

// 朝圣图鉴检测
export function checkAtlasAchievements(visitedCount) {
    const newlyUnlocked = [];
    if (visitedCount >= 12 && unlockAchievement('ach_atlas_all')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_atlas_all'));
    }
    return newlyUnlocked;
}

// 身份抽卡检测
export function checkIdentityAchievements(rarity, redrawCount) {
    const newlyUnlocked = [];
    if (rarity === 'legendary' && unlockAchievement('ach_legendary_identity')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_legendary_identity'));
    }
    if (redrawCount >= 3 && unlockAchievement('ach_redraw_all')) {
        newlyUnlocked.push(achievements.find(a => a.id === 'ach_redraw_all'));
    }
    return newlyUnlocked;
}

// ===== 跨局导师历史存储 =====

const TUTOR_HISTORY_KEY = 'archsim_tutor_history';

function getHistoricalTutors() {
    try {
        const stored = localStorage.getItem(TUTOR_HISTORY_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
}

function saveHistoricalTutors(tutorIds) {
    localStorage.setItem(TUTOR_HISTORY_KEY, JSON.stringify(tutorIds));
}
