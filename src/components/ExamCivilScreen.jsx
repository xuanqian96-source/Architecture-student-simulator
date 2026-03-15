import React, { useState, useEffect } from 'react';
import { useGame } from '../logic/gameState';
import { civilTiers, drawCivilQuestions, calculateCivilScore } from '../data/examCivil';
import { endings } from '../data/endings';

export default function ExamCivilScreen() {
    const { state, dispatch } = useGame();
    const [phase, setPhase] = useState('select');
    const [selectedTier, setSelectedTier] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [timeLeft, setTimeLeft] = useState(60);
    const [finalScore, setFinalScore] = useState(0);
    const [confirmTier, setConfirmTier] = useState(null); // 用于自定义确认框

    const canApply = state.progress.year >= 5;
    const handleClose = () => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });

    const startExam = (tier) => {
        setSelectedTier(tier);
        setQuestions(drawCivilQuestions()); // 10题
        setCurrentQIndex(0);
        setCorrectCount(0);
        setTimeLeft(90);
        setPhase('exam');
    };

    const finishExam = (corrects) => {
        const score = calculateCivilScore(corrects, state.attributes.software);
        setFinalScore(score);
        setPhase('result');
    };

    useEffect(() => {
        let timer;
        if (phase === 'exam' && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        } else if (phase === 'exam' && timeLeft <= 0) {
            finishExam(correctCount);
        }
        return () => clearInterval(timer);
        // eslint-disable-next-line
    }, [phase, timeLeft]);

    const handleAnswer = (selectedIndex) => {
        const q = questions[currentQIndex];
        const isCorrect = selectedIndex === q.answer;
        const newCorrects = isCorrect ? correctCount + 1 : correctCount;
        setCorrectCount(newCorrects);

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            finishExam(newCorrects);
        }
    };

    const handleApplyResult = () => {
        const isPassed = finalScore >= selectedTier.passScore;
        const endingId = isPassed ? 'civil_success' : 'civil_fail';

        dispatch({
            type: 'TRIGGER_ENDING',
            payload: { ending: endings[endingId] }
        });
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'ending' } });
    };

    if (!canApply && phase === 'select') {
        // 去除原本的全屏拦截，在后续渲染中利用 canApply 局部置灰
    }

    if (phase === 'exam') {
        const q = questions[currentQIndex];
        return (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '700px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ color: '#64748B', fontWeight: 'bold' }}>《行政能力测试》 {currentQIndex + 1} / 10</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: timeLeft <= 10 ? '#E11D48' : '#10B981' }}>
                            ⏰ {timeLeft}s
                        </div>
                    </div>

                    <h2 style={{ fontSize: '18px', color: '#1E293B', lineHeight: '1.6', marginBottom: '32px' }}>
                        {q.question}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                style={{
                                    padding: '16px', background: '#F8FAFC', border: '2px solid #E2E8F0',
                                    borderRadius: '12px', fontSize: '14px', color: '#334155', textAlign: 'left',
                                    cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#10B981'; e.currentTarget.style.background = '#ECFDF5'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
                            >
                                <span style={{ display: 'inline-block', width: '24px', fontWeight: 'bold', color: '#94A3B8' }}>{['A', 'B', 'C', 'D'][i]}</span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'result') {
        const isPassed = finalScore >= selectedTier.passScore;
        return (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{isPassed ? '🎊' : '🍂'}</div>
                    <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '16px' }}>
                        {isPassed ? '公考进入体检/政审环节' : '遗憾折戟'}
                    </h2>

                    <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                        <div style={{ fontSize: '16px', color: '#64748B', marginBottom: '8px' }}>行测折算总分</div>
                        <div style={{ fontSize: '48px', fontWeight: '900', color: isPassed ? '#10B981' : '#EF4444' }}>
                            {finalScore}
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748B', marginTop: '12px' }}>
                            岗位录用线：{selectedTier.passScore} 分<br />
                            <span style={{ fontSize: '12px' }}>(包含软件操作加分)</span>
                        </div>
                    </div>

                    <button
                        onClick={handleApplyResult}
                        style={{
                            background: '#1E293B', color: 'white', padding: '16px 48px', border: 'none', borderRadius: '12px',
                            fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%'
                        }}
                    >
                        读取结局
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen-container" style={{ padding: '40px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', margin: '0 0 8px 0' }}>🍵 公务员与选调生考试</h1>
                    <p style={{ color: '#64748B', margin: 0 }}>逃离内卷的最稳妥之途。软件操作熟练度转换为行测优势。</p>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', flex: 1, minHeight: 0 }}>
                {civilTiers.map(tier => (
                    <div
                        key={tier.id}
                        style={{
                            background: 'white', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `2px solid ${canApply ? '#E2E8F0' : '#F1F5F9'}`,
                            opacity: canApply ? 1 : 0.6, position: 'relative'
                        }}
                    >
                        {!canApply && (
                            <div style={{
                                position: 'absolute', top: '-10px', right: '-10px', background: '#EF4444', color: 'white',
                                fontSize: '12px', fontWeight: 'bold', padding: '4px 8px', borderRadius: '10px',
                                boxShadow: '0 2px 4px rgba(239,68,68,0.3)', zIndex: 10
                            }}>
                                锁定
                            </div>
                        )}
                        <div style={{ fontSize: '48px', marginBottom: '16px', textAlign: 'center' }}>{tier.icon}</div>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', color: '#1E293B', textAlign: 'center' }}>{tier.name}</h3>
                        <div style={{ textAlign: 'center', color: '#10B981', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>
                            层级：{tier.tier}
                        </div>
                        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', flex: 1 }}>{tier.description}</p>

                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginTop: '16px', marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>录用分数线</div>
                            <div style={{ color: '#1E293B', fontWeight: '900', fontSize: '24px' }}>{tier.passScore} 分</div>
                        </div>

                        <button
                            disabled={!canApply}
                            onClick={() => setConfirmTier(tier)}
                            style={{
                                background: canApply ? '#10B981' : '#CBD5E1', color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
                                fontWeight: 'bold', cursor: canApply ? 'pointer' : 'not-allowed', width: '100%', fontSize: '16px'
                            }}
                        >
                            {!canApply ? '大五开启报名' : '报考并开始笔试 (90秒)'}
                        </button>
                    </div>
                ))}
            </div>

            {/* 自定义确认弹窗 */}
            {confirmTier && (
                <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100 }}>
                    <div style={{ background: 'white', padding: '32px', borderRadius: '24px', width: '90%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📝</div>
                        <h3 style={{ fontSize: '22px', color: '#1E293B', marginBottom: '12px' }}>确认报考</h3>
                        <p style={{ fontSize: '15px', color: '#64748B', lineHeight: '1.6', marginBottom: '24px' }}>
                            你正在报考【{confirmTier.name}】。<br />考试一旦开始将消耗当周行动力，并且<b>无论结果如何都将直接进入毕业结局</b>。准备好了吗？
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setConfirmTier(null)} style={{ flex: 1, padding: '14px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                再想想
                            </button>
                            <button onClick={() => { startExam(confirmTier); setConfirmTier(null); }} style={{ flex: 1, padding: '14px', background: '#10B981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                确认赴考
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
