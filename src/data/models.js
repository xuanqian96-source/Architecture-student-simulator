// 模型制作系统 - 4档方案

export const modelOptions = [
    {
        id: 'handcut',
        name: '手工切割雪弗板',
        cost: 200,
        qualityBonus: 0,
        description: '纯手工的"拙笨感",其实就是没钱去切激光。'
    },
    {
        id: 'laser',
        name: '激光切割 (Laser)',
        cost: 800,
        qualityBonus: 8,
        description: '亚克力焦糊的味道,是建筑生最迷恋的香水。'
    },
    {
        id: '3dprint',
        name: '全彩3D打印',
        cost: 2500,
        qualityBonus: 20,
        description: '科技改变生活,除了你的银行卡余额。'
    },
    {
        id: 'outsource',
        name: '外包模型公司',
        cost: 6000,
        qualityBonus: 50,
        description: '只要钱到位,大师也下跪。你甚至不用自己粘胶水。'
    }
];

// 检查是否应该触发模型制作(第5周和第11周)
export function shouldTriggerModel(week) {
    return week === 5 || week === 11;
}
