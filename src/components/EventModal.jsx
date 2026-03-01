// 统一事件弹窗 - 支持随机事件展示和交互抉择两种模式

import React from 'react';
import { useGame } from '../logic/gameState';
import { formatEffectsForLog } from '../logic/eventEngine';

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
    return null;
}
