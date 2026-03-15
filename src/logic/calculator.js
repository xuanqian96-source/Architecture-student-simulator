// 数值计算器 - 所有核心算法

// 每周进度增长 = (软件能力 * 0.1) + (随机 2-5)
export function calculateProgressGrowth(softwareAbility) {
    const base = softwareAbility * 0.1;
    const random = Math.floor(Math.random() * 4) + 2; // 2-5
    return base + random;
}

// 每周质量增长 = (设计能力 * 0.15) + (随机 1-5)
export function calculateQualityGrowth(designAbility) {
    const base = designAbility * 0.15;
    const random = Math.floor(Math.random() * 5) + 1; // 1-5
    return base + random;
}

// 学习衰减: 属性超过150后,每次行动获得的增量减半
export function applyLearningDecay(attributeValue, increment) {
    if (attributeValue >= 150) {
        return increment * 0.5;
    }
    return increment;
}

// 质量上限 = 设计能力 * 2.5 (已废弃，改用年度质量上限)
export function calculateQualityCap(designAbility) {
    return designAbility * 2.5;
}

// 年度质量上限：防止质量分数过度溢出
const QUALITY_CAPS = { 1: 250, 2: 300, 3: 350, 4: 400, 5: 450 };
export function getQualityCap(year) {
    return QUALITY_CAPS[year] || 450;
}

// 每周生活费扣除
export const WEEKLY_LIVING_COST = 300;

// 压力等级判定
export function getStressLevel(stress) {
    if (stress >= 100) {
        return 'breakdown'; // 崩溃
    } else if (stress >= 80) {
        return 'burnout'; // 精神耗竭
    } else if (stress >= 50) {
        return 'unhealthy'; // 亚健康
    } else {
        return 'normal'; // 正常
    }
}

// 属性上限检查(设计和软件能力上限200,压力无上限但100+有负面效果)
export function clampAttribute(value, min = 0, max = 200) {
    return Math.max(min, Math.min(value, max));
}

// 压力值不设上限,但需要记录
export function clampStress(value) {
    return Math.max(0, value);
}
