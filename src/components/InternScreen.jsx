import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { internships, INTERN_WEEKLY_STRESS, canIntern } from '../data/employment';

export default function InternScreen() {
    const { state, dispatch } = useGame();
    const hasInternedThisYear = !!state.currentIntern;

    const handleClose = () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });
    };

    const handleTakeIntern = (intern) => {
        // 通知全局状态记录实习，并根据用户要求固定传入 year 以供简历渲染
        dispatch({
            type: 'RECORD_INTERN',
            payload: { internId: intern.id, stressPenalty: INTERN_WEEKLY_STRESS, year: state.progress.year }
        });
        // 不再立即关闭界面，以便玩家看到“正在实习”的变化
    };

    return (
        <div className="screen-container" style={{ padding: '40px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', margin: '0 0 8px 0' }}>💼 寻找实习机会</h1>
                    <p style={{ color: '#64748B', margin: 0 }}>一份好的实习是未来顶级 Offer 的敲门砖。代价是<strong style={{ color: '#EF4444' }}>本学年每周压力增加 {INTERN_WEEKLY_STRESS} 点</strong>。</p>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ padding: '16px', background: '#FEF2F2', color: '#B91C1C', borderRadius: '12px', marginBottom: '24px', fontWeight: 'bold' }}>
                ⚠️ 你已完成本学年的实习安排！本学年内每周压力将会固定额外 +{INTERN_WEEKLY_STRESS}。请专注眼前的这根稻草，不可再接取其他实习。下一学年会重置此限制。
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', overflowY: 'auto' }}>
                {internships.map(intern => {
                    const isEligible = canIntern(intern, state);
                    const isArch = intern.type === '建筑';

                    return (
                        <div key={intern.id} style={{
                            background: 'white', borderRadius: '16px', padding: '24px', position: 'relative',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `2px solid ${isEligible ? (isArch ? '#60A5FA' : '#A78BFA') : '#E2E8F0'}`,
                            opacity: isEligible ? 1 : 0.6, display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ position: 'absolute', top: '16px', right: '16px', background: isArch ? '#EFF6FF' : '#F5F3FF', color: isArch ? '#2563EB' : '#7C3AED', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                {intern.type}
                            </div>

                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{intern.icon}</div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1E293B' }}>{intern.name}</h3>
                            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', flex: 1, minHeight: '60px' }}>{intern.description}</p>

                            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginTop: '16px', marginBottom: '24px' }}>
                                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', fontWeight: 'bold' }}>录用门槛：</div>
                                {intern.requirements.design && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>设计能力:</span><span style={{ color: state.attributes.design >= intern.requirements.design ? '#10B981' : '#EF4444' }}>≥ {intern.requirements.design}</span></div>}
                                {intern.requirements.software && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>软件能力:</span><span style={{ color: state.attributes.software >= intern.requirements.software ? '#10B981' : '#EF4444' }}>≥ {intern.requirements.software}</span></div>}
                                {intern.requirements.ps && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>作品集评分:</span><span style={{ color: getPortfolioScore(state.portfolio) >= intern.requirements.ps ? '#10B981' : '#EF4444' }}>≥ {intern.requirements.ps}</span></div>}
                                {intern.requirements.stressBelow && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>当前压力:</span><span style={{ color: state.attributes.stress <= intern.requirements.stressBelow ? '#10B981' : '#EF4444' }}>&lt; {intern.requirements.stressBelow}</span></div>}
                            </div>

                            {/* 若今年已有实习，或者正在申请此实习，变更按钮为印章/不可用状 */}
                            {hasInternedThisYear ? (
                                <div style={{
                                    textAlign: 'center', padding: '12px', borderRadius: '8px',
                                    border: '2px dashed #EF4444', color: '#EF4444', fontWeight: '900',
                                    fontSize: '18px', background: '#FEF2F2', letterSpacing: '4px'
                                }}>
                                    待下一学年
                                </div>
                            ) : (
                                <button
                                    disabled={!isEligible}
                                    onClick={() => handleTakeIntern(intern)}
                                    style={{
                                        background: isEligible ? (isArch ? '#3B82F6' : '#8B5CF6') : '#CBD5E1',
                                        color: 'white', border: 'none', padding: '12px', borderRadius: '8px',
                                        fontWeight: 'bold', cursor: isEligible ? 'pointer' : 'not-allowed', width: '100%'
                                    }}
                                >
                                    {isEligible ? '投递简历并入职' : '能力不匹配'}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// 需要把 getPortfolioScore 放进组件可用或者重用
function getPortfolioScore(portfolio) {
    return portfolio.reduce((sum, p) => sum + (p.qualityScore || 0), 0);
}
