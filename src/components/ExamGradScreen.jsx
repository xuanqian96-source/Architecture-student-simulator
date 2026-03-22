import React, { useState, useEffect } from 'react';
import { useGame } from '../logic/gameState';
import { examGradTiers, drawExamGradQuestions, calculateExamGradScore } from '../data/examGrad';
import { endings } from '../data/endings';
import { useIsMobile } from '../hooks/useIsMobile';

export default function ExamGradScreen() {
    const { state, dispatch } = useGame();
    const isMobile = useIsMobile();
    const [phase, setPhase] = useState('select');
    const [selectedTier, setSelectedTier] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);

    const [timeLeft, setTimeLeft] = useState(60);
    const [finalScore, setFinalScore] = useState(0);
    const [confirmTier, setConfirmTier] = useState(null);

    // 能否参加：只要是大五
    const canApply = state.progress.year >= 5;

    const handleClose = () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });
    };

    const startExam = (tier) => {
        setSelectedTier(tier);
        setQuestions(drawExamGradQuestions());
        setCurrentQIndex(0);
        setCorrectCount(0);
        setTimeLeft(60);
        setPhase('exam');
    };

    const finishExam = (corrects) => {
        const score = calculateExamGradScore(corrects, state.attributes.design);
        setFinalScore(score);
        setPhase('result');
    };

    useEffect(() => {
        let timer;
        if (phase === 'exam' && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (phase === 'exam' && timeLeft <= 0) {
            // 时间到强制交卷
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

        let endingId;
        if (isPassed) {
            endingId = selectedTier.tier === 'A' ? 'grad_s' : 'grad_a_b';
        } else {
            endingId = 'grad_fail';
        }

        dispatch({
            type: 'TRIGGER_ENDING',
            payload: { ending: endings[endingId] }
        });
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
                        <div style={{ color: '#64748B', fontWeight: 'bold' }}>题目 {currentQIndex + 1} / 5</div>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: timeLeft <= 10 ? '#E11D48' : '#10B981' }}>
                            ⏰ {timeLeft}s
                        </div>
                    </div>

                    <h2 style={{ fontSize: '20px', color: '#1E293B', lineHeight: '1.5', marginBottom: '32px' }}>
                        {q.question}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '10px' : '16px' }}>
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                style={{
                                    padding: '20px', background: '#F8FAFC', border: '2px solid #E2E8F0',
                                    borderRadius: '12px', fontSize: '15px', color: '#334155', textAlign: 'left',
                                    cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#EFF6FF'; }}
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
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{isPassed ? '🎉' : '🥀'}</div>
                    <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '16px' }}>
                        {isPassed ? '初试拟录取通知' : '考研初试落榜'}
                    </h2>

                    <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '16px', marginBottom: '32px' }}>
                        <div style={{ fontSize: '16px', color: '#64748B', marginBottom: '8px' }}>初试总分预估</div>
                        <div style={{ fontSize: '48px', fontWeight: '900', color: isPassed ? '#10B981' : '#EF4444' }}>
                            {finalScore} <span style={{ fontSize: '20px', color: '#94A3B8' }}>/ 500</span>
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748B', marginTop: '12px' }}>
                            目标院校分数线：{selectedTier.passScore} 分<br />
                            <span style={{ fontSize: '12px' }}>(包含设计技能加分补偿)</span>
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
        <div className="screen-container" style={{ padding: isMobile ? '12px' : '40px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', margin: '0 0 8px 0' }}>📚 研究生统一考试报名</h1>
                    <p style={{ color: '#64748B', margin: 0 }}>你的设计能力将按比例转化为快题加分。选好目标，没有退路。</p>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: isMobile ? '12px' : '24px', flex: 1, minHeight: 0 }}>
                {examGradTiers.map(tier => (
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
                        <div style={{ textAlign: 'center', color: '#64748B', fontSize: '14px', fontWeight: 'bold', marginBottom: '16px' }}>
                            难度：{tier.difficulty}
                        </div>
                        <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', flex: 1 }}>{tier.description}</p>

                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', marginTop: '16px', marginBottom: '24px', textAlign: 'center' }}>
                            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px' }}>预估分数线</div>
                            <div style={{ color: '#1E293B', fontWeight: '900', fontSize: '24px' }}>{tier.passScore} 分</div>
                        </div>

                        <button
                            disabled={!canApply}
                            onClick={() => setConfirmTier(tier)}
                            style={{
                                background: canApply ? '#3B82F6' : '#CBD5E1', color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
                                fontWeight: 'bold', cursor: canApply ? 'pointer' : 'not-allowed', width: '100%', fontSize: '16px'
                            }}
                        >
                            {!canApply ? '大五招考开放' : '报考并开始初试 (60秒)'}
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
                            确定报考【{confirmTier.name}】吗？<br />一旦开考将直接判定毕业结局。
                        </p>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button onClick={() => setConfirmTier(null)} style={{ flex: 1, padding: '14px', background: '#F1F5F9', color: '#475569', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                取消
                            </button>
                            <button onClick={() => { startExam(confirmTier); setConfirmTier(null); }} style={{ flex: 1, padding: '14px', background: '#3B82F6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                                确认赴考
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
