// 统一事件弹窗 - 支持随机事件展示和交互抉择两种模式

import React from 'react';
import { useGame } from '../logic/gameState';
import { formatEffectsForLog } from '../logic/eventEngine';
import { atlasBuildings } from '../data/atlas.js';

// 格式化效果标签
function EffectTag({ label, value, positive }) {
    const color = positive === undefined
        ? '#64748B'
        : positive ? '#10B981' : '#EF4444';
    const bg = positive === undefined
        ? '#F1F5F9'
        : positive ? '#F0FDF4' : '#FEF2F2';
    return (
        <span style={{
            display: 'inline-block',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: '700',
            color,
            background: bg,
            margin: '3px'
        }}>
            {label} {value > 0 ? '+' : ''}{value}
        </span>
    );
}

function renderEffects(effects) {
    if (!effects) return null;
    const tags = [];
    const map = {
        design: '设计', software: '软件', stress: '压力',
        money: '金钱', progress: '进度', quality: '质量'
    };
    Object.entries(map).forEach(([key, label]) => {
        if (effects[key] !== undefined && effects[key] !== 0) {
            const val = effects[key];
            // 压力增加是负面，其他增加是正面
            const positive = key === 'stress' ? val < 0 : val > 0;
            tags.push(
                <EffectTag key={key} label={label} value={val} positive={positive} />
            );
        }
    });
    return tags.length > 0 ? tags : <span style={{ color: '#94A3B8', fontSize: '13px' }}>无数值变化</span>;
}

export default function EventModal() {
    const { state, dispatch, ActionTypes } = useGame();
    const { showEventModal, currentEvent, pendingChoice } = state.ui;

    // 随机事件弹窗
    if (showEventModal && currentEvent) {
        const handleClose = () => {
            dispatch({ type: ActionTypes.CLOSE_EVENT_MODAL });
        };

        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000
            }} onClick={handleClose}>
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '32px',
                    maxWidth: '480px', width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }} onClick={e => e.stopPropagation()}>
                    {/* 标签 */}
                    {currentEvent.type === 'defense_result' ? (
                        <div style={{
                            display: 'inline-block', padding: '4px 12px',
                            background: currentEvent.success ? '#F0FDF4' : '#FEF2F2',
                            color: currentEvent.success ? '#10B981' : '#EF4444',
                            borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                            marginBottom: '12px', letterSpacing: '1px'
                        }}>
                            {currentEvent.success ? '🎉 汇报成功' : '💥 汇报失败'}
                        </div>
                    ) : (
                        <div style={{
                            display: 'inline-block', padding: '4px 12px',
                            background: '#EFF6FF', color: '#3B82F6',
                            borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                            marginBottom: '12px', letterSpacing: '1px'
                        }}>
                            📌 随机事件
                        </div>
                    )}

                    {/* 事件名 */}
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>
                        {currentEvent.name}
                    </h2>

                    {/* 描述 */}
                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569', marginBottom: '20px' }}>
                        {currentEvent.description}
                    </p>

                    {/* 数值变化 */}
                    <div style={{
                        background: '#F8FAFC', borderRadius: '12px',
                        padding: '14px 16px', marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#94A3B8', marginBottom: '8px', letterSpacing: '1px' }}>
                            属性变化
                        </div>
                        <div>{renderEffects(currentEvent.effects)}</div>
                    </div>

                    <button onClick={handleClose} style={{
                        width: '100%', padding: '14px',
                        background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        fontSize: '15px', fontWeight: '700', cursor: 'pointer'
                    }}>
                        知道了
                    </button>
                </div>
            </div>
        );
    }

    // 交互抉择弹窗 (screen=choice时也可用此弹窗，但主要在ChoiceScreen)

    // 金钱预警弹窗
    if (state.ui.moneyWarning && !showEventModal) {
        const handleDismissWarning = () => {
            dispatch({ type: 'DISMISS_MONEY_WARNING' });
        };

        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000
            }} onClick={handleDismissWarning}>
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '32px',
                    maxWidth: '480px', width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }} onClick={e => e.stopPropagation()}>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px',
                        background: '#FEF2F2', color: '#EF4444',
                        borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        marginBottom: '12px', letterSpacing: '1px'
                    }}>
                        ⚠️ 金钱预警
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>
                        💰 资金告急！
                    </h2>

                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569', marginBottom: '20px' }}>
                        你的余额已不足两周生活费，存在破产风险！请注意开源节流，合理安排支出。
                    </p>

                    <div style={{
                        background: '#FEF2F2', borderRadius: '12px',
                        padding: '14px 16px', marginBottom: '24px'
                    }}>
                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#EF4444', marginBottom: '8px', letterSpacing: '1px' }}>
                            当前余额
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: '900', color: '#EF4444' }}>
                            ¥ {Math.floor(state.attributes.money).toLocaleString()}
                        </div>
                    </div>

                    <button onClick={handleDismissWarning} style={{
                        width: '100%', padding: '14px',
                        background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        fontSize: '15px', fontWeight: '700', cursor: 'pointer'
                    }}>
                        我知道了
                    </button>
                </div>
            </div>
        );
    }

    // 游戏提示卡片（在随机事件和金钱预警之后，回到game主界面时才展示）
    if (state.gameTip && !showEventModal && !state.ui.moneyWarning && state.ui.screen === 'game') {
        const tip = state.gameTip;
        const handleDismissTip = () => {
            dispatch({ type: 'DISMISS_GAME_TIP' });
        };

        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000
            }} onClick={handleDismissTip}>
                <div style={{
                    background: 'white', borderRadius: '20px', padding: '32px',
                    maxWidth: '480px', width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                }} onClick={e => e.stopPropagation()}>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px',
                        background: '#F3E8FF', color: '#7C3AED',
                        borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        marginBottom: '12px', letterSpacing: '1px'
                    }}>
                        💡 游戏提示
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>
                        {tip.icon} {tip.title}
                    </h2>

                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569', marginBottom: '24px' }}>
                        {tip.message}
                    </p>

                    <button onClick={handleDismissTip} style={{
                        width: '100%', padding: '14px',
                        background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        fontSize: '15px', fontWeight: '700', cursor: 'pointer'
                    }}>
                        我知道了
                    </button>
                </div>
            </div>
        );
    }

    // 建筑朝圣之旅：考察完成卡片（绿色系）
    if (state.atlas?.expeditionComplete && !showEventModal && !state.ui.moneyWarning && !state.gameTip && state.ui.screen === 'game') {
        const completedId = state.atlas.expeditionComplete.buildingId;
        let buildingName = completedId;
        const b = atlasBuildings.find(b => b.id === completedId);
        if (b) buildingName = b.name;

        const hasMilestone = !!state.atlas.pendingMilestone;

        const handleDismiss = () => {
            dispatch({ type: 'DISMISS_EXPEDITION_COMPLETE' });
        };

        // 如果同时有里程碑，先显示考察完成，再显示里程碑
        if (!hasMilestone || state.atlas.expeditionComplete) {
            return (
                <div style={{
                    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }} onClick={handleDismiss}>
                    <div style={{
                        background: 'white', borderRadius: '20px', padding: '32px',
                        maxWidth: '480px', width: '90%',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{
                            display: 'inline-block', padding: '4px 12px',
                            background: '#ECFDF5', color: '#059669',
                            borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                            marginBottom: '12px', letterSpacing: '1px'
                        }}>
                            🌍 建筑朝圣之旅
                        </div>

                        <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', marginBottom: '12px' }}>
                            🏛️ 考察完成！
                        </h2>

                        <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569', marginBottom: '8px' }}>
                            你已完成对 <strong style={{ color: '#059669' }}>{buildingName}</strong> 的考察，图鉴已点亮！去朝圣下一座建筑吧！
                        </p>
                        <p style={{ fontSize: '14px', color: '#94A3B8', marginBottom: '24px' }}>
                            已点亮 {(state.atlas.visited || []).length}/12 座建筑
                            {hasMilestone && ' · 🎉 里程碑达成！'}
                        </p>

                        <button onClick={handleDismiss} style={{
                            width: '100%', padding: '14px',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: 'white', border: 'none', borderRadius: '12px',
                            fontSize: '15px', fontWeight: '700', cursor: 'pointer'
                        }}>
                            {hasMilestone ? '查看里程碑奖励 🎉' : '太棒了！'}
                        </button>
                    </div>
                </div>
            );
        }
    }

    // 建筑朝圣之旅：里程碑达成卡片（金色系）
    if (state.atlas?.pendingMilestone && !state.atlas.expeditionComplete && !showEventModal && !state.ui.moneyWarning && !state.gameTip && state.ui.screen === 'game') {
        const ms = state.atlas.pendingMilestone;
        const handleDismiss = () => {
            dispatch({ type: 'DISMISS_EXPEDITION_COMPLETE' });
        };

        const rewardText = [];
        if (ms.reward.design) rewardText.push(`设计+${ms.reward.design}`);
        if (ms.reward.software) rewardText.push(`软件+${ms.reward.software}`);
        if (ms.reward.portfolioScore) rewardText.push(`作品集+${ms.reward.portfolioScore}`);

        return (
            <div style={{
                position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 1000
            }} onClick={handleDismiss}>
                <div style={{
                    background: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)',
                    borderRadius: '20px', padding: '32px',
                    maxWidth: '480px', width: '90%',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                    border: '2px solid #38BDF8'
                }} onClick={e => e.stopPropagation()}>
                    <div style={{
                        display: 'inline-block', padding: '4px 12px',
                        background: '#E0F2FE', color: '#0284C7',
                        borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                        marginBottom: '12px', letterSpacing: '1px'
                    }}>
                        🎉 里程碑达成
                    </div>

                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0369A1', marginBottom: '12px' }}>
                        {ms.title}
                    </h2>

                    <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#075985', marginBottom: '16px' }}>
                        {ms.desc}
                    </p>

                    <div style={{
                        display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px'
                    }}>
                        {rewardText.map((t, i) => (
                            <span key={i} style={{
                                padding: '6px 14px', background: '#BAE6FD',
                                borderRadius: '20px', fontSize: '14px', fontWeight: '700',
                                color: '#0369A1'
                            }}>{t}</span>
                        ))}
                    </div>

                    <button onClick={handleDismiss} style={{
                        width: '100%', padding: '14px',
                        background: 'linear-gradient(135deg, #0EA5E9, #0284C7)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        fontSize: '15px', fontWeight: '700', cursor: 'pointer'
                    }}>
                        继续旅程 🌍
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
