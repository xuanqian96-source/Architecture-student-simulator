// 一体化评图流程界面 - 导师结算 → 汇报策略 → 策略结果 → 评图成绩

import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { defenseStrategies } from '../data/defense';

const gradeColors = {
    S: '#F59E0B', A: '#F97316', B: '#3B82F6',
    C: '#10B981', D: '#64748B', F: '#DC2626',
};

// 格式化效果展示
const formatEffects = (effects) => {
    if (!effects) return '';
    const parts = [];
    if (effects.design) parts.push(`设计 ${effects.design > 0 ? '+' : ''}${effects.design}`);
    if (effects.software) parts.push(`软件 ${effects.software > 0 ? '+' : ''}${effects.software}`);
    if (effects.stress) parts.push(`压力 ${effects.stress > 0 ? '+' : ''}${effects.stress}`);
    if (effects.money) parts.push(`金钱 ${effects.money > 0 ? '+' : ''}${effects.money}`);
    if (effects.quality) parts.push(`质量 ${effects.quality > 0 ? '+' : ''}${effects.quality}`);
    return parts.join(' | ');
};

// 注入动画关键帧
const injectedStyles = `
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
@keyframes pulseGlow {
    0% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.4); }
    70% { box-shadow: 0 0 0 20px rgba(16, 185, 129, 0); }
    100% { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0); }
}
`;

export default function ReviewFlowScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const { tutorMissionResult, defenseResult, pendingReviewResult } = state;
    const [step, setStep] = useState('tutorJudgment'); // tutorJudgment → defense → defenseResult → review
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
            setStep('defenseResult');
        }, 600);
    };

    const handleCompleteReview = () => {
        dispatch({ type: ActionTypes.COMPLETE_REVIEW_FLOW });
    };

    const getFinalReviewResult = () => {
        if (!pendingReviewResult) return null;
        const result = { ...pendingReviewResult };
        if (defenseResult && defenseResult.effects?.gradeDowngrade && result.grade) {
            const gradeOrder = ['S', 'A', 'B', 'C', 'D'];
            const idx = gradeOrder.indexOf(result.grade);
            if (idx >= 0 && idx < gradeOrder.length - 1) {
                result.grade = gradeOrder[idx + 1];
                result.comment = (result.comment || '') + '\n（因汇报失败，评价被降级）';
            }
        }
        return result;
    };

    const isMidterm = pendingReviewResult?.type === 'midterm';
    const cardStyle = {
        background: 'white',
        borderRadius: '24px',
        padding: '40px',
        maxWidth: '750px',
        width: '100%',
        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
        animation: 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    };
    const btnPrimary = {
        width: '100%',
        padding: '18px',
        background: '#3B82F6',
        color: 'white',
        border: 'none',
        borderRadius: '16px',
        fontSize: '18px',
        fontWeight: '800',
        cursor: 'pointer',
        marginTop: '28px',
        transition: 'all 0.2s',
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
    };

    return (
        <>
            <style>{injectedStyles}</style>
            <div style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px',
                overflow: 'auto',
                background: 'linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)',
            }}>
                {/* Step 1: 导师任务结算 */}
                {step === 'tutorJudgment' && (
                    <div style={cardStyle} key="step1">
                        <h2 style={{ fontSize: '26px', fontWeight: '900', color: '#0F172A', marginTop: 0, marginBottom: '24px' }}>
                            📋 导师任务结算
                        </h2>

                        {tutorMissionResult ? (
                            <div style={{
                                background: tutorMissionResult.success === null ? '#F0F9FF'
                                    : tutorMissionResult.success ? '#F0FDF4' : '#FEF2F2',
                                borderRadius: '16px',
                                padding: '24px',
                                borderLeft: `6px solid ${tutorMissionResult.success === null ? '#3B82F6'
                                    : tutorMissionResult.success ? '#10B981' : '#EF4444'}`,
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '14px' }}>
                                    <span style={{ fontSize: '36px' }}>
                                        {tutorMissionResult.success === null ? '⏳'
                                            : tutorMissionResult.success ? '✅' : '❌'}
                                    </span>
                                    <span style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B' }}>
                                        {tutorMissionResult.tutorName} · 任务{
                                            tutorMissionResult.success === null ? '待定'
                                                : tutorMissionResult.success ? '达成！' : '未完成'
                                        }
                                    </span>
                                </div>
                                {tutorMissionResult.missionDesc && (
                                    <div style={{ fontSize: '15px', color: '#64748B', marginBottom: '10px', fontWeight: '600' }}>
                                        任务目标：{tutorMissionResult.missionDesc}
                                    </div>
                                )}
                                <div style={{ fontSize: '16px', color: '#334155', lineHeight: '1.7', fontStyle: 'italic', background: 'rgba(255,255,255,0.6)', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>
                                    "{tutorMissionResult.comment}"
                                </div>
                                {tutorMissionResult.effectSummary && (
                                    <div style={{ fontSize: '14px', color: '#0F172A', marginTop: '16px', fontWeight: '700', background: 'rgba(0,0,0,0.05)', padding: '10px 16px', borderRadius: '10px', display: 'inline-block' }}>
                                        🎯 触发效果：{tutorMissionResult.effectSummary}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '40px', background: '#F8FAFC', borderRadius: '16px' }}>
                                <span style={{ fontSize: '56px', display: 'block', marginBottom: '16px' }}>🎓</span>
                                <p style={{ fontSize: '18px', color: '#64748B', fontWeight: '600' }}>本阶段无导师任务需要结算</p>
                            </div>
                        )}

                        <button onClick={() => setStep('defense')} style={btnPrimary} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                            🎤 进入汇报策略选择
                        </button>
                    </div>
                )}

                {/* Step 2: 汇报策略选择 */}
                {step === 'defense' && (
                    <div style={{ ...cardStyle, maxWidth: '850px' }} key="step2">
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', marginTop: 0, marginBottom: '12px' }}>
                                🎤 选择汇报策略
                            </h2>
                            <p style={{ fontSize: '15px', color: '#64748B' }}>
                                评图现场，你将以何种姿态向评委们展示你的方案？不同的策略面临不同的风险与收益。
                            </p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {defenseStrategies.map(strategy => {
                                const req = checkReqs(strategy);
                                const isSelected = selectedStrategy === strategy.id;
                                return (
                                    <div
                                        key={strategy.id}
                                        onClick={() => !isSelected && req.meet && handleSelectStrategy(strategy.id)}
                                        onMouseEnter={e => {
                                            if (req.meet && !isSelected) {
                                                e.currentTarget.style.transform = 'translateY(-4px)';
                                                e.currentTarget.style.boxShadow = '0 12px 24px -8px rgba(0,0,0,0.15)';
                                            }
                                        }}
                                        onMouseLeave={e => {
                                            if (req.meet && !isSelected) {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }
                                        }}
                                        style={{
                                            padding: '24px',
                                            borderRadius: '20px',
                                            border: `2px solid ${isSelected ? '#3B82F6' : req.meet ? '#E2E8F0' : '#FCA5A5'}`,
                                            background: isSelected ? '#EFF6FF' : req.meet ? 'white' : '#FEF2F2',
                                            cursor: req.meet && !isSelected ? 'pointer' : 'not-allowed',
                                            opacity: req.meet ? 1 : 0.6,
                                            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                                            position: 'relative'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                            <div style={{ fontSize: '28px' }}>{strategy.icon || '🎯'}</div>
                                            <div style={{ fontWeight: '800', fontSize: '18px', color: '#1E293B' }}>
                                                {strategy.name}
                                            </div>
                                        </div>
                                        <div style={{ fontSize: '14px', color: '#475569', marginBottom: '16px', lineHeight: '1.5' }}>{strategy.description}</div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontSize: '13px', color: '#3B82F6', fontWeight: '800', background: '#DBEAFE', padding: '4px 10px', borderRadius: '12px' }}>
                                                    成功率 {Math.round(strategy.successRate * 100)}%
                                                </div>
                                                {!req.meet && (
                                                    <div style={{ fontSize: '12px', color: '#EF4444', fontWeight: '700' }}>
                                                        条件: {req.msg}
                                                    </div>
                                                )}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#059669', background: '#ECFDF5', padding: '4px 8px', borderRadius: '6px' }}>
                                                ✅ 成功: {formatEffects(strategy.successEffects) || '无属性影响'}
                                            </div>
                                            <div style={{ fontSize: '12px', color: '#DC2626', background: '#FEF2F2', padding: '4px 8px', borderRadius: '6px' }}>
                                                ❌ 失败: {strategy.failEffects?.gradeDowngrade ? '期末评价降级' : formatEffects(strategy.failEffects) || '无额外惩罚'}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Step 3: 策略结果 */}
                {step === 'defenseResult' && defenseResult && (
                    <div style={cardStyle} key="step3">
                        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                            <span style={{ fontSize: '64px', display: 'block', marginBottom: '16px' }}>{defenseResult.success ? '🎯' : '💥'}</span>
                            <h2 style={{ fontSize: '32px', fontWeight: '900', color: defenseResult.success ? '#059669' : '#DC2626', margin: 0 }}>
                                汇报{defenseResult.success ? '成功' : '失败'}！
                            </h2>
                        </div>
                        <div style={{
                            background: defenseResult.success ? '#F0FDF4' : '#FEF2F2',
                            borderRadius: '20px',
                            padding: '32px',
                            border: `2px solid ${defenseResult.success ? '#BBF7D0' : '#FECACA'}`,
                            marginBottom: '24px',
                        }}>
                            <div style={{ fontWeight: '800', fontSize: '18px', color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                <span style={{ padding: '4px 12px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                    使用了策略：{defenseResult.strategy}
                                </span>
                            </div>
                            <div style={{ fontSize: '16px', color: '#475569', lineHeight: '1.7', textAlign: 'center', marginBottom: '16px' }}>
                                {defenseResult.narrative}
                            </div>

                            {/* 展示属性变动 */}
                            {defenseResult.effects && (Object.keys(defenseResult.effects).length > 0) && (
                                <div style={{ textAlign: 'center', marginTop: '12px' }}>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        background: 'rgba(0,0,0,0.05)',
                                        padding: '6px 12px',
                                        borderRadius: '8px',
                                        color: '#1E293B'
                                    }}>
                                        属性影响: {defenseResult.effects.gradeDowngrade ? '期末评价降级' : formatEffects(defenseResult.effects)}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button onClick={() => setStep('review')} style={{ ...btnPrimary, background: defenseResult.success ? '#10B981' : '#3B82F6' }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                            📝 查看评委的最终成绩
                        </button>
                    </div>
                )}

                {/* Step 4: 评图成绩 */}
                {step === 'review' && (() => {
                    const finalResult = getFinalReviewResult();
                    if (!finalResult) return <div style={cardStyle}>加载中...</div>;
                    const gradeColor = gradeColors[finalResult.grade] || '#64748B';
                    const isHighGrade = ['S', 'A'].includes(finalResult.grade);
                    return (
                        <div style={cardStyle} key="step4">
                            <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#0F172A', marginTop: 0, marginBottom: '32px', textAlign: 'center' }}>
                                🏅 {isMidterm ? '期中' : '期末'}总评成绩
                            </h2>

                            {/* 大号评分 */}
                            <div style={{ textAlign: 'center', marginBottom: '36px', position: 'relative' }}>
                                <div style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '160px',
                                    height: '160px',
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${gradeColor}11 0%, ${gradeColor}33 100%)`,
                                    border: `6px solid ${gradeColor}`,
                                    boxShadow: `0 10px 30px ${gradeColor}44, inset 0 4px 10px rgba(255,255,255,0.5)`,
                                    animation: isHighGrade ? 'pulseGlow 2s infinite' : 'none',
                                }}>
                                    <span style={{
                                        fontSize: '86px',
                                        fontWeight: '900',
                                        color: gradeColor,
                                        filter: `drop-shadow(0 4px 8px ${gradeColor}66)`
                                    }}>{finalResult.grade}</span>
                                </div>
                                <div style={{
                                    fontSize: '22px',
                                    fontWeight: '900',
                                    color: gradeColor,
                                    marginTop: '20px',
                                    letterSpacing: '2px'
                                }}>
                                    {finalResult.grade === 'S' ? '卓越级方案' : finalResult.grade === 'A' ? '优秀设计' : finalResult.grade === 'B' ? '良好评级' : finalResult.grade === 'C' ? '合格结课' : finalResult.grade === 'D' ? '质量不达标(警告)' : '进度不达标(挂科)'}
                                </div>
                            </div>

                            {/* 评语 */}
                            <div style={{
                                background: '#F8FAFC',
                                borderRadius: '16px',
                                padding: '24px',
                                marginBottom: '24px',
                                border: '1px solid #E2E8F0',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)',
                                textAlign: 'center'
                            }}>
                                <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' }}>评委点评</div>
                                <div style={{ fontSize: '16px', color: '#334155', lineHeight: '1.8', whiteSpace: 'pre-line', fontWeight: '500' }}>
                                    {finalResult.comment}
                                </div>
                            </div>

                            {/* 作品集入库提示 */}
                            {finalResult.type === 'final' && ['S', 'A'].includes(finalResult.grade) && (
                                <div style={{
                                    background: 'linear-gradient(to right, #ECFDF5, #F0FDF4)',
                                    borderRadius: '16px',
                                    padding: '20px 24px',
                                    marginBottom: '24px',
                                    border: '1px solid #BBF7D0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    animation: 'fadeInUp 0.6s ease-out'
                                }}>
                                    <span style={{ fontSize: '28px' }}>🏆</span>
                                    <div>
                                        <div style={{ fontSize: '16px', color: '#065F46', fontWeight: '800', marginBottom: '2px' }}>
                                            作品已成功收录！
                                        </div>
                                        <div style={{ fontSize: '13px', color: '#047857', fontWeight: '500' }}>
                                            该方案展现出了高水平的设计素质，已存入您的个人作品集。
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button onClick={handleCompleteReview} style={{ ...btnPrimary, background: '#1E293B' }} onMouseEnter={e => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.target.style.transform = 'translateY(0)'}>
                                {finalResult.type === 'final' ? '✅ 结算学年并继续' : '✅ 确认并进入下半学期'}
                            </button>
                        </div>
                    );
                })()}
            </div>
        </>
    );
}
