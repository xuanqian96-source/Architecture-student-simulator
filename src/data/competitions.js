// 建筑竞赛系统 - 5个真实参考竞赛

export const competitions = [
    {
        // 难度：中等 | 面向低年级，入门起点赛，分数线居中
        id: 'xinrensai',
        name: '全国新人赛',
        ref: '建筑新人赛',
        icon: '🏅',
        yearRange: [1, 3], // 大一至大三
        minPortfolioCount: 1,
        skillRequirement: null,
        awards: [
            { tier: 'Top 3', qualityThreshold: 260, prize: 10000, label: '🥇 全国三甲' },
            { tier: 'Top 16', qualityThreshold: 200, prize: 5000, label: '🥈 全国十六强' },
            { tier: 'Top 100', qualityThreshold: 145, prize: 2000, label: '🥉 全国百强' },
        ]
    },
    {
        // 难度：中等 | 国际赛事，分数线与新人赛相当，但层次更丰富
        id: 'hypcup',
        name: '霍普杯',
        ref: 'UIA-HYP Cup',
        icon: '🏆',
        yearRange: [1, 5],
        minPortfolioCount: 1,
        skillRequirement: null,
        awards: [
            { tier: '一等奖', qualityThreshold: 255, prize: 10000, label: '🥇 一等奖' },
            { tier: '二等奖', qualityThreshold: 200, prize: 6000, label: '🥈 二等奖' },
            { tier: '三等奖', qualityThreshold: 165, prize: 3000, label: '🥉 三等奖' },
            { tier: '优秀奖', qualityThreshold: 130, prize: 2000, label: '🏅 优秀奖' },
        ]
    },
    {
        // 难度：最难 | 国内顶级理论性竞赛，对设计深度要求极高
        id: 'tianzuo',
        name: '天作杯',
        ref: '天作建筑奖',
        icon: '🏛️',
        yearRange: [1, 5],
        minPortfolioCount: 1,
        skillRequirement: null,
        awards: [
            { tier: '一等奖', qualityThreshold: 290, prize: 8000, label: '🥇 一等奖' },
            { tier: '二等奖', qualityThreshold: 235, prize: 5000, label: '🥈 二等奖' },
            { tier: '三等奖', qualityThreshold: 195, prize: 3000, label: '🥉 三等奖' },
            { tier: '入围奖', qualityThreshold: 155, prize: 2000, label: '🏅 入围奖' },
        ]
    },
    {
        // 难度：较简单 | 侧重数字技术，创意>门槛
        id: 'guyu',
        name: '谷雨杯',
        ref: '数字化设计竞赛',
        icon: '💻',
        yearRange: [2, 4],
        minPortfolioCount: 1,
        skillRequirement: { software: 100 },
        awards: [
            { tier: '创意奖', qualityThreshold: 205, prize: 6000, label: '🥇 创意奖' },
            { tier: '优胜奖', qualityThreshold: 165, prize: 4000, label: '🥈 优胜奖' },
            { tier: '入围奖', qualityThreshold: 125, prize: 2000, label: '🏅 入围奖' },
        ]
    },
    {
        // 难度：较简单 | 侧重绿色技术，分数线相对新人赛更低
        id: 'taida',
        name: '台达杯',
        ref: '绿色建筑竞赛',
        icon: '🌿',
        yearRange: [3, 5],
        minPortfolioCount: 1,
        skillRequirement: { software: 120 },
        awards: [
            { tier: '金奖', qualityThreshold: 215, prize: 10000, label: '🥇 金奖' },
            { tier: '银奖', qualityThreshold: 175, prize: 6000, label: '🥈 银奖' },
            { tier: '三等奖', qualityThreshold: 140, prize: 3000, label: '🥉 三等奖' },
            { tier: '优秀奖', qualityThreshold: 110, prize: 2000, label: '🏅 优秀奖' },
        ]
    }
];

/**
 * 获取当前年级可参加的竞赛
 */
export function getAvailableCompetitions(year, portfolioCount, software) {
    return competitions.filter(c => {
        if (year < c.yearRange[0] || year > c.yearRange[1]) return false;
        if (portfolioCount < c.minPortfolioCount) return false;
        if (c.skillRequirement) {
            if (c.skillRequirement.software && software < c.skillRequirement.software) return false;
        }
        return true;
    });
}

/**
 * 判定获奖结果
 * 核心公式: Winning_Prob = (Quality / RequiredQuality) * Random(0.8, 1.2)
 */
export function judgeCompetition(projectQuality, competition) {
    const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 - 1.2
    const effectiveQuality = projectQuality * randomFactor;

    for (const award of competition.awards) {
        if (effectiveQuality >= award.qualityThreshold) {
            return { won: true, award, effectiveQuality };
        }
    }
    return { won: false, award: null, effectiveQuality };
}
