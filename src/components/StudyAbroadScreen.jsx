import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { overseasUniversities, canApplyUniversity } from '../data/overseas';
import { getPortfolioScore } from '../data/postgrad';
import IeltsScreen from './IeltsScreen';
import { endings } from '../data/endings';
import { useIsMobile } from '../hooks/useIsMobile';

export default function StudyAbroadScreen() {
    const { state, dispatch } = useGame();
    const isMobile = useIsMobile();
    const [showIelts, setShowIelts] = useState(false);

    const currentIelts = state.bestIelts || 0;
    const currentPS = getPortfolioScore(state.portfolio);

    // 留学申请大五开放
    const canApplyFinal = state.progress.year >= 5;

    // 雅思每学年只能报考一次
    const alreadyTakenIeltsThisYear = state.ieltsYearTaken > 0 && state.ieltsYearTaken === state.progress.year;

    const handleClose = () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });
    };

    const handleApply = (uni) => {
        if (!canApplyFinal) return;

        let endingId = 'abroad_a_b';
        if (uni.tier === 'S' || uni.tier === 'A+') endingId = 'abroad_s';

        // 成功申请，直达结局
        dispatch({
            type: 'TRIGGER_ENDING',
            payload: { ending: endings[endingId] }
        });
    };

    return (
        <div className="screen-container" style={{ padding: isMobile ? '12px' : '40px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
            {showIelts && <IeltsScreen onClose={() => setShowIelts(false)} />}

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', margin: '0 0 8px 0' }}>✈️ 海外名校留学申请</h1>
                    <p style={{ color: '#64748B', margin: 0 }}>雅思可随时考取，最终材料投递将于大五开放。</p>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            </div>

            {/* 当前硬件条件看板 */}
            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '24px', marginBottom: isMobile ? '16px' : '32px' }}>
                <div style={{ flex: 1, background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>当前历史最高雅思成绩</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: currentIelts > 0 ? '#E11D48' : '#94A3B8' }}>
                            {currentIelts > 0 ? currentIelts.toFixed(1) : '未参加'}
                        </div>
                    </div>
                    <button
                        disabled={alreadyTakenIeltsThisYear}
                        onClick={() => !alreadyTakenIeltsThisYear && setShowIelts(true)}
                        style={{
                            padding: '12px 24px',
                            background: alreadyTakenIeltsThisYear ? '#F1F5F9' : '#EFF6FF',
                            color: alreadyTakenIeltsThisYear ? '#94A3B8' : '#3B82F6',
                            border: `2px solid ${alreadyTakenIeltsThisYear ? '#CBD5E1' : '#3B82F6'}`,
                            borderRadius: '12px', fontWeight: 'bold',
                            cursor: alreadyTakenIeltsThisYear ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {alreadyTakenIeltsThisYear ? '📋 本学年已报考（每年限一次）' : '报名雅思考试 (¥2170)'}
                    </button>
                </div>

                <div style={{ flex: 1, background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>作品集总评分 (申请极其看重)</div>
                        <div style={{ fontSize: '36px', fontWeight: '900', color: currentPS > 0 ? '#10B981' : '#94A3B8' }}>
                            {currentPS}
                        </div>
                    </div>
                </div>
            </div>

            {!canApplyFinal && (
                <div style={{ padding: '16px', background: '#FFFBEB', color: '#D97706', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                    ⚠️ 暂未开放投递：正式的录取网申将在大五（第5学年）开启。当前仅可刷雅思成绩及提升作品集。
                </div>
            )}

            {/* 院校库列表 */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)', gap: isMobile ? '12px' : '20px', overflowY: 'auto' }}>
                {overseasUniversities.map(uni => {
                    const isEligible = canApplyUniversity(uni, currentIelts, currentPS);

                    return (
                        <div key={uni.id} style={{
                            background: 'white', borderRadius: '16px', padding: '20px', position: 'relative',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `2px solid ${isEligible ? '#60A5FA' : '#E2E8F0'}`,
                            opacity: (!isEligible && canApplyFinal) ? 0.6 : 1
                        }}>
                            <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', color: '#64748B' }}>
                                Tier {uni.tier}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>{uni.country}</div>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#1E293B' }}>{uni.name}</h3>
                            <p style={{ fontSize: '12px', color: '#475569', lineHeight: '1.4', marginBottom: '16px', minHeight: '34px' }}>{uni.desc}</p>

                            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                                    <span style={{ color: '#64748B' }}>要求雅思:</span>
                                    <span style={{ color: currentIelts >= uni.ieltsReq ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>{uni.ieltsReq.toFixed(1)}</span>
                                </div>
                                <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#64748B' }}>要求作品集:</span>
                                    <span style={{ color: currentPS >= uni.psReq ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>{uni.psReq}</span>
                                </div>
                            </div>

                            <button
                                disabled={!canApplyFinal || !isEligible}
                                onClick={() => handleApply(uni)}
                                style={{
                                    background: (canApplyFinal && isEligible) ? '#3B82F6' : '#CBD5E1',
                                    color: 'white', border: 'none', padding: '10px', borderRadius: '8px',
                                    fontWeight: 'bold', cursor: (canApplyFinal && isEligible) ? 'pointer' : 'not-allowed', width: '100%',
                                    fontSize: '14px'
                                }}
                            >
                                {!canApplyFinal ? '大五开放' : (isEligible ? '支付申请费并投递' : '未达门槛')}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
