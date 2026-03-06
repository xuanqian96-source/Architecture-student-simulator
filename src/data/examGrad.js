// 考研系统 - 题库 + 院校分数线

// 考研院校三档
export const examGradTiers = [
    { id: 'gradA', tier: 'A', name: '清华 / 同济 / 东南 / 天大', icon: '👑', difficulty: '高', passScore: 380, description: '巅峰对决，只有最强者能活下来。' },
    { id: 'gradB', tier: 'B', name: '其他985 / 老八校', icon: '🎓', difficulty: '中', passScore: 350, description: '稳健型选择，但依旧竞争激烈。' },
    { id: 'gradC', tier: 'C', name: '普通一本 / 二本', icon: '📚', difficulty: '低', passScore: 300, description: '相对容易的起步平台。' },
];

// 考研10道题库
export const examGradQuestions = [
    // 建筑史与理论常识 1-5
    { id: 'eg1', question: '密斯·凡·德·罗 (Mies van der Rohe) 的设计哲学是？', options: ['Less is More', 'Less is Bore', 'Form follows Function', 'God is in the details'], answer: 0 },
    { id: 'eg2', question: '雅典卫城帕特农神庙采用的是哪种柱式？', options: ['爱奥尼柱式', '多立克柱式', '柯林斯柱式', '复合柱式'], answer: 1 },
    { id: 'eg3', question: '下列哪项不属于勒·柯布西耶的"新建筑五点"？', options: ['底层架空', '自由平面', '坡屋顶', '带形长窗'], answer: 2 },
    { id: 'eg4', question: '中国古代建筑中，屋顶等级最高的是？', options: ['悬山顶', '硬山顶', '庑殿顶', '歇山顶'], answer: 2 },
    { id: 'eg5', question: '下列哪位建筑师被称为"参数化女王"？', options: ['林徽因', '扎哈·哈迪德', '妹岛和世', '贝聿铭'], answer: 1 },
    // 快题表达与技术逻辑 6-10
    { id: 'eg6', question: '在快题表现中，表现植被阴影通常是为了体现建筑的？', options: ['材料感', '体量感与虚实关系', '绿化率', '施工难度'], answer: 1 },
    { id: 'eg7', question: '建筑日照分析的主要目的是确定？', options: ['建筑颜色', '窗户尺寸', '建筑间距与朝向', '屋顶排水方向'], answer: 2 },
    { id: 'eg8', question: '下列软件中，哪一个是基于 BIM 技术的核心平台？', options: ['AutoCAD', 'Photoshop', 'Revit', 'Rhino'], answer: 2 },
    { id: 'eg9', question: '在 1:100 的平面图中，1.2 米宽的门在图纸上应表现为？', options: ['1.2 厘米', '12 厘米', '1.2 毫米', '12 毫米'], answer: 3 },
    { id: 'eg10', question: '爆炸轴测图 (Exploded View) 的核心作用是？', options: ['看起来很酷', '展示建筑各部分的构造与组成关系', '表现爆炸后的效果', '计算建筑总价'], answer: 1 },
];

/**
 * 限时60秒，随机抽5题
 */
export function drawExamGradQuestions() {
    const shuffled = [...examGradQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
}

/**
 * 考研分数公式：答对题数 × 基础分(80) × (1 + design/500) = 初试分数
 * 每题基础80分，5题全对base=400，加上设计加成可以到480+
 */
export function calculateExamGradScore(correctCount, designAbility) {
    const basePerQuestion = 80;
    const base = correctCount * basePerQuestion;
    const designBonus = 1 + designAbility / 500;
    return Math.round(base * designBonus);
}
