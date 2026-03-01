// 事件引擎 - 统一事件池，每周必触发一个随机事件或交互抉择

import { randomEvents } from '../data/events.js';
import { choiceEvents } from '../data/choices.js';

// 权重表: 每个事件的当前触发权重 (id -> weight)
// 初始权重为1，触发后降低，逐渐随时间恢复
const BASE_WEIGHT = 10;
const DECAY_WEIGHT = 1; // 触发后降至1(仍可触发但概率极低)

// 在globalThis上维护权重状态(持久化整个游戏周期)
function getWeightMap() {
    if (!globalThis._eventWeights) {
        globalThis._eventWeights = {};
    }
    return globalThis._eventWeights;
}

function resetWeights() {
    globalThis._eventWeights = {};
}

// 获取某事件的当前权重
function getWeight(id) {
    const map = getWeightMap();
    return map[id] ?? BASE_WEIGHT;
}

// 触发后降低权重并逐渐恢复
function onEventTriggered(id) {
    const map = getWeightMap();
    map[id] = DECAY_WEIGHT;
}

// 每周恢复所有事件权重 (+1，最多恢复到BASE_WEIGHT)
export function recoverWeights() {
    const map = getWeightMap();
    const allIds = [
        ...randomEvents.map(e => e.id),
        ...choiceEvents.map(e => e.id)
    ];
    allIds.forEach(id => {
        const cur = map[id] ?? BASE_WEIGHT;
        if (cur < BASE_WEIGHT) {
            map[id] = Math.min(BASE_WEIGHT, cur + 2);
        }
    });
}

// 加权随机抽取
function weightedPick(items) {
    const weights = items.map(item => getWeight(item.id));
    const total = weights.reduce((a, b) => a + b, 0);
    let rand = Math.random() * total;
    for (let i = 0; i < items.length; i++) {
        rand -= weights[i];
        if (rand <= 0) return items[i];
    }
    return items[items.length - 1];
}

// 每周触发一个事件(随机事件 or 交互抉择，各50%基础概率)
export function drawWeeklyEvent() {
    const useChoice = Math.random() < 0.5;

    if (useChoice) {
        const choice = weightedPick(choiceEvents);
        onEventTriggered(choice.id);
        return { type: 'choice', data: choice };
    } else {
        const event = weightedPick(randomEvents);
        onEventTriggered(event.id);
        return { type: 'random', data: event };
    }
}

// 重置权重(新游戏时)
export function resetEventWeights() {
    resetWeights();
}

// 应用事件效果到游戏状态
export function applyEventEffects(gameState, effects) {
    const newState = { ...gameState };

    if (effects.design) newState.attributes.design += effects.design;
    if (effects.software) newState.attributes.software += effects.software;
    if (effects.stress) newState.attributes.stress += effects.stress;
    if (effects.money) newState.attributes.money += effects.money;
    if (effects.progress) newState.currentProject.progress += effects.progress;
    if (effects.quality) newState.currentProject.quality += effects.quality;

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
export function triggerRandomEvent() { return drawWeeklyEvent(); }
export function triggerChoiceEvent() { return drawWeeklyEvent(); }
