// 事件引擎 - 统一事件池，每周从70个事件中等概率抽取一个，不重复

import { randomEvents } from '../data/events.js';
import { choiceEvents } from '../data/choices.js';

// 合并所有事件为统一池
const allEvents = [
    ...randomEvents.map(e => ({ ...e, eventType: 'random' })),
    ...choiceEvents.map(e => ({ ...e, eventType: 'choice' })),
];

// 每周从统一池中等概率抽取一个未使用的事件
export function drawWeeklyEvent(usedEventIds = []) {
    const usedSet = new Set(usedEventIds);
    let available = allEvents.filter(e => !usedSet.has(e.id));

    // 如果全部耗尽则重置（理论上60周<70不会发生）
    if (available.length === 0) {
        available = allEvents;
    }

    // 等概率随机抽取
    const idx = Math.floor(Math.random() * available.length);
    const picked = available[idx];

    if (picked.eventType === 'choice') {
        return { type: 'choice', data: picked };
    } else {
        return { type: 'random', data: picked };
    }
}

// 重置（新游戏时）
export function resetEventWeights() {
    // 不再需要权重map，usedEventIds 在 gameState 中管理
}

// 每周恢复权重（保留接口向后兼容但不做操作）
export function recoverWeights() { }

// 应用事件效果到游戏状态（含 clamp >=0）
export function applyEventEffects(gameState, effects) {
    const newState = { ...gameState };

    if (effects.design) newState.attributes.design += effects.design;
    if (effects.software) newState.attributes.software += effects.software;
    if (effects.stress) newState.attributes.stress += effects.stress;
    if (effects.money) newState.attributes.money += effects.money;
    if (effects.progress) newState.currentProject.progress += effects.progress;
    if (effects.quality) newState.currentProject.quality += effects.quality;

    // 强制除金钱外的所有数值 >= 0 (金钱必须暴露真实负值以触发破产甚至0值也触发)
    newState.attributes.design = Math.max(0, newState.attributes.design);
    newState.attributes.software = Math.max(0, newState.attributes.software);
    newState.attributes.stress = Math.max(0, newState.attributes.stress);

    newState.currentProject.progress = Math.max(0, newState.currentProject.progress);
    newState.currentProject.quality = Math.max(0, newState.currentProject.quality);

    return newState;
}

// 处理抉择选项(包括随机效果)
export function applyChoiceEffect(gameState, option) {
    const effects = option.effects;

    if (effects.random) {
        const success = Math.random() < 0.5;
        const actualEffects = success ? effects.success : effects.fail;
        return {
            newState: applyEventEffects(gameState, actualEffects),
            result: success ? 'success' : 'fail',
            appliedEffects: actualEffects
        };
    }

    return {
        newState: applyEventEffects(gameState, effects),
        result: 'normal',
        appliedEffects: effects
    };
}

// 格式化效果为日志文本
export function formatEffectsForLog(effects) {
    if (!effects) return '';
    const parts = [];
    if (effects.design) parts.push(`设计${effects.design > 0 ? '+' : ''}${effects.design}`);
    if (effects.software) parts.push(`软件${effects.software > 0 ? '+' : ''}${effects.software}`);
    if (effects.stress) parts.push(`压力${effects.stress > 0 ? '+' : ''}${effects.stress}`);
    if (effects.money) parts.push(`金钱${effects.money > 0 ? '+¥' : '-¥'}${Math.abs(effects.money)}`);
    if (effects.progress) parts.push(`进度${effects.progress > 0 ? '+' : ''}${effects.progress}%`);
    if (effects.quality) parts.push(`质量${effects.quality > 0 ? '+' : ''}${effects.quality}`);
    return parts.length > 0 ? parts.join(', ') : '无变化';
}

// 保留向后兼容的旧接口
export function shouldTriggerRandomEvent() { return false; }
export function shouldTriggerChoiceEvent() { return false; }
export function triggerRandomEvent(usedIds) { return drawWeeklyEvent(usedIds); }
export function triggerChoiceEvent(usedIds) { return drawWeeklyEvent(usedIds); }
