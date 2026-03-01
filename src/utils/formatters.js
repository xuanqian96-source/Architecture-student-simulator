// 辅助函数: 格式化事件效果为可读文本
export function formatEventEffects(effects) {
    const effectTexts = [];

    if (effects.design) {
        effectTexts.push(`设计能力 ${effects.design > 0 ? '+' : ''}${effects.design}`);
    }
    if (effects.software) {
        effectTexts.push(`软件能力 ${effects.software > 0 ? '+' : ''}${effects.software}`);
    }
    if (effects.stress) {
        effectTexts.push(`压力值 ${effects.stress > 0 ? '+' : ''}${effects.stress}`);
    }
    if (effects.money) {
        effectTexts.push(`金钱 ${effects.money > 0 ? '+¥' : '-¥'}${Math.abs(effects.money)}`);
    }
    if (effects.progress) {
        effectTexts.push(`进度 ${effects.progress > 0 ? '+' : ''}${effects.progress}%`);
    }
    if (effects.quality) {
        effectTexts.push(`质量 ${effects.quality > 0 ? '+' : ''}${effects.quality}`);
    }

    return effectTexts;
}

// 日志消息格式化（已去除随机时间戳）
export function addTimestamp(message) {
    return message;
}
