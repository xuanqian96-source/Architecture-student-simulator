// 模型制作选择界面

import React from 'react';
import { useGame } from '../logic/gameState';
import { modelOptions } from '../data/models';

export default function ModelScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const { money } = state.attributes;

    const handleSelect = (modelOption) => {
        if (money >= modelOption.cost) {
            dispatch({ type: ActionTypes.MAKE_MODEL, payload: { modelOption } });
        }
    };

    return (
        <div style={{
            height: '100%',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* 标题 */}
            <div style={{ marginBottom: '20px', flexShrink: 0, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h2 style={{
                        fontSize: '22px',
                        fontWeight: '800',
                        color: '#1E293B',
                        marginBottom: '8px'
                    }}>
                        🏗️ 模型制作周
                    </h2>
                    <p style={{ fontSize: '15px', color: '#64748B', margin: 0 }}>
                        请选择模型制作方案。模型质量直接影响评图成绩。当前余额:
                        <strong style={{ color: '#3B82F6', marginLeft: '6px' }}>¥{money.toLocaleString()}</strong>
                    </p>
                </div>

                {money > 0 && money < 200 && (
                    <button
                        onClick={() => dispatch({ type: ActionTypes.TRIGGER_BANKRUPT })}
                        style={{
                            padding: '10px 16px',
                            background: '#FEE2E2',
                            color: '#DC2626',
                            border: '1px solid #FCA5A5',
                            borderRadius: '8px',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FECACA'}
                        onMouseLeave={e => e.currentTarget.style.background = '#FEE2E2'}
                    >
                        囊中羞涩 (放弃提交模型，触发破产结局)
                    </button>
                )}
            </div>

            {/* 选项网格 - 可滚动 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                flex: 1,
                overflowY: 'auto'
            }}>
                {modelOptions.map(option => {
                    const canAfford = money >= option.cost;
                    return (
                        <div
                            key={option.id}
                            onClick={() => handleSelect(option)}
                            style={{
                                background: 'white',
                                borderRadius: '14px',
                                padding: '20px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                                border: canAfford ? '2px solid #E2E8F0' : '2px solid #E2E8F0',
                                opacity: canAfford ? 1 : 0.55,
                                cursor: canAfford ? 'pointer' : 'not-allowed',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '700',
                                    color: '#1E293B'
                                }}>
                                    {option.name}
                                </span>
                                <span style={{
                                    fontSize: '15px',
                                    fontWeight: '800',
                                    color: canAfford ? '#3B82F6' : '#94A3B8',
                                    whiteSpace: 'nowrap',
                                    marginLeft: '8px'
                                }}>
                                    ¥{option.cost}
                                </span>
                            </div>

                            <div style={{
                                fontSize: '13px',
                                fontWeight: '600',
                                color: '#10B981'
                            }}>
                                质量 +{option.qualityBonus}
                            </div>

                            <p style={{
                                fontSize: '13px',
                                color: '#64748B',
                                margin: 0,
                                lineHeight: '1.5'
                            }}>
                                {option.description}
                            </p>

                            {!canAfford && (
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#EF4444'
                                }}>
                                    💸 金钱不足
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
