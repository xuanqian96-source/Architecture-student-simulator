// 评语数据库 - 根据进度和质量评分

export function getReviewComment(progress, quality) {
    const score = (progress * 0.4) + (quality * 0.6); // 质量权重更高

    let grade = '';
    let comment = '';

    if (score >= 85) {
        grade = 'A';
        comment = '优秀!设计完成度高,质量出色,展现了扎实的专业功底。';
    } else if (score >= 75) {
        grade = 'B+';
        comment = '良好。设计基本完成,质量尚可,但仍有提升空间。';
    } else if (score >= 65) {
        grade = 'B';
        comment = '中等。设计思路清晰,但完成度和细节有待加强。';
    } else if (score >= 55) {
        grade = 'C';
        comment = '及格。基本达到要求,但质量明显不足,需要更多努力。';
    } else {
        grade = 'D';
        comment = '不及格。设计完成度低,质量差,需要重修本课题。';
    }

    return { grade, comment, score: Math.floor(score) };
}
