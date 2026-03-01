// 评图语料库 - 根据进度和质量等级的专业评语

export const reviewCorpus = {
    // 进度不达标
    progressFail: [
        '图都画不完,你是在搞观念艺术吗?建筑系不需要只会空谈的鸽子。',
        '如果你打算用这几张白纸去糊弄甲方,我建议你现在就去转行做行为艺术。'
    ],

    // 不合格 (Grade E)
    gradeE: [
        '你的方案就像是在平面上随意堆砌的乐高,完全看不到任何空间逻辑的渗透。',
        '你的剖面图告诉了我一件事:你根本没考虑过人是怎么在这个建筑里呼吸的。'
    ],

    // 合格 (Grade C)
    gradeC: [
        '基本的逻辑是自洽的,但缺乏一点让人亮眼的力量。属于安全的"行活"。',
        '满足了功能要求。在这个时代,不犯错已经是一种难得的才华了。'
    ],

    // 优秀 (Grade B)
    gradeB: [
        '这种建构逻辑的真实性在现在的学生作品中很少见了,非常有张力的方案。',
        '平面非常干净,逻辑很漂亮。难得看到能把分析图画得这么有叙事性的学生。'
    ],

    // 卓越 (Grade A)
    gradeA: [
        '你对场地的解读非常深刻,空间序列的节奏感处理得像诗一样迷人。',
        '大师潜质。你不仅解决了一个建筑问题,还探讨了一个社会学命题。令人惊艳。'
    ]
};

// 随机获取评语
export function getReviewComment(type) {
    const comments = reviewCorpus[type];
    if (!comments || comments.length === 0) {
        return '导师沉默不语。';
    }

    const randomIndex = Math.floor(Math.random() * comments.length);
    return comments[randomIndex];
}

// 基础难度计算公式
export function calculateBaseDifficulty(year, isMidterm) {
    if (isMidterm) {
        return 50 + (year - 1) * 20;
    } else {
        return 100 + (year - 1) * 40;
    }
}

// 质量阈值计算: T = B × C
export function calculateThreshold(baseDifficulty, difficultyCoefficient) {
    return baseDifficulty * difficultyCoefficient;
}

// 质量等级判定
export function calculateGrade(currentQuality, threshold) {
    if (currentQuality < threshold) {
        return 'E';
    } else if (currentQuality < threshold * 1.5) {
        return 'C';
    } else if (currentQuality < threshold * 2.2) {
        return 'B';
    } else {
        return 'A';
    }
}
