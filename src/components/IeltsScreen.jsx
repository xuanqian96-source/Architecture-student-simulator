import React, { useState, useEffect } from 'react';
import { useGame } from '../logic/gameState';
import { IELTS_COST, drawIeltsQuestions, calculateIeltsScore } from '../data/overseas';

export default function IeltsScreen({ onClose }) {
    const { state, dispatch } = useGame();
    const [phase, setPhase] = useState('intro'); // intro, exam, result
    const [questions, setQuestions] = useState([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [finalScore, setFinalScore] = useState(0);

    const checkEligibility = () => {
        if (state.attributes.money < IELTS_COST) return '钱不够';
        return 'ok';
    };

    const eligibility = checkEligibility();
    const alreadyTakenThisYear = state.ieltsYearTaken === state.progress.year && state.ieltsYearTaken > 0;

    const startExam = () => {
        if (eligibility !== 'ok' || alreadyTakenThisYear) return;

        // 扣除报名费
        dispatch({
            type: 'APPLY_CUSTOM_EFFECTS',
            payload: {
                effects: { stress: 10, money: -IELTS_COST },
                narrative: `你咬牙支付了 ¥${IELTS_COST} 的雅思报名费。巨大的经济压力转化为学习的动力，但同时也让你更焦虑了。`,
                logMessage: `📝 报考雅思: 报名费-¥${IELTS_COST}, 压力+10`
            }
        });

        setQuestions(drawIeltsQuestions());
        setCurrentQIndex(0);
        setCorrectCount(0);
        setPhase('exam');
    };

    const handleAnswer = (selectedIndex) => {
        const q = questions[currentQIndex];
        const isCorrect = selectedIndex === q.answer;

        const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;
        setCorrectCount(newCorrectCount);

        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(currentQIndex + 1);
        } else {
            // 考试结束
            const score = calculateIeltsScore(newCorrectCount);
            setFinalScore(score);

            // 更新最高分记录
            dispatch({
                type: 'UPDATE_IELTS',
                payload: { newScore: score }
            });

            setPhase('result');
        }
    };

    if (phase === 'exam') {
        const q = questions[currentQIndex];
        return (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontWeight: 'bold', marginBottom: '24px' }}>
                        <span style={{ color: '#3B82F6' }}>🇬🇧 IELTS Academic</span>
                        <span>Question {currentQIndex + 1} / 10</span>
                    </div>

                    <h2 style={{ fontSize: '24px', color: '#1E293B', lineHeight: '1.5', marginBottom: '32px' }}>
                        {q.question}
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {q.options.map((opt, i) => (
                            <button
                                key={i}
                                onClick={() => handleAnswer(i)}
                                style={{
                                    padding: '20px', background: '#F8FAFC', border: '2px solid #E2E8F0',
                                    borderRadius: '12px', fontSize: '16px', color: '#334155', textAlign: 'left',
                                    cursor: 'pointer', transition: 'all 0.2s', fontWeight: '500'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.borderColor = '#3B82F6'; e.currentTarget.style.background = '#EFF6FF'; }}
                                onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E2E8F0'; e.currentTarget.style.background = '#F8FAFC'; }}
                            >
                                <span style={{ display: 'inline-block', width: '30px', fontWeight: 'bold', color: '#94A3B8' }}>{String.fromCharCode(65 + i)}.</span>
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (phase === 'result') {
        return (
            <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>📝</div>
                    <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '16px' }}>Test Report Form</h2>

                    <div style={{ background: '#F8FAFC', padding: '32px', borderRadius: '16px', marginBottom: '32px', border: '2px dashed #E2E8F0' }}>
                        <div style={{ fontSize: '16px', color: '#64748B', marginBottom: '8px' }}>Overall Band Score</div>
                        <div style={{ fontSize: '64px', fontWeight: '900', color: finalScore >= 6.5 ? '#10B981' : '#E11D48' }}>
                            {finalScore.toFixed(1)}
                        </div>
                        <div style={{ fontSize: '14px', color: '#94A3B8', marginTop: '16px' }}>
                            答对题目: {correctCount} / 10
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        style={{
                            background: '#1E293B', color: 'white', padding: '16px 48px', border: 'none', borderRadius: '12px',
                            fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', width: '100%'
                        }}
                    >
                        收起成绩单
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '90%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', position: 'relative' }}>
                <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#94A3B8' }}>✖</button>

                <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: '#3B82F6' }}>🇬🇧</span> 雅思考试中心
                </h2>

                <p style={{ fontSize: '16px', color: '#475569', lineHeight: '1.6', marginBottom: '32px' }}>
                    无论你是想去 GSD 还是 AA，一张体面的雅思成绩单都是必不可少的敲门砖。
                    <br /><br />
                    报名费：<strong style={{ color: '#3B82F6' }}>¥{IELTS_COST}</strong>
                    <br />
                    题数：10 道随堂测验题
                </p>

                {alreadyTakenThisYear && (
                    <div style={{ background: '#FFFBEB', color: '#B45309', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: 'bold', textAlign: 'center' }}>
                        ⚠️ 本学年已报考过雅思，每学年仅能参加一次。明年继续努力吧！
                    </div>
                )}
                {!alreadyTakenThisYear && eligibility !== 'ok' && (
                    <div style={{ background: '#FEF2F2', color: '#B91C1C', padding: '16px', borderRadius: '12px', marginBottom: '24px', fontWeight: 'bold', textAlign: 'center' }}>
                        金钱不足，无法缴纳报名费。
                    </div>
                )}

                <button
                    disabled={eligibility !== 'ok' || alreadyTakenThisYear}
                    onClick={startExam}
                    style={{
                        background: (eligibility === 'ok' && !alreadyTakenThisYear) ? '#3B82F6' : '#CBD5E1', color: 'white', padding: '16px 48px', border: 'none', borderRadius: '12px',
                        fontSize: '18px', fontWeight: 'bold', cursor: (eligibility === 'ok' && !alreadyTakenThisYear) ? 'pointer' : 'not-allowed', width: '100%'
                    }}
                >
                    {alreadyTakenThisYear ? '本年度已报考，明年再来' : '确认缴费并报考'}
                </button>
            </div>
        </div>
    );
}
