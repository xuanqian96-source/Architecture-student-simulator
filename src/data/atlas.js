// 建筑朝圣之旅 - 12座世界经典建筑数据 + 里程碑奖励

export const atlasBuildings = [
    {
        id: 'savoye',
        name: '萨伏伊别墅',
        architect: '勒·柯布西耶',
        year: 1931,
        location: '法国普瓦西',
        flag: '🇫🇷',
        icon: '🏛️',
        style: '现代主义',
        cost: 3000,
        weeks: 2,
        description: '现代建筑五原则的完美实践——底层架空、自由平面、自由立面、横向长窗、屋顶花园，全部体现在这座白色方盒子里。',
        quote: '"住宅是居住的机器。" —— 柯布西耶'
    },
    {
        id: 'fallingwater',
        name: '流水别墅',
        architect: '弗兰克·劳埃德·赖特',
        year: 1939,
        location: '美国宾夕法尼亚',
        flag: '🇺🇸',
        icon: '🌊',
        style: '有机建筑',
        cost: 3500,
        weeks: 2,
        description: '悬挑在瀑布之上的住宅，建筑与自然完美融合的教科书级案例，每一块石材都在诉说有机建筑的哲学。',
        quote: '"建筑师必须是对生活最敏感的诠释者。" —— 赖特'
    },
    {
        id: 'church_of_light',
        name: '光之教堂',
        architect: '安藤忠雄',
        year: 1989,
        location: '日本大阪',
        flag: '🇯🇵',
        icon: '✝️',
        style: '极简主义',
        cost: 4000,
        weeks: 3,
        description: '清水混凝土墙上一道十字形切口，让光成为最纯粹的建筑材料。极简到极致，反而拥有了无穷的精神力量。',
        quote: '"光赋予美以戏剧性。" —— 安藤忠雄'
    },
    {
        id: 'farnsworth',
        name: '范斯沃斯住宅',
        architect: '密斯·凡·德·罗',
        year: 1951,
        location: '美国伊利诺伊',
        flag: '🇺🇸',
        icon: '🪟',
        style: '国际主义',
        cost: 4500,
        weeks: 3,
        description: '钢与玻璃的极致表达，通透到几乎消失的墙体，让室内与自然之间只剩一层薄薄的玻璃。"少即是多"的巅峰之作。',
        quote: '"少即是多。" —— 密斯'
    },
    {
        id: 'ronchamp',
        name: '朗香教堂',
        architect: '勒·柯布西耶',
        year: 1955,
        location: '法国朗香',
        flag: '🇫🇷',
        icon: '⛪',
        style: '粗野主义',
        cost: 5000,
        weeks: 3,
        description: '柯布西耶晚年最具雕塑感的作品。曲面屋顶像一顶修女帽，不规则的彩色小窗洒下斑斓光影，颠覆了所有人对他的认知。',
        quote: '"建筑是光线下形体的精彩表演。" —— 柯布西耶'
    },
    {
        id: 'sydney_opera',
        name: '悉尼歌剧院',
        architect: '约恩·伍重',
        year: 1973,
        location: '澳大利亚悉尼',
        flag: '🇦🇺',
        icon: '🎭',
        style: '表现主义',
        cost: 6000,
        weeks: 3,
        description: '海港边绽放的白色贝壳群，超越时代的结构创新让施工延期14年，但最终成为全世界最具辨识度的建筑之一。',
        quote: '"伍重的天才构思将矗立数百年。" —— 弗兰克·盖里'
    },
    {
        id: 'kanazawa',
        name: '金泽21世纪美术馆',
        architect: 'SANAA',
        year: 2004,
        location: '日本金泽',
        flag: '🇯🇵',
        icon: '🔵',
        style: '当代极简',
        cost: 7000,
        weeks: 4,
        description: '一个没有正面的圆形美术馆，360°通透的玻璃幕墙消除了建筑与城市的边界。轻盈、民主、开放，这就是21世纪的建筑。',
        quote: '"我们想创造一个像公园一样的美术馆。" —— 妹岛和世'
    },
    {
        id: 'guggenheim_bilbao',
        name: '毕尔巴鄂古根海姆',
        architect: '弗兰克·盖里',
        year: 1997,
        location: '西班牙毕尔巴鄂',
        flag: '🇪🇸',
        icon: '🌀',
        style: '解构主义',
        cost: 8000,
        weeks: 4,
        description: '钛合金鳞片包裹的流线型巨兽，靠一座博物馆复兴了一座衰败的工业城市。"毕尔巴鄂效应"从此成为城市更新的传奇。',
        quote: '"建筑应该表达我们这个时代的精神。" —— 盖里'
    },
    {
        id: 'barcelona_pavilion',
        name: '巴塞罗那德国馆',
        architect: '密斯·凡·德·罗',
        year: 1929,
        location: '西班牙巴塞罗那',
        flag: '🇪🇸',
        icon: '🟫',
        style: '现代主义',
        cost: 9000,
        weeks: 4,
        description: '大理石、缟玛瑙和玻璃——流动空间的开山之作。墙体不再是封闭的容器，而是自由滑动的平面，定义了现代建筑的空间美学。',
        quote: '"上帝在细节中。" —— 密斯'
    },
    {
        id: 'pantheon',
        name: '罗马万神殿',
        architect: '古罗马（哈德良皇帝重建）',
        year: 125,
        location: '意大利罗马',
        flag: '🇮🇹',
        icon: '🏟️',
        style: '古典主义',
        cost: 10000,
        weeks: 4,
        description: '两千年前的混凝土穹顶至今无裂缝，穹顶中央的圆洞是唯一的光源——让光雨时间在殿堂内缓缓旋转，堪称人类建筑史上最伟大的空间。',
        quote: '"万神殿是时间的神庙。" —— 余秋雨'
    },
    {
        id: 'jewish_museum',
        name: '柏林犹太博物馆',
        architect: '丹尼尔·里伯斯金',
        year: 2001,
        location: '德国柏林',
        flag: '🇩🇪',
        icon: '⚡',
        style: '解构主义',
        cost: 12000,
        weeks: 4,
        description: '锯齿形的锌板外墙像一道伤痕，倾斜的地面和狭窄的通道让你在空间中体验历史的沉重。建筑可以不说一句话，却让你泪流满面。',
        quote: '"建筑是凝固的音乐，也是凝固的记忆。" —— 里伯斯金'
    },
    {
        id: 'louvre_abudhabi',
        name: '阿布扎比卢浮宫',
        architect: '让·努维尔',
        year: 2017,
        location: '阿联酋阿布扎比',
        flag: '🇦🇪',
        icon: '💎',
        style: '当代主义',
        cost: 15000,
        weeks: 4,
        description: '直径180米的穹顶由7850颗星星组成，阳光穿透后形成"光之雨"洒落海面。沙漠与海洋之间，这是21世纪最奢华的文化殿堂。',
        quote: '"我想创造一片阿拉伯式的光之雨。" —— 让·努维尔'
    }
];

// 里程碑奖励
export const atlasMilestones = [
    {
        count: 3,
        title: '🌱 初窥门径',
        reward: { design: 8 },
        desc: '走出课本，亲眼见证大师之作。你的设计直觉正在觉醒！'
    },
    {
        count: 6,
        title: '📐 视野开阔',
        reward: { design: 5, software: 5, portfolioScore: 20 },
        desc: '六座经典建筑的空间体验，让你对形式与技术有了全新理解。'
    },
    {
        count: 9,
        title: '🌟 建筑行者',
        reward: { design: 8, portfolioScore: 50 },
        desc: '九座朝圣之旅！你的眼界已经超越了大多数同龄人。'
    },
    {
        count: 12,
        title: '👑 大师巡礼',
        reward: { design: 15, portfolioScore: 100 },
        desc: '十二座建筑，一段传奇旅程。你已经拥有了大师级的审美视野！'
    }
];
