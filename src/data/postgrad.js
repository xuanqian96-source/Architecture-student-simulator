// 保研系统 - 院校库 + 复试题库

// 保研院校三档
export const postgradTiers = [
    {
        id: 'tierS',
        tier: 'S',
        name: '清华 / 同济 / 东南',
        icon: '👑',
        psRequirement: 1200,
        designRequirement: 180,
        passScore: 50, // 满分50，必须全对
        description: '全球建筑学殿堂级平台，容错率为零。'
    },
    {
        id: 'tierA',
        tier: 'A',
        name: '老八校 / 名牌985',
        icon: '🎓',
        psRequirement: 1000,
        designRequirement: 180,
        passScore: 35,
        description: '允许少量平庸回答，但核心逻辑必须正确。'
    },
    {
        id: 'tierB',
        tier: 'B',
        name: '本校 / 211 / 名省院',
        icon: '📚',
        psRequirement: 800,
        designRequirement: 180,
        passScore: 25,
        description: '及格水平即可，展现基础专业素养。'
    }
];

// 保研基础门槛
export const postgradRequirements = {
    minWeek: 48, // 大四结束（第4年12周 = 48周后）
    minPS: 800,
    minDesign: 180,
    maxWarnings: 0 // 不能有任何挂科
};

// 保研复试15道题库
export const interviewQuestions = [
    {
        id: 'iq1',
        question: '如何理解"建构" (Tectonics) 在你作品中的体现？',
        options: [
            { text: '结构逻辑即形式来源，力传导路径清晰且诚实。', score: 10 },
            { text: '就是把模型做得细一点，多加点梁和柱子。', score: 5 },
            { text: '为了好看，我在石膏板后面加了好多装饰钢管。', score: 0 },
        ]
    },
    {
        id: 'iq2',
        question: '面对高密度城市问题，建筑师的首要任务是什么？',
        options: [
            { text: '重塑公共领域，在垂直维度上挖掘空间的社会性潜力。', score: 10 },
            { text: '提高容积率，让开发商和甲方更满意。', score: 5 },
            { text: '建议大家都回农村去。', score: 0 },
        ]
    },
    {
        id: 'iq3',
        question: '你认为人工智能 (AI) 会取代建筑师吗？',
        options: [
            { text: 'AI 是工具的进化，它解放了低效率劳动，但无法替代人文关怀的决策。', score: 10 },
            { text: '只要我渲染图画得快，AI 就追不上我。', score: 5 },
            { text: '会，我已经准备转行去送外卖了。', score: 0 },
        ]
    },
    {
        id: 'iq4',
        question: '在旧城更新中，如何平衡"原真性"与"商业化"？',
        options: [
            { text: '提取场地记忆片段，以微更新手法置入新业态，激发社区内生动力。', score: 10 },
            { text: '把老房子拆掉，盖成看起来像古董的新建筑。', score: 5 },
            { text: '全部刷成网红墙，招引奶茶店进驻。', score: 0 },
        ]
    },
    {
        id: 'iq5',
        question: '描述一下你对皮特·卒姆托 (Peter Zumthor) 作品"氛围"的理解。',
        options: [
            { text: '是材料、光影与尺度在特定感官下的精密化学反应。', score: 10 },
            { text: '房子盖得很厚，看起来很有钱但很低调。', score: 5 },
            { text: '这种方案不适合赶 DDL，出图太慢了。', score: 0 },
        ]
    },
    {
        id: 'iq6',
        question: '如果你的方案流线与消防规范冲突，你会怎么做？',
        options: [
            { text: '重新推敲空间逻辑，在满足规范的前提下寻求形式突破。', score: 10 },
            { text: '在图纸上把消防栓和疏散距离稍微缩放一下。', score: 5 },
            { text: '假装没看见，评图老师一般不查这个。', score: 0 },
        ]
    },
    {
        id: 'iq7',
        question: '你如何看待当代建筑中"参数化"表现的泛滥？',
        options: [
            { text: '工具性不应凌驾于空间目的性之上，异形不代表逻辑。', score: 10 },
            { text: '因为 Grasshopper 插件比较好用，看起来很先锋。', score: 5 },
            { text: '只要连上线，我的模型就是艺术品。', score: 0 },
        ]
    },
    {
        id: 'iq8',
        question: '建筑学的本质是什么？',
        options: [
            { text: '在重力与社会性的博弈中，为人提供有尊严的庇护所。', score: 10 },
            { text: '画图，改图，熬夜，然后拿一个学位。', score: 5 },
            { text: '是一种高级的乐高拼搭游戏。', score: 0 },
        ]
    },
    {
        id: 'iq9',
        question: '你最喜欢的建筑师是谁？为什么？',
        options: [
            { text: '路易斯·康，因为他让沉默的砖块拥有了神性的光辉。', score: 10 },
            { text: '扎哈，因为她的流线很酷，模型很好看。', score: 5 },
            { text: '我自己，我觉得我的期末方案天下第一。', score: 0 },
        ]
    },
    {
        id: 'iq10',
        question: '如何处理建筑与场地的"叙事关系"？',
        options: [
            { text: '挖掘土地的厚度，让建筑成为场地历史逻辑的自然延伸。', score: 10 },
            { text: '拍几张场地的照片，然后放在分析图的背景里。', score: 5 },
            { text: '直接把我的方案放进去，帅就行了。', score: 0 },
        ]
    },
    {
        id: 'iq11',
        question: '对于"功能随行 (Form follows function)"这一观点，你怎么看？',
        options: [
            { text: '它是现代主义的基石，但在当代我们需要关注功能以外的社会学意义。', score: 10 },
            { text: '房子必须好用，不好用的房子就是雕塑。', score: 5 },
            { text: '只要长得好看，功能可以随便塞进去。', score: 0 },
        ]
    },
    {
        id: 'iq12',
        question: '如果你的作品集里有一张图逻辑错了，被我当面指出，你如何回应？',
        options: [
            { text: '承认局限性，并当场提出一种可能的修正逻辑。', score: 10 },
            { text: '辩解说这是某种"实验性"的模糊表达。', score: 5 },
            { text: '这是电脑崩溃导致的，不关我的事。', score: 0 },
        ]
    },
    {
        id: 'iq13',
        question: '你认为碳中和背景下，木结构的前景如何？',
        options: [
            { text: '它是未来绿色建筑的核心，需要在现代加工工艺下重新定义其建构美学。', score: 10 },
            { text: '比较环保，但感觉防火性能很让人担心。', score: 5 },
            { text: '木头太贵了，不建议在现实项目里用。', score: 0 },
        ]
    },
    {
        id: 'iq14',
        question: '如何理解库哈斯在《癫狂的纽约》中提到的"拥挤文化"？',
        options: [
            { text: '是对都市高密度下自发秩序与社会变异的深刻洞察。', score: 10 },
            { text: '纽约人太多了，所以建筑必须造得很密集。', score: 5 },
            { text: '这本书太厚了，我只看了封面。', score: 0 },
        ]
    },
    {
        id: 'iq15',
        question: '如果这次保研没录取你，你打算怎么办？',
        options: [
            { text: '考研或出国，我对建筑的热爱不取决于这一个结果。', score: 10 },
            { text: '找个设计院去画施工图，认清现实。', score: 5 },
            { text: '发朋友圈痛骂学院，然后准备考公。', score: 0 },
        ]
    }
];

/**
 * 检查是否满足保研基础门槛
 */
export function canApplyPostgrad(state) {
    const ps = getPortfolioScore(state.portfolio);
    return (
        state.progress.totalWeeks >= postgradRequirements.minWeek &&
        ps >= postgradRequirements.minPS &&
        state.attributes.design >= postgradRequirements.minDesign &&
        state.history.warningCount <= postgradRequirements.maxWarnings
    );
}

/**
 * 计算作品集总分（直接累加质量分）
 */
export function getPortfolioScore(portfolio) {
    return portfolio.reduce((sum, p) => sum + (p.qualityScore || 0), 0);
}

/**
 * 从15题中随机抽取5题
 */
export function drawInterviewQuestions() {
    const shuffled = [...interviewQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
}
