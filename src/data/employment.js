// 实习与求职系统 - 岗位库

// 实习岗位库（每年可选1次，代价：每周压力+10）
export const INTERN_WEEKLY_STRESS = 10;

export const internships = [
    // 建筑类
    { id: 'intern_local', name: '普通设计院', type: '建筑', icon: '🏗️', requirements: { design: 60 }, description: '在地方院画住宅标准层，学会用天正的第一步。' },
    { id: 'intern_provincial', name: '省级大院', type: '建筑', icon: '🏛️', requirements: { design: 100, software: 80 }, description: '接触大型公建项目，见识真正的甲级出图标准。' },
    { id: 'intern_studio', name: '知名私人事务所', type: '建筑', icon: '✨', requirements: { design: 120, ps: 300 }, description: '和主持建筑师推敲一个窗户比例到凌晨三点。' },
    { id: 'intern_developer', name: '甲方地产', type: '建筑', icon: '🏠', requirements: { software: 100 }, description: '站在审图的那一边，学会用甲方思维看方案。' },
    // 转行类
    { id: 'intern_tech', name: '互联网大厂产品助理', type: '转行', icon: '📱', requirements: { software: 100, stressBelow: 60 }, description: '用推敲平面图的逻辑去画 App 原型图。' },
    { id: 'intern_game', name: '游戏公司场景建模', type: '转行', icon: '🎮', requirements: { software: 130 }, description: '不用考虑消防规范的3D建模，天堂一般的存在。' },
];

// 最终求职岗位库（大五激活）
export const careerPaths = {
    architecture: [
        {
            id: 'job_s', tier: 'S', name: '先锋大师事务所', firms: 'OMA / Zaha Hadid / MAD', icon: '🌟',
            requirements: { ps: 1000, software: 170, internType: 'intern_studio' },
            salary: 15000,
            description: '恭喜你，你成为了全球最高级的"人肉插件"。你每天在北上广深的云端办公室里修改着那些"改变人类空间认知"的异形曲面，虽然你甚至没有时间下楼吃顿热饭，但你的朋友圈定位足以让所有老同学酸掉牙。'
        },
        {
            id: 'job_a_foreign', tier: 'A', name: '顶级外企', firms: 'Gensler / SOM / HOK', icon: '🏢',
            requirements: { ps: 850, ielts: 7.0, software: 150 },
            salary: 10000,
            description: '你成为了穿梭在甲级写字楼里的精致绘图员。你的英文名比中文名更响亮，你熟练地在 PPT 里放进各种纸片人填充景观。虽然你做的只是厕所大样和地下室排布，但你的咖啡杯上总有最标准的拉花。'
        },
        {
            id: 'job_a_domestic', tier: 'A', name: '国内大院', firms: '华建集团 / 北京院 / 中南院', icon: '🏣',
            requirements: { ps: 700, schoolTier: ['elite', 'newElite'] },
            salary: 7500,
            description: '你进入了行业的稳健巨轮。这里的规章制度比你的设计说明还厚。你开始学习如何与审图办斗智斗勇，如何把标准图集背得滚瓜烂熟。你的脊椎开始侧弯，但你的五险一金交得最稳。'
        },
        {
            id: 'job_b', tier: 'B', name: '知名工作室', firms: '大舍 / 标准营造 / 阿科米星', icon: '🎨',
            requirements: { ps: 450, design: 160 },
            salary: 5000,
            description: '你和老板在漏水的阁楼里讨论着"空间的精神性"，却在楼下的沙县小吃里讨论着下个月的房租。你拥有极高的"艺术自由"，这意味着你不仅要画方案，还要自己洗模型、修打印机以及帮老板接孩子。'
        },
        {
            id: 'job_c', tier: 'C', name: '地方设计院', firms: '某省/市/县建筑设计院', icon: '📐',
            requirements: { ps: 250 },
            salary: 3500,
            description: '欢迎来到建筑界的"富士康"。你每天的任务是复刻那些十年前就定型的户型。你不再纠结什么光影叙事，你只关心老板今天能不能别再接那种"明天就要出方案"的安置房项目。'
        }
    ],
    pivot: [
        {
            id: 'job_game', tier: 'S', name: '游戏场景专家', firms: '腾讯 / 网易 / 米哈游', icon: '🎮',
            requirements: { software: 190, internCount: { type: 'intern_game', min: 2 } },
            salary: 28000,
            description: '建筑学的逻辑让你在 3D 建模界成为了"降维打击"的存在。你不再纠结容积率，你只纠结渲染图的帧数。虽然你依然熬夜，但你的年终奖足以让你在老同学群里禁言所有人。'
        },
        {
            id: 'job_pm', tier: 'A', name: '大厂产品经理', firms: '阿里 / 百度 / 字节', icon: '💼',
            requirements: { software: 120, design: 100, internCount: { type: 'intern_tech', min: 2 } },
            salary: 22000,
            description: '你终于明白，画图的逻辑和画 App 原型图的逻辑是一样的。你每天讨论"用户痛点"而非"空间痛点"，虽然你偶尔会怀念推敲体块的日子，但看到工资卡余额后，你觉得这种怀念非常廉价。'
        },
        {
            id: 'job_freelance', tier: 'C', name: '独立插画师', firms: '自由职业 (Freelance)', icon: '🖌️',
            requirements: { ps: 150, software: 100 },
            salary: 2000,
            description: '门槛最低的逃离方式。你烧掉了硫酸纸，买了一块数位屏。你靠着给游戏画立绘或给杂志画插图维持生计。虽然没有社保，但你每天可以睡到中午，这是那些在设计院拉线的同学永远无法企及的奢侈。'
        }
    ]
};

/**
 * 检查实习门槛
 */
export function canIntern(intern, state) {
    const r = intern.requirements;
    if (r.design && state.attributes.design < r.design) return false;
    if (r.software && state.attributes.software < r.software) return false;
    if (r.ps) {
        const ps = state.portfolio.reduce((s, p) => s + (p.qualityScore || 0), 0);
        if (ps < r.ps) return false;
    }
    if (r.stressBelow && state.attributes.stress >= r.stressBelow) return false;
    return true;
}

/**
 * 检查求职门槛
 */
export function canApplyJob(job, state) {
    const r = job.requirements;
    const ps = state.portfolio.reduce((s, p) => s + (p.qualityScore || 0), 0);
    if (r.ps && ps < r.ps) return false;
    if (r.software && state.attributes.software < r.software) return false;
    if (r.design && state.attributes.design < r.design) return false;
    if (r.ielts && (state.bestIelts || 0) < r.ielts) return false;
    if (r.schoolTier && !r.schoolTier.includes(state.identity?.school?.id)) return false;
    if (r.internType) {
        const count = (state.internHistory || []).filter(i => (i.id || i) === r.internType).length;
        if (count < 1) return false;
    }
    if (r.internCount) {
        const count = (state.internHistory || []).filter(i => (i.id || i) === r.internCount.type).length;
        if (count < r.internCount.min) return false;
    }
    return true;
}
