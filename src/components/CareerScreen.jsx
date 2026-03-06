import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { careerPaths, canApplyJob, internships, INTERN_WEEKLY_STRESS, canIntern } from '../data/employment';
import { endings } from '../data/endings';
import ResumeModal from './ResumeModal';

export default function CareerScreen() {
    const { state, dispatch } = useGame();
    const [path, setPath] = useState(state.progress.year < 5 ? 'internship' : 'architecture');
    const [showResume, setShowResume] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const hasInternedThisYear = !!state.currentIntern;

    function getPortfolioScore(portfolio) {
        return portfolio.reduce((sum, p) => sum + (p.qualityScore || 0), 0);
    }

    const handleClose = () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });
    };

    const handleApplyJob = (job) => {
        let endingId;

        if (job.id === 'job_s') endingId = 'job_s';
        else if (job.id.startsWith('job_a')) endingId = 'job_a';
        else if (job.id === 'job_b') endingId = 'job_b';
        else if (job.id === 'job_c') endingId = 'job_c';
        else if (job.id === 'job_game') endingId = 'pivot_game';
        else if (job.id === 'job_pm') endingId = 'pivot_pm';
        else if (job.id === 'job_freelance') endingId = 'pivot_freelance';

        dispatch({
            type: 'TRIGGER_ENDING',
            payload: { ending: endings[endingId] }
        });
    };

    const handleTakeIntern = (intern) => {
        dispatch({
            type: 'RECORD_INTERN',
            payload: { internId: intern.id, stressPenalty: INTERN_WEEKLY_STRESS, year: state.progress.year }
        });
    };

    const jobs = path === 'internship' ? [] : careerPaths[path];

    return (
        <div className="screen-container" style={{ padding: '40px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '28px', color: '#1E293B', margin: '0 0 8px 0' }}>
                        {path === 'internship' ? '✨ 实习僧招聘网' : '🐶 建筑狗招聘网'}
                    </h1>
                    <p style={{ color: '#64748B', margin: 0, lineHeight: '1.6' }}>
                        {path === 'internship' ? (
                            <>
                                大一到大四的试错专区。找到心仪的实习能为你积攒人脉和履历。<br />
                                注：参与实习会在对应学年<strong style={{ color: '#E11D48' }}>每周带来固定的压力增长</strong>，请注意劳逸结合！
                            </>
                        ) : (
                            <>
                                大五秋招正式开启，这是决定你未来命运的重要时刻！<br />
                                (注：投递通过后将直接<strong style={{ color: '#E11D48' }}>触发结局终结游戏</strong>，请三思而后行)
                            </>
                        )}
                    </p>
                </div>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            </div>

            {/* 路径切换 + 简历按钮 */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
                <button
                    disabled={state.progress.year >= 5}
                    onClick={() => setPath('internship')}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: state.progress.year >= 5 ? 'not-allowed' : 'pointer', background: path === 'internship' ? '#10B981' : '#E2E8F0', color: path === 'internship' ? 'white' : '#64748B', transition: 'all 0.2s', opacity: state.progress.year >= 5 ? 0.5 : 1 }}
                >
                    寻找实习机会 {state.progress.year >= 5 && '(秋招期关闭)'}
                </button>
                <button
                    disabled={state.progress.year < 5}
                    onClick={() => setPath('architecture')}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: state.progress.year < 5 ? 'not-allowed' : 'pointer', background: path === 'architecture' ? '#3B82F6' : '#E2E8F0', color: path === 'architecture' ? 'white' : '#64748B', transition: 'all 0.2s', opacity: state.progress.year < 5 ? 0.5 : 1 }}
                >
                    坚守建筑本行 {state.progress.year < 5 && '(大五开启)'}
                </button>
                <button
                    disabled={state.progress.year < 5}
                    onClick={() => setPath('pivot')}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: state.progress.year < 5 ? 'not-allowed' : 'pointer', background: path === 'pivot' ? '#8B5CF6' : '#E2E8F0', color: path === 'pivot' ? 'white' : '#64748B', transition: 'all 0.2s', opacity: state.progress.year < 5 ? 0.5 : 1 }}
                >
                    毅然转行跑路 {state.progress.year < 5 && '(大五开启)'}
                </button>
                <button
                    onClick={() => setShowResume(true)}
                    style={{ padding: '16px 20px', borderRadius: '12px', border: '2px solid #E2E8F0', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', background: 'white', color: '#475569', transition: 'all 0.2s', whiteSpace: 'nowrap' }}
                >
                    📄 我的简历
                </button>
            </div>

            {/* 入职印章 */}
            {hasInternedThisYear && path === 'internship' && (
                <div style={{ position: 'relative', padding: '20px', background: '#FFF7ED', borderRadius: '16px', marginBottom: '24px', border: '2px solid #FDBA74', textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block',
                        border: '4px solid #DC2626',
                        borderRadius: '12px',
                        padding: '8px 24px',
                        transform: 'rotate(-12deg)',
                        color: '#DC2626',
                        fontWeight: '900',
                        fontSize: '22px',
                        letterSpacing: '4px',
                        opacity: 0.85,
                        marginBottom: '12px',
                    }}>
                        已入职·{state.currentIntern?.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#9A3412', fontWeight: '600' }}>
                        本学年实习岗已确定，每周压力+{INTERN_WEEKLY_STRESS}。下一学年可重新选择。
                    </div>
                </div>
            )}

            {/* ResumeModal */}
            {showResume && <ResumeModal onClose={() => setShowResume(false)} />}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', overflowY: 'auto' }}>
                {path === 'internship' ? internships.map(intern => {
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

                            <button
                                disabled={!isEligible || hasInternedThisYear}
                                onClick={() => handleTakeIntern(intern)}
                                style={{
                                    background: isEligible && !hasInternedThisYear ? (isArch ? '#3B82F6' : '#8B5CF6') : '#CBD5E1',
                                    color: 'white', border: 'none', padding: '12px', borderRadius: '8px',
                                    fontWeight: 'bold', cursor: (isEligible && !hasInternedThisYear) ? 'pointer' : 'not-allowed', width: '100%'
                                }}
                            >
                                {isEligible ? '投递简历并入职' : '能力不匹配'}
                            </button>
                        </div>
                    );
                }) : jobs.map(job => {
                    const isEligible = canApplyJob(job, state);

                    return (
                        <div key={job.id} style={{
                            background: 'white', borderRadius: '16px', padding: '24px', position: 'relative',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', border: `2px solid ${isEligible ? '#60A5FA' : '#E2E8F0'}`,
                            opacity: isEligible ? 1 : 0.6, display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#F1F5F9', color: '#64748B', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
                                Tier {job.tier}
                            </div>

                            <div style={{ fontSize: '48px', marginBottom: '16px' }}>{job.icon}</div>
                            <h3 style={{ margin: '0 0 4px 0', fontSize: '20px', color: '#1E293B' }}>{job.name}</h3>
                            <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px', fontWeight: 'bold' }}>{job.firms}</div>

                            <div style={{ fontSize: '16px', color: '#10B981', fontWeight: '900', marginBottom: '16px' }}>
                                薪资：¥{job.salary}/月
                            </div>

                            <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5', flex: 1, minHeight: '60px' }}>{job.description}</p>

                            <div style={{ background: '#F8FAFC', padding: '12px', borderRadius: '8px', marginTop: '16px', marginBottom: '24px' }}>
                                <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '4px', fontWeight: 'bold' }}>录用门槛：</div>
                                {job.requirements.design && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>设计能力:</span><span style={{ color: state.attributes.design >= job.requirements.design ? '#10B981' : '#EF4444' }}>≥ {job.requirements.design}</span></div>}
                                {job.requirements.software && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>软件能力:</span><span style={{ color: state.attributes.software >= job.requirements.software ? '#10B981' : '#EF4444' }}>≥ {job.requirements.software}</span></div>}
                                {job.requirements.ps && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>作品集评分:</span><span style={{ color: getPortfolioScore(state.portfolio) >= job.requirements.ps ? '#10B981' : '#EF4444' }}>≥ {job.requirements.ps}</span></div>}
                                {job.requirements.ielts && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>雅思成绩:</span><span style={{ color: (state.bestIelts || 0) >= job.requirements.ielts ? '#10B981' : '#EF4444' }}>≥ {job.requirements.ielts}</span></div>}
                                {job.requirements.schoolTier && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>学历要求:</span><span style={{ color: job.requirements.schoolTier.includes(state.identity?.school?.id) ? '#10B981' : '#EF4444' }}>{job.requirements.schoolTier.includes('elite') ? '985/211或新八校' : '符合要求'}</span></div>}
                                {job.requirements.internType && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>经历要求:</span><span style={{ color: (state.internHistory || []).some(i => (i.id || i) === job.requirements.internType) ? '#10B981' : '#EF4444' }}>特定名企实习</span></div>}
                                {job.requirements.internCount && <div style={{ fontSize: '12px', display: 'flex', justifyContent: 'space-between' }}><span>经历要求:</span><span style={{ color: (state.internHistory || []).filter(i => (i.id || i) === job.requirements.internCount.type).length >= job.requirements.internCount.min ? '#10B981' : '#EF4444' }}>相关实习 ≥ {job.requirements.internCount.min}次</span></div>}
                            </div>

                            <button
                                disabled={!isEligible}
                                onClick={() => setSelectedJob(job)}
                                style={{
                                    background: isEligible ? '#1E293B' : '#CBD5E1', color: 'white', border: 'none', padding: '14px', borderRadius: '12px',
                                    fontWeight: 'bold', cursor: isEligible ? 'pointer' : 'not-allowed', width: '100%', fontSize: '16px', marginTop: '16px'
                                }}
                            >
                                {isEligible ? '投递并入职 (结算结局)' : '未达录取门槛'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* 求职确认模态框 */}
            {selectedJob && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        background: 'white',
                        padding: '40px',
                        borderRadius: '24px',
                        maxWidth: '500px',
                        width: '90%',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📝</div>
                        <h2 style={{ margin: '0 0 16px 0', color: '#1E293B', fontSize: '24px' }}>
                            确认投递简历并入职吗？
                        </h2>
                        <div style={{ background: '#F8FAFC', padding: '20px', borderRadius: '16px', marginBottom: '24px', textAlign: 'left' }}>
                            <p style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '15px', lineHeight: '1.6' }}>
                                你即将应聘<strong style={{ color: '#0F172A' }}>【{selectedJob.name}】</strong>的岗位。
                            </p>
                            <p style={{ margin: 0, color: '#DC2626', fontSize: '14px', fontWeight: 'bold' }}>
                                ⚠️ 注意：接受Offer将立刻结束你五年的学生生涯，进行游戏最终结算，不可撤销。
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '16px' }}>
                            <button
                                onClick={() => setSelectedJob(null)}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                                    background: '#F1F5F9', color: '#64748B', fontSize: '16px',
                                    fontWeight: 'bold', cursor: 'pointer'
                                }}
                            >
                                我再想想
                            </button>
                            <button
                                onClick={() => handleApplyJob(selectedJob)}
                                style={{
                                    flex: 1, padding: '14px', borderRadius: '12px', border: 'none',
                                    background: '#3B82F6', color: 'white', fontSize: '16px', // 蓝色更积极
                                    fontWeight: 'bold', cursor: 'pointer',
                                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.3)'
                                }}
                            >
                                确认入职
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
