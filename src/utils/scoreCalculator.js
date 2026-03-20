/**
 * scoreCalculator — 积分计算工具
 * 汇总结局积分（可累加）与成就积分（一次性），生成总积分
 */

import { ALL_ENDINGS, getEndingCounts } from '../data/endings';
import { achievements, getAchievementRecord } from '../data/achievements';

/**
 * 计算玩家当前总积分
 * @returns {{ endingScore: number, achievementScore: number, totalScore: number }}
 */
export function calculateTotalScore() {
    // 1. 结局积分：单次积分 × 达成次数
    const endingCounts = getEndingCounts();
    let endingScore = 0;
    ALL_ENDINGS.forEach(ending => {
        const count = endingCounts[ending.id] || 0;
        const points = ending.points || 0;
        endingScore += points * count;
    });

    // 2. 成就积分：解锁即获得，不可累加
    const achRecord = getAchievementRecord();
    let achievementScore = 0;
    achievements.forEach(ach => {
        if (achRecord[ach.id]?.unlocked) {
            achievementScore += ach.points || 0;
        }
    });

    const totalScore = endingScore + achievementScore;

    return { endingScore, achievementScore, totalScore };
}
