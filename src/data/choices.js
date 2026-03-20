// 20条交互抉择事件

export const choiceEvents = [
    {
        id: 'choice1',
        name: '竞赛诱惑',
        description: '一个全国性的学生竞赛正在火热报名中,你是否要参加?',
        options: [
            {
                text: '参加',
                effects: { stress: 20, money: -500, design: 3 }
            },
            {
                text: '拒绝',
                effects: { progress: 5 }
            }
        ]
    },
    {
        id: 'choice2',
        name: '软件更新',
        description: 'Rhino发布了新版本,但更新可能导致插件不兼容。',
        options: [
            {
                text: '更新',
                effects: { software: 3, progress: -10 }
            },
            {
                text: '不更',
                effects: {}
            }
        ]
    },
    {
        id: 'choice3',
        name: '图书馆偶遇',
        description: '在图书馆遇到了心仪的对象,要不要搭讪?',
        options: [
            {
                text: '搭讪',
                effects: { stress: -15 }
            },
            {
                text: '不理',
                effects: { design: 2 }
            }
        ]
    },
    {
        id: 'choice4',
        name: '导师饭局',
        description: '导师邀请你参加一个应酬饭局,可能有私活机会。',
        options: [
            {
                text: '顺从',
                effects: { stress: 10, money: 200 }
            },
            {
                text: '拒绝',
                effects: { design: -2 }
            }
        ]
    },
    {
        id: 'choice5',
        name: '深夜外卖',
        description: '室友们组团点外卖,要不要加入深夜放纵?',
        options: [
            {
                text: '加入',
                effects: { money: -100, stress: -15 }
            },
            {
                text: '拒绝',
                effects: { stress: 5 }
            }
        ]
    },
    {
        id: 'choice6',
        name: '私活诱惑',
        description: '有人找你做一个紧急私活,报酬丰厚但需要通宵。',
        options: [
            {
                text: '肝',
                effects: { money: 1000, stress: 30 }
            },
            {
                text: '拒',
                effects: {}
            }
        ]
    },
    {
        id: 'choice7',
        name: '模型室纠纷',
        description: '有人插队占用了你预约的激光切割机。',
        options: [
            {
                text: '理论',
                effects: { stress: 10 }
            },
            {
                text: '忍让',
                effects: { progress: -5 }
            }
        ]
    },
    {
        id: 'choice8',
        name: '非法插件',
        description: '发现一个破解的参数化插件,要不要安装?',
        options: [
            {
                text: '安装',
                effects: { random: true, success: { software: 3 }, fail: { stress: 20 } }
            },
            {
                text: '放弃',
                effects: {}
            }
        ]
    },
    {
        id: 'choice9',
        name: '跨界交流',
        description: '美院有一场工作坊,去参加还是继续画图?',
        options: [
            {
                text: '去',
                effects: { design: 3 }
            },
            {
                text: '留',
                effects: { progress: 5 }
            }
        ]
    },
    {
        id: 'choice10',
        name: '特价材料',
        description: '淘宝店有一批特价模型材料,质量不错但要抢。',
        options: [
            {
                text: '买',
                effects: { money: -300, quality: 10 }
            },
            {
                text: '不买',
                effects: {}
            }
        ]
    },
    {
        id: 'choice11',
        name: '室友求助',
        description: '室友恳求你帮他改一版图,他快挂科了。',
        options: [
            {
                text: '帮',
                effects: { stress: -5 }
            },
            {
                text: '拒绝',
                effects: {}
            }
        ]
    },
    {
        id: 'choice12',
        name: '名企实习',
        description: '收到了知名事务所的暑期实习邀请。',
        options: [
            {
                text: '去',
                effects: { money: 2000, design: 3, stress: 20 }
            },
            {
                text: '留校',
                effects: {}
            }
        ]
    },
    {
        id: 'choice13',
        name: '高价豆子',
        description: '发现了一袋顶级咖啡豆,喝还是卖?',
        options: [
            {
                text: '喝',
                effects: { energyBoost: true }
            },
            {
                text: '卖',
                effects: { money: 200 }
            }
        ]
    },
    {
        id: 'choice14',
        name: '画错轴线',
        description: '发现轴网画错了,全改还是凑合?',
        options: [
            {
                text: '全改',
                effects: { progress: -20, quality: 10 }
            },
            {
                text: '凑合',
                effects: { quality: -10 }
            }
        ]
    },
    {
        id: 'choice15',
        name: 'PPT风格',
        description: '汇报PPT选什么风格?',
        options: [
            {
                text: '炫酷',
                effects: { software: 3 }
            },
            {
                text: '极简',
                effects: { design: 3 }
            }
        ]
    },
    {
        id: 'choice16',
        name: '选课选择',
        description: '下学期是选评论课还是构造课?',
        options: [
            {
                text: '评论课',
                effects: { design: 3 }
            },
            {
                text: '构造课',
                effects: { software: 3 }
            }
        ]
    },
    {
        id: 'choice17',
        name: '死党聚会',
        description: '高中死党来本地旅游,邀请你一起玩。',
        options: [
            {
                text: '去',
                effects: { stress: -100, money: -300 }
            },
            {
                text: '拒',
                effects: { progress: 10 }
            }
        ]
    },
    {
        id: 'choice18',
        name: '电脑异响',
        description: '电脑风扇异响严重,要不要花钱修理?',
        options: [
            {
                text: '修理',
                effects: { money: -500 }
            },
            {
                text: '忽视',
                effects: { crashRisk: true }
            }
        ]
    },
    {
        id: 'choice19',
        name: '画图音乐',
        description: '今晚画图听什么?',
        options: [
            {
                text: '后摇',
                effects: { design: 1 }
            },
            {
                text: '摇滚',
                effects: { progress: 1 }
            }
        ]
    },
    {
        id: 'choice20',
        name: '学长回校',
        description: '优秀学长回校分享经验,去请教还是摸鱼?',
        options: [
            {
                text: '请教',
                effects: { design: 2 }
            },
            {
                text: '摸鱼',
                effects: { stress: -5 }
            }
        ]
    }
];

// 随机抽取抉择事件
export function drawChoiceEvent() {
    const randomIndex = Math.floor(Math.random() * choiceEvents.length);
    return choiceEvents[randomIndex];
}
