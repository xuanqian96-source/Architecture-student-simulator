// 评图结果展示界面

import React from 'react';
import { useGame } from '../logic/gameState';

const gradeColors = {
    S: '#7C3AED',
    A: '#10B981',
    B: '#3B82F6',
    C: '#F59E0B',
    D: '#EF4444',
    E: '#DC2626',
};

export default function ReviewScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const { reviewResult } = state.ui;

    const handleContinue = () => {
        dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'game' } });
    };

    if (!reviewResult) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <div>加载中...</div>
            </div>
        );
    }

    const gradeColor = gradeColors[reviewResult.grade] || '#64748B';

    return (
        <div style={{
            height: '100%',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '560px',
                width: '100%',
                boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
            }}>
                {/* 标题 */}
                <h2 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#1E293B',
                    textAlign: 'center',
                    marginBottom: '32px'
                }}>
                    {reviewResult.type === 'midterm' ? '📐 期中评图' : '🎓 期末评图'}
                </h2>

                {/* 成绩 */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '24px'
                }}>
                    <div style={{
                        fontSize: '72px',
                        fontWeight: '900',
                        color: gradeColor,
                        lineHeight: 1
                    }}>
                        {reviewResult.grade || (reviewResult.passed ? 'P' : 'F')}
                    </div>
                    {reviewResult.score !== undefined && (
                        <div style={{
                            fontSize: '20px',
                            fontWeight: '600',
                            color: '#64748B',
                            marginTop: '8px'
                        }}>
                            分数: {reviewResult.score}
                        </div>
                    )}
                </div>

                {/* 导师评语 */}
                <div style={{
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '20px',
                    borderLeft: `4px solid ${gradeColor}`
                }}>
                    <div style={{
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#94A3B8',
                        marginBottom: '8px',
                        letterSpacing: '1px',
                        textTransform: 'uppercase'
                    }}>
                        导师评语
                    </div>
                    <div style={{
                        fontSize: '15px',
                        lineHeight: '1.8',
                        color: '#1E293B'
                    }}>
                        {reviewResult.comment || '继续努力!'}
                    </div>
                </div>

                {/* 警告提示 */}
                {!reviewResult.passed && (
                    <div style={{
                        padding: '14px 18px',
                        background: '#FEF3C7',
                        borderRadius: '10px',
                        borderLeft: '4px solid #F59E0B',
                        marginBottom: '20px'
                    }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#92400E' }}>
                            ⚠️ 未通过评图,已记录一次警告,请在下学期加油!
                        </div>
                    </div>
                )}

                {/* 如果有作品集入库荣誉，展示激动的表彰卡片 */}
                {state.ui.newPortfolioProject && (
                    <div style={{
                        marginTop: '16px',
                        marginBottom: '32px',
                        padding: '24px',
                        background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
                        borderRadius: '16px',
                        border: '2px solid #F59E0B',
                        boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.2)',
                        textAlign: 'center',
                        position: 'relative',
                        overflow: 'hidden',
                        animation: 'fadeInUp 0.6s ease-out forwards' // 如果想加上轻微上浮动画
                    }}>
                        <div style={{
                            position: 'absolute',
                            right: '-20px',
                            bottom: '-20px',
                            fontSize: '100px',
                            opacity: 0.1,
                            transform: 'rotate(-15deg)',
                            pointerEvents: 'none'
                        }}>🏅</div>
                        <h3 style={{ margin: '0 0 10px 0', color: '#B45309', fontSize: '20px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '24px' }}>🏆</span> 杰出评图表现！
                        </h3>
                        <p style={{ margin: '0 0 16px 0', color: '#92400E', fontSize: '15px', fontWeight: 'bold' }}>
                            课题 <span style={{ color: '#D97706', textDecoration: 'underline' }}>{state.ui.newPortfolioProject.title}</span> 荣获最高评定！
                        </p>
                        <div style={{ display: 'inline-block', background: '#F59E0B', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(245, 158, 11, 0.3)' }}>
                            已永久收录至【荣誉作品集】
                        </div>
                    </div>
                )}

                {/* 继续按钮 */}
                <button
                    onClick={handleContinue}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #3B82F6, #6366F1)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}
                >
                    继续下学期 →
                </button>
            </div>
        </div>
    );
}
