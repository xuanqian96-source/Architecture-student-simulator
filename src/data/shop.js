// 商店道具系统 - 10件可购买物品

export const shopItems = [
    {
        id: 'elcroquis',
        name: '《El Croquis》合订本',
        icon: '📐',
        price: 1500,
        effect: { design: 10 },
        semesterRepeatable: true,
        description: '建筑师的圣经,翻烂了也值得。'
    },
    {
        id: 'rhino',
        name: '正版Rhino授权',
        icon: '🦏',
        price: 3500,
        effect: { software: 15 },
        description: '告别破解,拥抱正版的良心。'
    },
    {
        id: 'headphone',
        name: '降噪耳机',
        icon: '🎧',
        price: 1500,
        effect: { stressReduction: 0.1 },
        description: '屏蔽噪音,专注设计。'
    },
    {
        id: 'chair',
        name: '工学椅',
        icon: '🪑',
        price: 2500,
        effect: { stressReduction: 0.2 },
        description: '保护腰椎,延长职业生涯。'
    },
    {
        id: 'manuscript',
        name: '大师手稿复刻',
        icon: '🖼️',
        price: 8000,
        effect: { design: 25 },
        description: '柯布西耶的手绘草图,灵感之源。'
    },
    {
        id: 'course',
        name: '软件教学课程',
        icon: '🎓',
        price: 6000,
        effect: { software: 20 },
        semesterRepeatable: true,
        description: '系统化的参数化设计培训,从入门到进阶。'
    },
    {
        id: 'redbull',
        name: '红牛整箱',
        icon: '🥫',
        price: 500,
        effect: { nextWeekAPBoost: 1 },
        repeatable: true,
        description: '你的翅膀,下一周额外+1AP。'
    },
    {
        id: 'studytour',
        name: '建筑游学',
        icon: '✈️',
        price: 12000,
        effect: { design: 30 },
        description: '欧洲大师作品巡礼,开眼界长见识。'
    },
    {
        id: 'mouse',
        name: '人体工学鼠标',
        icon: '🖱️',
        price: 400,
        effect: { software: 5 },
        description: '告别鼠标手,提升绘图效率。'
    },
    {
        id: 'starbucks',
        name: '星巴克永久会员',
        icon: '☕',
        price: 1000,
        effect: { weeklyStressReduction: 5 },
        description: '每周压力-5,咖啡因续命。'
    }
];

// 检查是否已购买（可重复购买商品除外）
export function isPurchased(itemId, inventory) {
    return inventory.includes(itemId);
}

// 获取可购买物品(未购买+有足够金钱)
export function getAvailableItems(inventory, currentMoney) {
    return shopItems.filter(item =>
        !isPurchased(item.id, inventory) && currentMoney >= item.price
    );
}
