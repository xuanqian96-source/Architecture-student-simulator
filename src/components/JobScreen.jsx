// 私活选择界面 - 全屏遮罩 + 横版卡片布局

import React from 'react';
import { useGame } from '../logic/gameState';
import { jobs } from '../data/jobs';

// 格式化能力要求文本
function formatRequirement(req) {
    const parts = [];
    if (req.software !== undefined) parts.push(`软件≥${req.software}`);
    if (req.design !== undefined) parts.push(`设计≥${req.design}`);
    if (parts.length === 0) return '无要求';
    return parts.join(' + ');
}

export default function JobScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const { attributes, weeklyActions } = state;
    const isActionLimitReached = weeklyActions.count >= weeklyActions.limit;
    const jobTakenThisWeek = state.jobTakenThisWeek || false;

    const handleClose = () => {
        dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'game' } });
    };

    const handleTakeJob = (job) => {
        if (jobTakenThisWeek) return;
        const req = job.requirement;
        if (req.software !== undefined && attributes.software < req.software) return;
        if (req.design !== undefined && attributes.design < req.design) return;
        if (isActionLimitReached) return;
        dispatch({ type: ActionTypes.TAKE_JOB, payload: { job } });
    };

    const meetsRequirement = (job) => {
        const req = job.requirement;
        if (req.software !== undefined && attributes.software < req.software) return false;
        if (req.design !== undefined && attributes.design < req.design) return false;
        return true;
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
                    padding: '24px 28px 20px', background: 'white',
                    borderBottom: '1px solid #E2E8F0', flexShrink: 0
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', margin: '0 0 8px' }}>
                                💼 私活市场
                            </h2>
                            <p style={{ fontSize: '13px', color: '#94A3B8', margin: 0 }}>
                                接私活消耗 1 行动点，获得金钱但增加压力
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                            <div style={{ display: 'flex', gap: '6px', fontSize: '12px', fontWeight: '600' }}>
                                <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '4px 8px', borderRadius: '20px' }}>
                                    设计 {Math.floor(attributes.design)}
                                </span>
                                <span style={{ background: '#F0FDF4', color: '#10B981', padding: '4px 8px', borderRadius: '20px' }}>
                                    软件 {Math.floor(attributes.software)}
                                </span>
                            </div>
                            <button
                                onClick={handleClose}
                                style={{
                                    padding: '8px 16px', background: '#64748B', color: 'white',
                                    border: 'none', borderRadius: '8px', fontSize: '13px',
                                    fontWeight: '600', cursor: 'pointer'
                                }}
                            >
                                返回
                            </button>
                        </div>
                    </div>

                    {/* 状态提示 */}
                    {isActionLimitReached && (
                        <div style={{
                            marginTop: '12px', padding: '10px 14px',
                            background: '#FEF3C7', border: '1px solid #F59E0B',
                            borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#92400E'
                        }}>
                            ⚠️ 本周行动次数已用完，无法接私活
                        </div>
                    )}
                    {jobTakenThisWeek && !isActionLimitReached && (
                        <div style={{
                            marginTop: '12px', padding: '10px 14px',
                            background: '#DBEAFE', border: '1px solid #3B82F6',
                            borderRadius: '10px', fontSize: '13px', fontWeight: '600', color: '#1E40AF'
                        }}>
                            💼 本周已接取过私活，每周仅限一次
                        </div>
                    )}
                </div>

                {/* 横版卡片列表 */}
                <div style={{
                    flex: 1, overflowY: 'auto', padding: '20px 24px',
                    display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                    {jobs.map(job => {
                        const canDo = meetsRequirement(job) && !isActionLimitReached && !jobTakenThisWeek;
                        const meetsReq = meetsRequirement(job);

                        return (
                            <div
                                key={job.id}
                                onClick={() => canDo && handleTakeJob(job)}
                                style={{
                                    background: 'white', borderRadius: '16px',
                                    padding: '18px 22px',
                                    boxShadow: canDo
                                        ? '0 4px 12px rgba(0,0,0,0.06)'
                                        : '0 2px 6px rgba(0,0,0,0.04)',
                                    border: canDo ? '2px solid #E2E8F0' : '2px solid #F1F5F9',
                                    opacity: canDo ? 1 : 0.55,
                                    cursor: canDo ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s ease',
                                    display: 'flex', alignItems: 'center', gap: '18px'
                                }}
                                onMouseEnter={e => {
                                    if (canDo) {
                                        e.currentTarget.style.borderColor = '#10B981';
                                        e.currentTarget.style.boxShadow = '0 8px 20px rgba(16,185,129,0.15)';
                                        e.currentTarget.style.transform = 'translateY(-2px)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = canDo ? '#E2E8F0' : '#F1F5F9';
                                    e.currentTarget.style.boxShadow = canDo
                                        ? '0 4px 12px rgba(0,0,0,0.06)'
                                        : '0 2px 6px rgba(0,0,0,0.04)';
                                    e.currentTarget.style.transform = 'translateY(0)';
                                }}
                            >
                                {/* 左侧：名称 + 描述 + 要求 */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#1E293B', marginBottom: '4px' }}>
                                        {job.name}
                                    </div>
                                    <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 6px', lineHeight: '1.5', fontStyle: 'italic' }}>
                                        "{job.description}"
                                    </p>
                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '11px', fontWeight: '700', padding: '2px 8px',
                                            borderRadius: '20px',
                                            background: meetsReq ? '#EFF6FF' : '#FEF2F2',
                                            color: meetsReq ? '#3B82F6' : '#EF4444'
                                        }}>
                                            {meetsReq ? '✓' : '✗'} {formatRequirement(job.requirement)}
                                        </span>
                                        <span style={{
                                            fontSize: '11px', fontWeight: '600', padding: '2px 8px',
                                            borderRadius: '20px', background: '#FEF3C7', color: '#D97706'
                                        }}>
                                            ⚡ 压力+20
                                        </span>
                                    </div>
                                </div>

                                {/* 右侧：报酬 */}
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
                                    gap: '4px', flexShrink: 0
                                }}>
                                    <span style={{
                                        fontSize: '20px', fontWeight: '900',
                                        color: canDo ? '#10B981' : '#94A3B8'
                                    }}>
                                        +¥{job.payment.toLocaleString()}
                                    </span>
                                    {!meetsReq && (
                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#EF4444' }}>
                                            💔 能力不足
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
