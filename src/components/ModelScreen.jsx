// 模型制作选择界面 - 全屏遮罩 + 横版卡片布局

import React from 'react';
import { useGame } from '../logic/gameState';
import { modelOptions } from '../data/models';

export default function ModelScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const { money } = state.attributes;

    const handleSelect = (modelOption) => {
        if (money > modelOption.cost) {
            dispatch({ type: ActionTypes.MAKE_MODEL, payload: { modelOption } });
        }
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99990, padding: '20px'
        }}>
            <div style={{
                background: '#F8FAFC', borderRadius: '24px', width: '100%', maxWidth: '680px',
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
            }}>
                {/* 标题区域 */}
                <div style={{
                    padding: '24px 32px 20px', background: 'white',
                    borderBottom: '1px solid #E2E8F0', flexShrink: 0
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', margin: '0 0 8px' }}>
                                🏗️ 模型制作周
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748B', margin: 0 }}>
                                请选择模型制作方案，模型质量直接影响评图成绩。当前余额：
                                <strong style={{ color: '#3B82F6', marginLeft: '4px' }}>¥{money.toLocaleString()}</strong>
                            </p>
                        </div>

                        {money > 0 && money <= 200 && (
                            <button
                                onClick={() => dispatch({ type: ActionTypes.TRIGGER_BANKRUPT })}
                                style={{
                                    padding: '10px 16px', background: '#FEE2E2', color: '#DC2626',
                                    border: '1px solid #FCA5A5', borderRadius: '10px',
                                    fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                                    transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = '#FECACA'}
                                onMouseLeave={e => e.currentTarget.style.background = '#FEE2E2'}
                            >
                                💸 囊中羞涩（触发破产结局）
                            </button>
                        )}
                    </div>
                </div>

                {/* 横版卡片列表 - 可滚动 */}
                <div style={{
                    flex: 1, overflowY: 'auto', padding: '20px 24px',
                    display: 'flex', flexDirection: 'column', gap: '14px'
                }}>
                    {modelOptions.map(option => {
                        const canAfford = money > option.cost;
                        return (
                            <div
                                key={option.id}
                                onClick={() => canAfford && handleSelect(option)}
                                style={{
                                    background: 'white', borderRadius: '16px',
                                    padding: '20px 24px',
                                    boxShadow: canAfford
                                        ? '0 4px 12px rgba(0,0,0,0.06)'
                                        : '0 2px 6px rgba(0,0,0,0.04)',
                                    border: canAfford ? '2px solid #E2E8F0' : '2px solid #F1F5F9',
                                    opacity: canAfford ? 1 : 0.55,
                                    cursor: canAfford ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', gap: '20px'
                                }}
                                onMouseEnter={e => {
                                    if (canAfford) {
                                        e.currentTarget.style.borderColor = '#3B82F6';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(59,130,246,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = canAfford ? '#E2E8F0' : '#F1F5F9';
                                    e.currentTarget.style.boxShadow = canAfford
                                        ? '0 4px 12px rgba(0,0,0,0.06)'
                                        : '0 2px 6px rgba(0,0,0,0.04)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* 左侧：名称+描述 */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '16px', fontWeight: '800', color: '#1E293B',
                                        marginBottom: '6px'
                                    }}>
                                        {option.name}
                                    </div>
                                    <p style={{
                                        fontSize: '13px', color: '#64748B', margin: 0,
                                        lineHeight: '1.5'
                                    }}>
                                        {option.description}
                                    </p>
                                </div>

                                {/* 右侧：价格+质量 */}
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                                    gap: '6px', flexShrink: 0
                                }}>
                                    <span style={{
                                        fontSize: '18px', fontWeight: '900',
                                        color: canAfford ? '#3B82F6' : '#94A3B8'
                                    }}>
                                        ¥{option.cost.toLocaleString()}
                                    </span>
                                    <span style={{
                                        padding: '4px 10px', background: '#F0FDF4',
                                        borderRadius: '20px', fontSize: '13px',
                                        fontWeight: '700', color: '#10B981'
                                    }}>
                                        质量 +{option.qualityBonus}
                                    </span>
                                    {!canAfford && (
                                        <span style={{
                                            fontSize: '12px', fontWeight: '600', color: '#EF4444'
                                        }}>
                                            💸 金钱不足
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
