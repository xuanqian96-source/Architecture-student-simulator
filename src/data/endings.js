// 结局系统 - 全量18种毕业结局语料库

export const endings = {
    // 1. 保研路径
    postgrad_s: {
        id: 'postgrad_s',
        name: '顶级学阀的接班人',
        image: '👑',
        type: 'S',
        points: 500,
        hint: '大四后选择保研清华/同济/东南等S档院校并被录取',
        description: '在公示名单确定的那一刻，你推开了工作室那扇由于合页老化而嘎吱作响的门。你不再需要面对大五惨烈的招聘和考研。在未来的三年里，你将在国内建筑学的最高殿堂里，与那些曾经只出现在你课本封面上的大师们共同探讨"空间的意志"。你看着桌上堆积如山的硫酸纸，微笑着把它们扔进了碎纸机——毕竟，现在的你，已经拿到了通往学术贵族的入场券。'
    },
    postgrad_a_b: {
        id: 'postgrad_a_b',
        name: '稳健的学术螺丝钉',
        image: '🎓',
        type: 'B',
        points: 200,
        hint: '大四后选择保研老八校/名牌985等A/B档院校并被录取',
        description: '没有惊天动地的欢呼，只有一种"如释重负"的脱力感。你留在了熟悉的校园，熟悉的导师身边。虽然这里没有 GSD 的光环，也没有顶级名校的资源，但保研的安稳让你有资本在接下来的三年里慢慢思考：自己到底是为了理想在设计，还是为了那张文凭。导师拍了拍你的肩膀："既然留下来了，那个横向项目的厕所大样你带学弟画一下？"'
    },

    // 2. 出国路径
    abroad_s: {
        id: 'abroad_s',
        name: '哈佛/AA 的朝圣者',
        image: '✈️',
        type: 'S',
        points: 500,
        hint: '大五留学申请GSD/Bartlett等S/A+档院校并被录取',
        description: '你拿到了那张通往波士顿或伦敦的单程机票。雅思 8.5 的成绩单是你最后的盔甲，1200 分的作品集是你最硬的通货。你将在 GSD 的红酒会上，或者 AA 的实验工坊里，与来自全球的卷王们重新定义"建筑"。你唯一的遗憾是，父母为了供你去追逐这个昂贵的梦想，可能要把家里那套带有"欧式浮雕线脚"的房子卖掉了。'
    },
    abroad_a_b: {
        id: 'abroad_a_b',
        name: '欧罗巴的游学工匠',
        image: '🏛️',
        type: 'B',
        points: 200,
        hint: '大五留学申请TUD/HKU等A/B档院校并被录取',
        description: '你选择了更具建构精神的欧洲。在苏黎世或代尔夫特的寒风中，你开始学习如何像石头一样思考。你终于发现，原来建筑学不只有参数化和炫技，还有对一块砖、一个节点的极致尊重。你的朋友圈里全是阿尔卑斯山的雪景和性冷淡的混凝土墙，只有你自己知道，为了省下生活费，你已经连续吃了一个月的意面。'
    },

    // 3. 求职路径
    job_s: {
        id: 'job_s',
        name: '先锋事务所的顶级耗材',
        image: '🌟',
        type: 'S',
        points: 500,
        hint: '大五求职先锋大师事务所(S档)并被录用',
        description: '你入职了那家外号"修仙院"的顶级事务所。起薪 15k 的代价，是每天凌晨三点在工作室看日出。你参与的项目确实改变了城市，虽然你参与的部分只是"卫生间排布"和"旋转楼梯细部修正"。你在这个圈子的最前沿，享受着同龄人羡慕的目光，也承受着由于长期握鼠标导致的肌腱炎。这，就是你大一时期梦寐以求的大师之路吗？'
    },
    job_a: {
        id: 'job_a',
        name: '体制内的大院舵手',
        image: '🏢', // 包括顶级外企和国内大院
        type: 'A',
        points: 350,
        hint: '大五求职顶级外企或国内大院(A档)并被录用',
        description: '你穿上了白衬衫，戴上了工牌，走进了那栋四平八稳的办公大楼。你的生活变得极其规律：早上九点打卡，晚上九点（通常）下班，周末偶尔加班改图。你不再谈论空间的诗意，你现在是《建筑设计防火规范》的守护者。虽然起薪 7.5k 略显平庸，但看到五险一金和按时缴纳的公积金，你觉得这种"平庸"其实挺香的。'
    },
    job_b: {
        id: 'job_b',
        name: '独立工作室的理想主义者',
        image: '🎨',
        type: 'B',
        points: 200,
        hint: '大五求职知名工作室(B档)并被录用',
        description: '你拒绝了大院的安稳和外企的精致，选择扎进那家藏在旧厂房里的独立工作室。起薪 5k 刚好够你在工作室楼下吃沙县。老板每天带你推敲一个窗套的比例，带你去工地摸每一块砖。虽然你兜里没钱，但你觉得自己正在接近建筑学的真谛。直到下个月房租单寄来时，你才发现，理想主义的成本确实有点高，但你依然觉得值。'
    },
    job_c: {
        id: 'job_c',
        name: '地方院的改图机器',
        image: '📐',
        type: 'B',
        points: 150,
        hint: '大五求职地方设计院(C档)并被录用',
        description: '欢迎来到建筑界的富士康。你每天的任务是复刻那些十年前就定型的户型，或者帮老板把某个地产商的欧式外立面"稍微改得先锋一点"。虽然月薪 3.5k 勉强够你在城中村付房租，但你学会了在 15 分钟内拉完一个地下室排布的绝技。你看着窗外的夕阳，心想：原来建筑学最终的归宿，真的是拼多多。'
    },

    // 4. 转行路径
    pivot_game: {
        id: 'pivot_game',
        name: '游戏世界的造物主',
        image: '🎮',
        type: 'A',
        points: 350,
        hint: '大五求职游戏场景专家(S档)并被录用',
        description: '你彻底烧掉了硫酸纸，买了一台顶配的外星人。在游戏大厂里，你发现建筑学的空间逻辑让你成为了"神"。你不再需要考虑消防、日照和容积率，你只关心渲染帧数和玩家的视觉沉浸感。当你在老同学群里发出一张 28k 月薪的工资单时，群里死一般的寂静。是的，你逃离了建筑坑，在数字荒原里开辟了属于自己的新大陆。'
    },
    pivot_pm: {
        id: 'pivot_pm',
        name: '大厂产品的逻辑大师',
        image: '📱',
        type: 'A',
        points: 350,
        hint: '大五求职大厂产品经理(A档)并被录用',
        description: '你发现，画 App 原型图其实和画平面图没什么区别——都是在有限的尺度里塞进复杂的逻辑。你用推敲剖面图的劲头去推敲用户点击流，用应对比选方案的耐心去应对老板的修改意见。当你拿到 22k 起薪的那天，你终于明白，原来"降维打击"是真实存在的。虽然你偶尔会怀念推敲体块的日子，但看到食堂免费的下午茶，你觉得这种怀念非常多余。'
    },
    pivot_freelance: {
        id: 'pivot_freelance',
        name: '独立插画师的自由',
        image: '🖌️',
        type: 'B',
        points: 150,
        hint: '大五求职独立插画师(C档)并开始自由职业',
        description: '你退掉了工作室的座位，带走了那把伴随你五年的工学椅。你现在是一名自由职业者，靠着给甲方画效果图或者画二次元立绘维持生计。虽然没有社保，没有稳定的收入（月薪 2k 起步），但你拥有了建筑生最奢侈的财富：睡眠自由。你偶尔会帮老同学改个方案赚点外快，顺便听听他们抱怨设计院又降薪了，然后心满意足地睡个午觉。'
    },

    // 5. 考研/考公
    grad_s: {
        id: 'grad_s',
        name: '学术之巅 - 老八校研究生',
        image: '🏛️',
        type: 'S',
        points: 500,
        hint: '大五考研报考清华/同济/东南/天大等A档院校并被录取',
        description: '你终于杀回了那个梦寐以求的殿堂。380+ 的初试成绩是你血汗的勋章，复试时导师点头的瞬间，你感觉这五年的委屈都烟消云散了。你将在未来的三年里，继续在最顶尖的平台上打磨你的设计灵魂。你发了条朋友圈："再战三年"。只有你自己知道，这次你不再是那个摸索的小白，而是真正的种子选手。'
    },
    grad_a_b: {
        id: 'grad_a_b',
        name: '稳健上岸 - 普通名校研究生',
        image: '📚',
        type: 'B',
        points: 200,
        hint: '大五考研报考其他985/老八校等B/C档院校并被录取',
        description: '尘埃落定。你避开了惨烈的就业竞争，成功躲进了研究生院的避风港。虽然不是最顶级的学府，但这种"有书读"的安稳感让你在大五的深夜里终于睡了个好觉。导师已经给你发来了下周进组开会的通知，你苦笑着关掉游戏："看来，拉线的日子还没到头啊。"'
    },
    grad_fail: {
        id: 'grad_fail',
        name: '二战考研的孤勇者',
        image: '🕯️',
        type: 'FAIL',
        points: 50,
        hint: '大五考研报考任意院校未过线落榜',
        description: '初试成绩出来的那天，你坐在考研教室里，周围是空荡荡的座位。你没能考回那所名校，也没能完成自我的救赎。你决定在学校附近租一个 500 块的床位，开启"二战"生涯。你告诉家里人，你只是"慢热"，只有你自己知道，如果你不考上研，你根本不知道在现在的就业市场里，除了工地你还能去哪。'
    },
    civil_success: {
        id: 'civil_success',
        name: '体制内的稳定余生',
        image: '🍵',
        type: 'A',
        points: 350,
        hint: '大五考公报考自然资源部/规划局等提档岗位并成功上岸',
        description: '你通过了行测，熬过了申论，最终在规划局的面试中，凭借着五年画图磨炼出的"即便通宵也能保持微笑"的心理素质，成功上岸。你现在的工作是审批那些曾经让你痛不欲生的方案。你坐在桌子后面，看着对面的小建筑师战战兢兢地问："领导，这个容积率能不能再宽限 0.1？"你喝了一口茶，淡淡地说："回去重改。"这一刻，你感受到了权力的迷人芬芳。'
    },
    civil_fail: {
        id: 'civil_fail',
        name: '公考失败的徘徊者',
        image: '🌫️',
        type: 'FAIL',
        points: 50,
        hint: '大五考公报考任意岗位未能达标落榜',
        description: '行测的图形推理没能难住你，但面试时你那股属于建筑师的"孤傲"却让你与体制格格不入。你看着公示名单上的名字，自嘲地笑笑：原来自己还是那个只会在 CAD 里拉线的牲口。大五的春天已经快过完了，保研、留学、考公的门一个个关上，你站在十字路口，手里攥着一份还没修改好的简历，感受到了现实最冰冷的温度。'
    },

    // 6. 特殊结局
    expelled: {
        id: 'expelled',
        name: '由于平庸被劝退',
        image: '📉',
        type: 'FAIL',
        points: 50,
        hint: '由于连续挂科或被警告触发退学',
        triggerCondition: '连续两次挂科/警告叠加',
        description: '老师当众撕碎了你的最后一张草图。"建筑学不缺平庸的画图匠，但连匠人都做不到的人，请离开。"你收拾好所有的马克笔、丁字尺和已经干涸的胶水，在学期中途离开了校园。虽然结局很狼狈，但在走出校门的那一刻，你竟然感受到了一种前所未有的解脱。'
    },
    breakdown: {
        id: 'breakdown',
        name: '空中飞人',
        image: '🏥',
        type: 'FAIL',
        points: 50,
        hint: '压力连续 3 周爆表导致崩溃重修',
        triggerCondition: '压力连续 3 周处于满值崩溃状态',
        description: '你崩溃了。在连续熬了三个通宵后，你发现眼前的 CAD 线条开始变成无数纠缠的毒蛇。你撕碎了硫酸纸，推倒了模型，在工作室的哀嚎声中跑向了天台。幸运的是，校卫队把你拦了下来。你被迫休学，回到了那个没有 DDL、没有容积率的故乡。在那里，你花了一年的时间才重新学会如何像一个正常人一样呼吸。'
    },
    default_graduate: {
        id: 'default_graduate',
        name: '平庸的自由——直接毕业',
        image: '🎓',
        type: 'B',
        points: 100,
        hint: '大五最后一周未选择任何出路',
        description: '最后一周的周五，你搬走了工作室里最后一卷没用完的硫酸纸。没有名校的 Offer，没有大院的劳务合同，也没有考公上岸的公示。你手里只有一张盖着红章的学位证，和这五年攒下的颈椎病。你拒绝了所有大五毕业分流的博弈，选择了一种最彻底的"裸奔"。你站在校门口，看着学弟学妹们搬着模型鱼贯而入，心中没有一丝波动。世界很大，而你现在只想先回家睡一个长达三个月的觉。'
    },
    bankrupt: {
        id: 'bankrupt',
        name: '破产停学',
        image: '💸',
        type: 'FAIL',
        points: 50,
        hint: '金钱耗尽导致破产停学',
        triggerCondition: '金钱余额小于等于0',
        description: '“你盯着屏幕上红色的负数余额，陷入了长久的沉默。在建筑系，贫穷不仅仅意味着吃不起食堂，更意味着你买不起 50 块钱一卷的硫酸纸，也付不起激光切割排队的费用。当导师询问你为什么没有实体模型时，你无法告诉他你连一瓶 502 胶水都买不起了。你收拾好那把已经生锈的美工刀，默默离开了工作室。你终于明白，所谓的‘建筑理想’，在残酷的复利和账单面前，终究只是一叠废纸。世界很大，但没有钱，你连一张属于自己的绘图桌都守不住。”'
    }
};

export const ALL_ENDINGS = Object.values(endings);

export const getEndingRecord = () => {
    try {
        const stored = localStorage.getItem('archsim_unlocked_endings');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};

export const getEndingCounts = () => {
    try {
        const stored = localStorage.getItem('archsim_ending_counts');
        if (stored) return JSON.parse(stored);

        // 兼容和迁移老存档数据
        const oldArr = getEndingRecord();
        const counts = {};
        if (Array.isArray(oldArr)) {
            oldArr.forEach(id => {
                counts[id] = 1;
            });
            // 静默写入初次迁移
            localStorage.setItem('archsim_ending_counts', JSON.stringify(counts));
        }
        return counts;
    } catch (e) {
        return {};
    }
};

export const saveEndingRecord = (endingId) => {
    try {
        // 维护旧版名单列表供老视图快速查询
        const currentArr = getEndingRecord();
        if (!currentArr.includes(endingId)) {
            currentArr.push(endingId);
            localStorage.setItem('archsim_unlocked_endings', JSON.stringify(currentArr));
        }

        // 维护新版累计触发频次字典
        const counts = getEndingCounts();
        counts[endingId] = (counts[endingId] || 0) + 1;
        localStorage.setItem('archsim_ending_counts', JSON.stringify(counts));
    } catch (e) {
        console.error("存档写入失败", e);
    }
};

// 检查是否在游戏过程中触发失败结局
export function checkFailureEnding(gameState) {
    // 破产
    if (gameState.attributes.money <= 0) {
        return endings.bankrupt;
    }
    // 空中飞人
    if (gameState.history.stressMaxWeeks >= 3) {
        return endings.breakdown;
    }
    // 劝退 (连续两次挂科/警告)
    if (gameState.history.warningCount >= 2) {
        return endings.expelled;
    }

    return null;
}
