// 结局系统 - 6种结局判定

export const endings = [
    {
        id: 'pritzker',
        name: '普利兹克奖的火种',
        condition: (state) => {
            return state.attributes.design >= 180 && state.attributes.software >= 160;
        },
        description: '你拿到了GSD全奖,你生而为大师。五年的磨砺让你脱胎换骨,现在全世界都在等待你的第一个作品。',
        image: '🏆'
    },
    {
        id: 'institute',
        name: '甲级大院的牲口',
        condition: (state) => {
            const { design, software } = state.attributes;
            return design >= 80 && design < 180 && software >= 60 && software < 160;
        },
        description: '你月入过万,生活稳定,但早已忘记理想。每天画着标准化的图纸,偶尔会想起当年熬夜的自己。',
        image: '🏢'
    },
    {
        id: 'career_change',
        name: '转行开挂人生',
        condition: (state) => {
            return state.attributes.design < 80 && state.attributes.money > 10000;
        },
        description: '你去大厂做UI,工资是建筑同学的三倍。建筑系的训练让你在互联网行业如鱼得水,当初的痛苦都是财富。',
        image: '💻'
    },
    {
        id: 'expelled',
        name: '由于平庸被劝退',
        condition: (state) => {
            return state.history.warningCount >= 2;
        },
        description: '老师劝你改行。连续两次进度不达标,你意识到建筑可能不是你的归宿。离开时你松了一口气。',
        image: '📉'
    },
    {
        id: 'breakdown',
        name: '空中飞人',
        condition: (state) => {
            return state.history.stressMaxWeeks >= 3;
        },
        description: '你崩溃了,回老家休养。压力连续三周满值,身体发出了最后的警告。建筑梦在医院的病床上破碎。',
        image: '🏥'
    },
    {
        id: 'bankrupt',
        name: '破产停学',
        condition: (state) => {
            return state.attributes.money < 0;
        },
        description: '连图纸都买不起,被迫退学。你试图坚持,但现实比任何导师都残酷。贫穷击碎了你的建筑梦。',
        image: '💸'
    }
];

// 检查是否触发结局(按优先级检查)
export function checkEnding(gameState) {
    // 优先检查失败结局
    const failureEndings = [endings[5], endings[4], endings[3]]; // 破产、崩溃、劝退
    for (const ending of failureEndings) {
        if (ending.condition(gameState)) {
            return ending;
        }
    }

    // 检查完成120周后的正常结局
    if (gameState.progress.totalWeeks >= 120) {
        // 按优先级: 普利兹克 > 转行 > 大院
        if (endings[0].condition(gameState)) {
            return endings[0]; // 普利兹克
        } else if (endings[2].condition(gameState)) {
            return endings[2]; // 转行
        } else {
            return endings[1]; // 大院
        }
    }

    return null; // 游戏继续
}
