// 私活选择界面

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

    const handleClose = () => {
        dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'game' } });
    };

    const handleTakeJob = (job) => {
        // 检查能力是否满足
        const req = job.requirement;
        if (req.software !== undefined && attributes.software < req.software) return;
        if (req.design !== undefined && attributes.design < req.design) return;
        // 检查行动点
        if (isActionLimitReached) return;

        dispatch({ type: ActionTypes.TAKE_JOB, payload: { job } });
    };

    // 判断某个私活是否满足能力要求
    const meetsRequirement = (job) => {
        const req = job.requirement;
        if (req.software !== undefined && attributes.software < req.software) return false;
        if (req.design !== undefined && attributes.design < req.design) return false;
        return true;
    };

    return (
        <div style={{
            height: '100%',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
        }}>
            {/* 标题栏 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexShrink: 0
            }}>
                <div>
                    <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#1E293B', margin: 0 }}>
                        💼 私活市场
                    </h2>
                    <p style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', marginBottom: 0 }}>
                        接私活消耗 1 次行动点，同时获得金钱但增加压力
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {/* 当前属性提示 */}
                    <div style={{
                        display: 'flex', gap: '8px',
                        fontSize: '13px', fontWeight: '600', color: '#475569'
                    }}>
                        <span style={{ background: '#EFF6FF', color: '#3B82F6', padding: '4px 10px', borderRadius: '20px' }}>
                            设计 {Math.floor(attributes.design)}
                        </span>
                        <span style={{ background: '#F0FDF4', color: '#10B981', padding: '4px 10px', borderRadius: '20px' }}>
                            软件 {Math.floor(attributes.software)}
                        </span>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{
                            padding: '8px 20px',
                            background: '#64748B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        返回游戏
                    </button>
                </div>
            </div>

            {/* 行动点耗尽提示 */}
            {isActionLimitReached && (
                <div style={{
                    padding: '12px 16px',
                    background: '#FEF3C7',
                    border: '1px solid #F59E0B',
                    borderRadius: '10px',
                    marginBottom: '14px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#92400E',
                    flexShrink: 0
                }}>
                    ⚠️ 本周行动次数已用完，无法接私活，请点击"下一周"推进时间
                </div>
            )}

            {/* 私活列表 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '14px',
                overflowY: 'auto',
                flex: 1
            }}>
                {jobs.map(job => {
                    const canDo = meetsRequirement(job) && !isActionLimitReached;
                    const meetsReq = meetsRequirement(job);

                    return (
                        <div
                            key={job.id}
                            onClick={() => canDo && handleTakeJob(job)}
                            style={{
                                background: 'white',
                                borderRadius: '14px',
                                padding: '20px',
                                boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
                                border: canDo
                                    ? '2px solid #E2E8F0'
                                    : '2px solid #E2E8F0',
                                opacity: canDo ? 1 : 0.55,
                                cursor: canDo ? 'pointer' : 'not-allowed',
                                transition: 'all 0.15s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}
                            onMouseEnter={e => {
                                if (canDo) e.currentTarget.style.borderColor = '#10B981';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#E2E8F0';
                            }}
                        >
                            {/* 名称 + 报酬 */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '16px', fontWeight: '700', color: '#1E293B' }}>
                                    {job.name}
                                </span>
                                <span style={{
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    color: canDo ? '#10B981' : '#94A3B8',
                                    whiteSpace: 'nowrap',
                                    marginLeft: '8px'
                                }}>
                                    + ¥{job.payment.toLocaleString()}
                                </span>
                            </div>

                            {/* 能力要求 */}
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                fontWeight: '700',
                                color: meetsReq ? '#3B82F6' : '#EF4444',
                                background: meetsReq ? '#EFF6FF' : '#FEF2F2',
                                padding: '3px 10px',
                                borderRadius: '20px',
                                width: 'fit-content'
                            }}>
                                {meetsReq ? '✓' : '✗'} 要求：{formatRequirement(job.requirement)}
                            </div>

                            {/* 吐槽描述 */}
                            <p style={{
                                fontSize: '13px',
                                color: '#64748B',
                                margin: 0,
                                lineHeight: '1.6',
                                fontStyle: 'italic'
                            }}>
                                "{job.description}"
                            </p>

                            {/* 副作用提示 */}
                            <div style={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#F59E0B'
                            }}>
                                ⚡ 接单后：压力 +20，消耗 1 行动点
                            </div>

                            {/* 能力不足标签 */}
                            {!meetsReq && (
                                <span style={{ fontSize: '12px', fontWeight: '600', color: '#EF4444' }}>
                                    💔 能力不足，无法接单
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
