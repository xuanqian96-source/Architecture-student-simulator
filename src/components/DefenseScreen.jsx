// 汇报策略选择界面 - 导师任务结算后、评图前（导师结算已拆分至TutorJudgmentScreen）

import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { defenseStrategies } from '../data/defense';

export default function DefenseScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const [selectedStrategy, setSelectedStrategy] = useState(null);

    const checkReqs = (strategy) => {
        if (!strategy.requirements) return { meet: true };
        const { design, software, stress } = strategy.requirements;
        if (design && state.attributes.design < design) return { meet: false, msg: `设计 ≥ ${design}` };
        if (software && state.attributes.software < software) return { meet: false, msg: `软件 ≥ ${software}` };
        if (stress && state.attributes.stress < stress) return { meet: false, msg: `压力 ≥ ${stress}` };
        return { meet: true };
    };

    const handleSelectStrategy = (strategyId) => {
        setSelectedStrategy(strategyId);
        setTimeout(() => {
            dispatch({ type: ActionTypes.CHOOSE_DEFENSE, payload: { strategyId } });
        }, 800);
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
            <div style={{ marginBottom: '16px', flexShrink: 0 }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#1E293B',
                    marginBottom: '6px',
                    margin: 0,
                }}>
                    🎤 汇报策略选择
                </h2>
                <p style={{
                    fontSize: '14px',
                    color: '#64748B',
                    margin: '6px 0 0 0',
                    lineHeight: '1.5',
                }}>
                    评图前，请选择你的汇报策略。不同策略有不同的成功率和效果。
                </p>
            </div>

            {/* 策略卡片网格 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                flex: 1,
                overflowY: 'auto',
            }}>
                {defenseStrategies.map(strategy => {
                    const ratePercent = Math.round(strategy.successRate * 100);
                    const rateColor = ratePercent >= 80 ? '#10B981'
                        : ratePercent >= 50 ? '#F59E0B' : '#EF4444';

                    const req = checkReqs(strategy);
                    const isSelected = selectedStrategy === strategy.id;
                    const isOtherSelected = selectedStrategy && selectedStrategy !== strategy.id;
                    const isDisabled = !req.meet || selectedStrategy !== null;

                    return (
                        <div
                            key={strategy.id}
                            onClick={() => !isDisabled && handleSelectStrategy(strategy.id)}
                            style={{
                                background: 'white',
                                borderRadius: '14px',
                                padding: '20px',
                                boxShadow: isSelected ? '0 12px 40px rgba(59,130,246,0.3)' : '0 2px 10px rgba(0,0,0,0.08)',
                                border: isSelected ? '2px solid #3B82F6' : '2px solid #E2E8F0',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                transform: 'none',
                                opacity: !req.meet || isOtherSelected ? 0.5 : 1,
                                filter: !req.meet || isOtherSelected ? 'grayscale(0.8)' : 'none',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                position: 'relative',
                            }}
                            onMouseEnter={e => {
                                if (isDisabled) return;
                                e.currentTarget.style.borderColor = '#3B82F6';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59,130,246,0.15)';
                            }}
                            onMouseLeave={e => {
                                if (isDisabled) return;
                                e.currentTarget.style.borderColor = isSelected ? '#3B82F6' : '#E2E8F0';
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = isSelected ? '0 12px 40px rgba(59,130,246,0.3)' : '0 2px 10px rgba(0,0,0,0.08)';
                            }}
                        >
                            {/* 策略名称和图标 */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '24px' }}>{strategy.icon}</span>
                                    <div>
                                        <div style={{
                                            fontSize: '16px',
                                            fontWeight: '700',
                                            color: '#1E293B',
                                        }}>
                                            {strategy.name}
                                        </div>
                                        <div style={{
                                            fontSize: '11px',
                                            color: '#94A3B8',
                                            fontWeight: '600',
                                            letterSpacing: '0.5px',
                                        }}>
                                            {strategy.subtitle}
                                        </div>
                                    </div>
                                </div>

                                {/* 成功率 */}
                                <div style={{
                                    padding: '4px 10px',
                                    borderRadius: '20px',
                                    background: `${rateColor}15`,
                                    color: rateColor,
                                    fontSize: '13px',
                                    fontWeight: '800',
                                }}>
                                    {ratePercent}%
                                </div>
                            </div>

                            {/* 锁定提示层 */}
                            {!req.meet && (
                                <div style={{
                                    position: 'absolute',
                                    top: '16px', left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: '#1E293B', color: 'white',
                                    padding: '6px 14px', borderRadius: '20px',
                                    fontSize: '12px', fontWeight: '700',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                    zIndex: 10,
                                    whiteSpace: 'nowrap',
                                }}>
                                    🔒 需要: {req.msg}
                                </div>
                            )}

                            {/* 策略描述 */}
                            <p style={{
                                fontSize: '13px',
                                color: '#64748B',
                                margin: 0,
                                lineHeight: '1.5',
                            }}>
                                {strategy.description}
                            </p>

                            {/* 成功/失败效果预览 */}
                            <div style={{
                                display: 'flex',
                                gap: '8px',
                                flexWrap: 'wrap',
                                marginTop: 'auto',
                            }}>
                                {strategy.id !== 'standard' && (
                                    <>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: '#10B981',
                                            background: '#F0FDF4',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                        }}>
                                            ✓ {formatEffectsPreview(strategy.successEffects)}
                                        </span>
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '600',
                                            color: '#EF4444',
                                            background: '#FEF2F2',
                                            padding: '2px 6px',
                                            borderRadius: '4px',
                                        }}>
                                            ✗ {formatEffectsPreview(strategy.failEffects)}
                                        </span>
                                    </>
                                )}
                                {strategy.id === 'standard' && (
                                    <span style={{
                                        fontSize: '11px',
                                        fontWeight: '600',
                                        color: '#64748B',
                                        background: '#F1F5F9',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                    }}>
                                        无属性变化
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 格式化效果预览文本
function formatEffectsPreview(effects) {
    if (!effects || Object.keys(effects).length === 0) return '无';
    const parts = [];
    if (effects.design) parts.push(`设计${effects.design > 0 ? '+' : ''}${effects.design}`);
    if (effects.software) parts.push(`软件${effects.software > 0 ? '+' : ''}${effects.software}`);
    if (effects.stress) parts.push(`压力${effects.stress > 0 ? '+' : ''}${effects.stress}`);
    if (effects.money) parts.push(`¥${effects.money > 0 ? '+' : ''}${effects.money}`);
    if (effects.quality) parts.push(`质量${effects.quality > 0 ? '+' : ''}${effects.quality}`);
    if (effects.gradeDowngrade) parts.push('评价降级');
    return parts.join(' ');
}
