import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { postgradTiers, postgradRequirements, canApplyPostgrad, drawInterviewQuestions } from '../data/postgrad';
import { getPortfolioScore } from '../data/postgrad';
import { endings } from '../data/endings';

export default function PostgradScreen() {
    const { state, dispatch } = useGame();
    const [selectedTier, setSelectedTier] = useState(null);
    const [phase, setPhase] = useState('select'); // select, interview, result
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [confirmTier, setConfirmTier] = useState(null);

    const isEligible = canApplyPostgrad(state);
    const currentPS = getPortfolioScore(state.portfolio);
    const currentDesign = state.attributes.design;
    const warningCount = state.history.warningCount;

    const handleClose = () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });
    };

    const startInterview = (tier) => {
        setSelectedTier(tier);
        setQuestions(drawInterviewQuestions());
        setCurrentQIndex(0);
        setScore(0);
        setPhase('interview');
    };

    const handleAnswer = (optionScore) => {
        const newScore = score + optionScore;
        setScore(newScore);

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            // 结束复试，出结果
            setScore(newScore); // React 坑：这里要用新变量闭包传递给下一步
            setPhase('result');
        }
    };

    const handleResultConfirm = () => {
        const isPassed = score >= selectedTier.passScore;

        if (isPassed) {
            // 成功，触发保研结局
            const endingId = selectedTier.id === 'tierS' ? 'postgrad_s' : 'postgrad_a_b';
            dispatch({
                type: 'TRIGGER_ENDING',
                payload: { ending: endings[endingId] }
            });
            dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'ending' } });
        } else {
            // 失败，扣除巨大压力，返回游戏
            dispatch({
                type: 'PERFORM_ACTION',
                payload: {
                    type: 'POSTGRAD_FAIL',
                    cost: 0,
                    effects: { stress: 40 },
                    narrative: `很遗憾，你在【${selectedTier.name}】的保研复试中仅获得 ${score} 分（及格线 ${selectedTier.passScore} 分），未能通过审核。巨大的挫败感让你倍增压力。`
                }
            });
            handleClose();
        }
    };

    if (phase === 'interview') {
        const q = questions[currentQIndex];
        return (
            <div className="screen-container" style={{ padding: '40px', background: '#F8FAFC' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontWeight: 'bold', marginBottom: '24px' }}>
                        <span>🎓 {selectedTier.name} 复试现场</span>
                        <span>题目 {currentQIndex + 1} / 5</span>
                    </div>

                    <h2 style={{ fontSize: '24px', color: '#1E293B', lineHeight: '1.5', marginBottom: '32px' }}>
                        导师提问："{" "}{q.question}"
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(opt.score)}
                                style={{
                                    padding: '20px', background: '#F8FAFC', border: '2px solid #E2E8F0',
                                    borderRadius: '12px', fontSize: '16px', color: '#334155', textAlign: 'left',
                                    cursor: 'pointer', transition: 'all 0.2s', lineHeight: '1.5'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#EFF6FF'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'result') {
        const isPassed = score >= selectedTier.passScore;
        return (
            <div className="screen-container" style={{ padding: '40px', background: '#F8FAFC' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{isPassed ? '🎓' : '🥀'}</div>
                    <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '16px' }}>
                        {isPassed ? '拟录取通知' : '复试未通过'}
                    </h2>

                    <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                        <div style={{ fontSize: '16px', color: '#64748B', marginBottom: '8px' }}>复试总成绩</div>
                        <div style={{ fontSize: '48px', fontWeight: '900', color: isPassed ? '#10B981' : '#EF4444' }}>
                            {score} <span style={{ fontSize: '20px', color: '#94A3B8' }}>/ 50</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748B', marginTop: '8px' }}>
                            该院校录取线：{selectedTier.passScore} 分
                        </div>
                    </div>

                    <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '32px' }}>
                        {isPassed ?
                            `恭喜你！在这场残酷的内卷中，你拿到了通往【${selectedTier.name}】的门票。你的人生将进入全新的篇章。` :
                            `很遗憾，导师组认为你的学术潜能暂未达到【${selectedTier.name}】的要求。你将被退回找工作或考研的大军中。`}
                    </p>

                    <button
                        onClick={handleResultConfirm}
                        style={{
                            background: isPassed ? '#10B981' : '#64748B',
                            color: 'white', padding: '16px 48px', border: 'none', borderRadius: '12px',
                            fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%'
                        }}
                    >
                        {isPassed ? '接受 Offer (触发结局)' : '返回工作室'}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen-container" style={{ padding: '40px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', margin: '0 0 8px 0' }}>👑 申请推免硕博连读</h1>
                    <p style={{ color: '#64748B', margin: 0 }}>准备好面对最严苛的学术拷问了吗？（大四即第4年12周后开放）</p>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            </div>

            {/* 资格自查面板 */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#334155' }}>资格审查自检</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>必须大四结课后</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: state.progress.totalWeeks >= 48 ? '#10B981' : '#EF4444' }}>
                            {state.progress.totalWeeks} / 48周 {state.progress.totalWeeks >= 48 ? '✅' : '❌'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>作品集总分 ({'>'}800)</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: currentPS >= 800 ? '#10B981' : '#EF4444' }}>
                            {currentPS} {currentPS >= 800 ? '✅' : '❌'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>设计能力 ({'>'}140)</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: currentDesign >= 140 ? '#10B981' : '#EF4444' }}>
                            {Math.floor(currentDesign)} {currentDesign >= 140 ? '✅' : '❌'}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>挂科警告 (必须为0)</div>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: warningCount === 0 ? '#10B981' : '#EF4444' }}>
                            {warningCount} 次 {warningCount === 0 ? '✅' : '❌'}
                        </div>
                    </div>
                </div>
            </div>

            {/* 院校选择列表 */}
            {!isEligible ? (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FEE2E2', borderRadius: '16px', color: '#B91C1C', fontWeight: 'bold' }}>
                    暂不满足保研推免资格条件，无法提交申请。
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', flex: 1, minHeight: 0 }}>
                    {postgradTiers.map(tier => {
                        const canApplyThis = currentPS >= tier.psRequirement && currentDesign >= tier.designRequirement;
                        return (
                            <div
                                key={tier.id}
                                style={{
                                    background: 'white', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)', opacity: canApplyThis ? 1 : 0.6,
                                    border: `2px solid ${canApplyThis ? '#E2E8F0' : '#F1F5F9'}`
                                }}
                            >
                                <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>{tier.icon}</div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1E293B', textAlign: 'center' }}>{tier.name}</h3>
                                <div style={{ textAlign: 'center', color: '#64748B', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>
                                    Tier {tier.tier}
                                </div>
                                <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', flex: 1 }}>{tier.description}</p>

                                <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginTop: '16px', marginBottom: '24px' }}>
                                    <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>要求作品集:</span>
                                        <span style={{ color: currentPS >= tier.psRequirement ? '#10B981' : '#EF4444', fontWeight: 'bold' }}>{tier.psRequirement}</span>
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#64748B', display: 'flex', justifyContent: 'space-between' }}>
                                        <span>复试及格线:</span>
                                        <span style={{ fontWeight: 'bold', color: '#334155' }}>{tier.passScore} 分</span>
                                    </div>
                                </div>

                                <button
                                    disabled={!canApplyThis}
                                    onClick={() => setConfirmTier(tier)}
                                    style={{
                                        background: canApplyThis ? '#3B82F6' : '#CBD5E1', color: 'white', border: 'none', padding: '12px',
                                        borderRadius: '8px', fontWeight: 'bold', cursor: canApplyThis ? 'pointer' : 'not-allowed', width: '100%'
                                    }}
                                >
                                    {canApplyThis ? '提交申请参营' : '门槛未达标'}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 自定义确认弹窗 */}
            {confirmTier && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📨</div>
                        <h3 style={{ fontSize: '22px', color: '#1E293B', marginBottom: '12px' }}>确认投递申请</h3>
                        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
                            你即将向【{confirmTier.name}】提交保研材料并参加复试。<br />若成功将直接锁定研究生结局，若失败将承受一次巨大的压力打击。是否继续？
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setConfirmTier(null)} style={{ flex: 1, padding: '14px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                再准备一下
                            </button>
                            <button onClick={() => { startInterview(confirmTier); setConfirmTier(null); }} style={{ flex: 1, padding: '14px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                确认提交
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
