// 50条静态随机事件池

export const randomEvents = [
    {
        id: 'evt1',
        name: 'Rhino崩溃',
        description: '没存盘?重启比哭有用。',
        effects: { stress: 5 }
    },
    {
        id: 'evt2',
        name: '拾荒美学',
        description: '捡到半卷还能用的椴木板。',
        effects: { money: 50 }
    },
    {
        id: 'evt3',
        name: '导师老花镜',
        description: '他看不清你的细部,觉得很"概念"。',
        effects: { quality: 3 }
    },
    {
        id: 'evt4',
        name: '咖啡机爆炸',
        description: '生命之泉枯竭,只能靠意志力。',
        effects: { stress: 5 }
    },
    {
        id: 'evt5',
        name: '绘图仪卡纸',
        description: '出图前最后一分钟,全层哀嚎。',
        effects: { stress: 8 }
    },
    {
        id: 'evt6',
        name: '参数化报错',
        description: '红了一片的电池组。',
        effects: { software: -1 }
    },
    {
        id: 'evt7',
        name: '神级插件',
        description: '找到了免费脚本。',
        effects: { software: 3 }
    },
    {
        id: 'evt8',
        name: '甲方爸爸',
        description: '之前的私活尾款结了。',
        effects: { money: 200 }
    },
    {
        id: 'evt9',
        name: '室友打机',
        description: '他在开黑,你在拉线。',
        effects: { stress: 3 }
    },
    {
        id: 'evt10',
        name: '深夜顿悟',
        description: '看懂了《建筑语汇》。',
        effects: { design: 2 }
    },
    {
        id: 'evt11',
        name: '模型受损',
        description: '室友的猫把你的楼梯踩塌了。',
        effects: { quality: -5 }
    },
    {
        id: 'evt12',
        name: '激光排队',
        description: '凌晨三点的切割室。',
        effects: { stress: 2 }
    },
    {
        id: 'evt13',
        name: '灵感枯竭',
        description: '盯着白纸看了一下午。',
        effects: { design: -1 }
    },
    {
        id: 'evt14',
        name: '知乎大神',
        description: '学到了一个新的渲染小技巧。',
        effects: { software: 2 }
    },
    {
        id: 'evt15',
        name: '全班围观',
        description: '你的草图被老师拿去做典型。',
        effects: { design: 1 }
    },
    {
        id: 'evt16',
        name: '电脑死机',
        description: '渲染一整晚,最后只剩蓝屏。',
        effects: { progress: -5 }
    },
    {
        id: 'evt17',
        name: '淘宝材料',
        description: '买错货了。',
        effects: { money: -100 }
    },
    {
        id: 'evt18',
        name: '恋爱告急',
        description: '对方说:"你跟你的方案过去吧。"',
        effects: { stress: 10 }
    },
    {
        id: 'evt19',
        name: '食堂加餐',
        description: '今天的红烧肉让你觉得人生有救。',
        effects: { stress: -5 }
    },
    {
        id: 'evt20',
        name: '颈椎预警',
        description: '脖子转动的声音像磨砂纸。',
        effects: { stress: 5 }
    },
    {
        id: 'evt21',
        name: '假装努力',
        description: '在工作室摸了一天鱼。',
        effects: { stress: 2 }
    },
    {
        id: 'evt22',
        name: '方案撞车',
        description: '发现和去年获奖作品一样。',
        effects: { stress: 15 }
    },
    {
        id: 'evt23',
        name: '找到基友',
        description: '有人陪你一起通宵。',
        effects: { stress: -10 }
    },
    {
        id: 'evt24',
        name: '美工刀伤',
        description: '见红了,创可贴是勋章。',
        effects: { stress: 3 }
    },
    {
        id: 'evt25',
        name: '电脑清灰',
        description: '风扇声小了。',
        effects: { software: 1 }
    },
    {
        id: 'evt26',
        name: '蹭课成功',
        description: '潜入隔壁老八校评图现场。',
        effects: { design: 2 }
    },
    {
        id: 'evt27',
        name: '发现宝藏',
        description: '翻到一本绝版画册。',
        effects: { design: 1 }
    },
    {
        id: 'evt28',
        name: '桌子被占',
        description: '谁在你的桌子上吃螺蛳粉?',
        effects: { stress: 3 }
    },
    {
        id: 'evt29',
        name: '渲染提速',
        description: '优化了参数。',
        effects: { software: 1 }
    },
    {
        id: 'evt30',
        name: '导师改行',
        description: '带你的老师去搞行政了。',
        effects: { design: -2 }
    },
    {
        id: 'evt31',
        name: '竞赛得奖',
        description: '小奖也是奖。',
        effects: { money: 500 }
    },
    {
        id: 'evt32',
        name: '模型灯坏了',
        description: '含泪再买一套LED。',
        effects: { money: -50 }
    },
    {
        id: 'evt33',
        name: '甲方消失',
        description: '对方拉黑。',
        effects: { money: -200 }
    },
    {
        id: 'evt34',
        name: '熬夜冠军',
        description: '看到了凌晨四点的校园。',
        effects: { stress: 5 }
    },
    {
        id: 'evt35',
        name: '灵感闪现',
        description: '洗澡时想通了逻辑。',
        effects: { design: 3 }
    },
    {
        id: 'evt36',
        name: '打印费暴涨',
        description: '期末周的打印店是抢钱现场。',
        effects: { money: -100 }
    },
    {
        id: 'evt37',
        name: '学长经验',
        description: '学长传了你素材包。',
        effects: { software: 2 }
    },
    {
        id: 'evt38',
        name: '案例误解',
        description: '老师说你在致敬公厕。',
        effects: { design: -2 }
    },
    {
        id: 'evt39',
        name: '快递迟到',
        description: '等了一周地形模型。',
        effects: { progress: -3 }
    },
    {
        id: 'evt40',
        name: '工作室聚餐',
        description: '短暂的逃避。',
        effects: { stress: -15 }
    },
    {
        id: 'evt41',
        name: '美院联谊',
        description: '去隔壁看了个展。',
        effects: { stress: -5 }
    },
    {
        id: 'evt42',
        name: '电脑病毒',
        description: '重装系统吧。',
        effects: { software: -3 }
    },
    {
        id: 'evt43',
        name: '被误删文件',
        description: '手滑按了Shift+Del。',
        effects: { stress: 20 }
    },
    {
        id: 'evt44',
        name: '转行建议',
        description: '家里人问你要不要去考公。',
        effects: { stress: 2 }
    },
    {
        id: 'evt45',
        name: '方案过时',
        description: '喜欢的风格被导师抛弃。',
        effects: { design: -1 }
    },
    {
        id: 'evt46',
        name: '免费材料',
        description: '角落发现了剩下的航模板。',
        effects: { money: 30 }
    },
    {
        id: 'evt47',
        name: '软件更新',
        description: '新版本更好用。',
        effects: { software: 1 }
    },
    {
        id: 'evt48',
        name: '由于太累睡过头',
        description: '错过改图时间。',
        effects: { progress: -10 }
    },
    {
        id: 'evt49',
        name: '大师去世',
        description: '你崇拜的偶像陨落。',
        effects: { stress: 2 }
    },
    {
        id: 'evt50',
        name: '收到感谢信',
        description: '你帮学弟改图让他拿了A。',
        effects: { stress: -5 }
    }
];

// 随机抽取事件
export function drawRandomEvent() {
    const randomIndex = Math.floor(Math.random() * randomEvents.length);
    return randomEvents[randomIndex];
}
