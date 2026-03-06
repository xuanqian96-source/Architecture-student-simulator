// 导师任务结算独立界面 - 评图前，展示任务完成/失败结果

import React from 'react';
import { useGame } from '../logic/gameState';

export default function TutorJudgmentScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const { tutorMissionResult } = state;

    const handleProceed = () => {
        dispatch({ type: ActionTypes.PROCEED_TO_DEFENSE });
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
            <div style={{ marginBottom: '20px', flexShrink: 0 }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#1E293B',
                    marginBottom: '8px',
                    margin: 0,
                }}>
                    📋 导师任务结算
                </h2>
                <p style={{
                    fontSize: '14px',
                    color: '#64748B',
                    margin: '6px 0 0 0',
                    lineHeight: '1.5',
                }}>
                    评图前，先来看看你的导师任务完成情况。
                </p>
            </div>

            {/* 任务结算卡片 */}
            {tutorMissionResult ? (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '24px',
                }}>
                    {/* 大图标 */}
                    <div style={{ fontSize: '72px' }}>
                        {tutorMissionResult.success === null ? '⏳'
                            : tutorMissionResult.success ? '✅' : '❌'}
                    </div>

                    {/* 结果标题 */}
                    <h3 style={{
                        fontSize: '24px',
                        fontWeight: '800',
                        color: tutorMissionResult.success === null ? '#3B82F6'
                            : tutorMissionResult.success ? '#059669' : '#DC2626',
                        margin: 0,
                    }}>
                        {tutorMissionResult.tutorName} · 任务{
                            tutorMissionResult.success === null ? '待定'
                                : tutorMissionResult.success ? '达成！' : '未完成'
                        }
                    </h3>

                    {/* 任务描述 */}
                    <div style={{
                        background: tutorMissionResult.success === null ? '#F0F9FF'
                            : tutorMissionResult.success ? '#F0FDF4' : '#FEF2F2',
                        borderRadius: '16px',
                        padding: '24px',
                        borderLeft: `5px solid ${tutorMissionResult.success === null ? '#3B82F6'
                            : tutorMissionResult.success ? '#10B981' : '#EF4444'}`,
                        maxWidth: '500px',
                        width: '100%',
                    }}>
                        <div style={{
                            fontSize: '14px',
                            color: '#64748B',
                            marginBottom: '8px',
                            fontWeight: '600',
                        }}>
                            任务内容：{tutorMissionResult.missionDesc}
                        </div>
                        <div style={{
                            fontSize: '15px',
                            color: '#334155',
                            lineHeight: '1.6',
                            fontStyle: 'italic',
                        }}>
                            "{tutorMissionResult.comment}"
                        </div>
                        {tutorMissionResult.effectSummary && (
                            <div style={{
                                fontSize: '13px',
                                color: '#475569',
                                marginTop: '12px',
                                fontWeight: '700',
                                padding: '8px 12px',
                                background: 'rgba(0,0,0,0.03)',
                                borderRadius: '8px',
                            }}>
                                效果：{tutorMissionResult.effectSummary}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '16px',
                }}>
                    <div style={{ fontSize: '64px' }}>🎓</div>
                    <p style={{ fontSize: '16px', color: '#64748B' }}>本阶段无导师任务需要结算</p>
                </div>
            )}

            {/* 底部按钮 */}
            <div style={{ flexShrink: 0, marginTop: '16px' }}>
                <button
                    onClick={handleProceed}
                    style={{
                        width: '100%',
                        padding: '16px',
                        background: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '16px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                    }}
                >
                    🎤 进入汇报策略选择
                </button>
            </div>
        </div>
    );
}
