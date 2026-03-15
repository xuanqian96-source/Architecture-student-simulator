// 评图系统 - 期中和期末评图逻辑

import { calculateBaseDifficulty, calculateThreshold, calculateGrade, getReviewComment } from '../data/reviews.js';

// 期中评图(第6周): 检查进度≥50%
export function conductMidtermReview(gameState) {
    const { currentProject, progress, identity } = gameState;

    // 进度检查
    if (currentProject.progress < 50) {
        return {
            passed: false,
            grade: 'F', // 进度不达标，固定为 F
            type: 'progressFail',
            comment: getReviewComment('progressFail'),
            consequence: 'fail' // F计入挂科
        };
    }

    // 质量评分
    const baseDifficulty = calculateBaseDifficulty(progress.year, true);
    const threshold = calculateThreshold(baseDifficulty, identity.school.difficulty);
    const grade = calculateGrade(currentProject.quality, threshold);

    return {
        passed: true,
        grade,
        threshold,
        quality: currentProject.quality,
        comment: getReviewComment(`grade${grade}`),
        consequence: grade === 'D' ? 'warning' : 'pass' // D不计入挂科，但给与警告
    };
}

// 期末评图(第12周): 检查进度≥100%
export function conductFinalReview(gameState) {
    const { currentProject, progress, identity } = gameState;

    // 进度检查
    if (currentProject.progress < 100) {
        return {
            passed: false,
            grade: 'F',
            type: 'progressFail',
            comment: getReviewComment('progressFail'),
            consequence: 'fail' // 进度不达标计入挂科
        };
    }

    // 质量评分
    const baseDifficulty = calculateBaseDifficulty(progress.year, false);
    const threshold = calculateThreshold(baseDifficulty, identity.school.difficulty);
    const grade = calculateGrade(currentProject.quality, threshold);

    return {
        passed: true,
        grade,
        threshold,
        quality: currentProject.quality,
        comment: getReviewComment(`grade${grade}`),
        consequence: grade === 'D' ? 'warning' : 'pass'
    };
}

// 检查是否应该触发评图
export function shouldTriggerReview(week) {
    return week === 6 || week === 12;
}

// 判断是期中还是期末
export function isMidtermWeek(week) {
    return week === 6;
}
