// 考公系统 - 行测题库 + 岗位分数线

// 考公岗位三档
export const civilTiers = [
    { id: 'civilA', tier: '部委级', name: '自然资源部 / 住建部', icon: '🏛️', difficulty: '极高', passScore: 120, description: '最高级别公务员岗位，竞争异常惨烈。' },
    { id: 'civilB', tier: '省市级', name: '规划局 / 测绘院', icon: '🏢', difficulty: '高', passScore: 90, description: '省市级规划与建设管理岗，专业对口。' },
    { id: 'civilC', tier: '基层', name: '乡镇建设岗', icon: '🏘️', difficulty: '低', passScore: 60, description: '基层建设管理，虽不起眼但稳如磐石。' },
];

// 行测15道题库
export const civilQuestions = [
    // 言语理解与表达 1-2
    { id: 'cq1', question: '填入括号内最恰当的词语："优秀的城市规划不应仅是纸上的（ ），更应是能够落地生根、服务民生的（ ）。"', options: ['蓝图 / 实践', '臆想 / 现实', '构想 / 成果', '幻梦 / 蓝图'], answer: 0 },
    { id: 'cq2', question: '找出下列句子中有语病的一项：', options: ['建筑师在设计中应当充分考虑当地的气候特征。', '经过多方论证，该历史街区的修复方案得到了专家的一致认可。', '通过实施零碳园区计划，使该地区的能源消耗大幅下降。', '城市更新的本质是为了提升居民的生活质量。'], answer: 2 },
    // 判断推理 3-6
    { id: 'cq3', question: '逻辑推理：如果所有的建筑师都熬夜，而张三从不熬夜。那么：', options: ['张三是一个优秀的建筑师', '张三不是建筑师', '张三是一个养生专家', '建筑师都不如张三'], answer: 1 },
    { id: 'cq4', question: '图形推理：正方形、三角形、圆形、正方形、三角形，下一个应该是？', options: ['正方形', '三角形', '圆形', '梯形'], answer: 2 },
    { id: 'cq5', question: '类比推理：混凝土 : 水泥', options: ['硫酸纸 : 绘图笔', '模型 : 雪弗板', '电脑 : 显卡', '导师 : 熬夜'], answer: 1 },
    { id: 'cq6', question: '常识判断：下列哪部法规是建筑行业最基础的法律？', options: ['《中华人民共和国物权法》', '《中华人民共和国建筑法》', '《中华人民共和国刑法》', '《劳动法》'], answer: 1 },
    // 数学运算与资料分析 7-10
    { id: 'cq7', question: '某城市规定绿化率不得低于35%。若某项目基地面积为2000平方米，则其绿地面积至少应为多少？', options: ['600 平方米', '700 平方米', '800 平方米', '1000 平方米'], answer: 1 },
    { id: 'cq8', question: '甲、乙两家设计院竞争。甲设计院效率高，10天能画完一套图；乙设计院需要15天。若两家合作，几天画完？', options: ['5 天', '6 天', '7.5 天', '12.5 天'], answer: 1 },
    { id: 'cq9', question: '比例尺计算：在1:2000的地形图上，一段围墙长5厘米，实际长度是多少米？', options: ['10 米', '100 米', '500 米', '1000 米'], answer: 1 },
    { id: 'cq10', question: '某院去年总收入2000万，其中成本支出1200万。今年总收入增加20%，成本持平。则今年利润增加了多少？', options: ['20%', '40%', '50%', '100%'], answer: 2 },
    // 建筑行政实务 11-15
    { id: 'cq11', question: '在城乡规划中，"红线"通常指的是？', options: ['建筑控制线', '用地边界线', '道路中心线', '消防车道线'], answer: 1 },
    { id: 'cq12', question: '下列哪种情况不需要办理报建手续？', options: ['室内承重墙拆除', '改变建筑使用功能', '阳台封闭', '购买新办公桌'], answer: 3 },
    { id: 'cq13', question: '在公文中，标题"关于XX建筑设计方案的批复"属于？', options: ['请示', '通知', '下行文', '平级函'], answer: 2 },
    { id: 'cq14', question: '国家级历史文化名城的评定标准不包括？', options: ['保存文物特别丰富', '具有重大历史价值', '必须有院士居住', '现状格局基本完整'], answer: 2 },
    { id: 'cq15', question: '行测常识：下列我国古建筑中，被誉为"中国木结构建筑之王"的是？', options: ['故宫太和殿', '佛光寺东大殿', '应县木塔', '悬空寺'], answer: 2 },
];

/**
 * 随机抽10道行测题
 */
export function drawCivilQuestions() {
    const shuffled = [...civilQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
}

/**
 * 考公分数公式：答对题数 × 10 × (1 + software/300)
 */
export function calculateCivilScore(correctCount, softwareAbility) {
    const base = correctCount * 10;
    const bonus = 1 + softwareAbility / 300;
    return Math.round(base * bonus);
}
