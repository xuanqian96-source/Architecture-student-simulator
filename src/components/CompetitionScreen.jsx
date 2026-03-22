import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { competitions, judgeCompetition } from '../data/competitions';
import { useIsMobile } from '../hooks/useIsMobile';

export default function CompetitionScreen() {
    const { state, dispatch } = useGame();
    const isMobile = useIsMobile();
    const [selectedComp, setSelectedComp] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [result, setResult] = useState(null);

    const unsubmittedProjects = state.portfolio.filter(p => !p.is_submitted);
    const submittedProjects = state.portfolio.filter(p => p.is_submitted);

    const handleClose = () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });
    };

    const handleSubmit = () => {
        if (!selectedComp || !selectedProject) return;

        const projName = selectedProject.title || selectedProject.name;
        const judgeRes = judgeCompetition(selectedProject.qualityScore, selectedComp);
        setResult(judgeRes);

        // 标记作品已提交 + 存储投递记录
        selectedProject.is_submitted = true;
        selectedProject.submissionRecord = {
            compName: selectedComp.name,
            won: judgeRes.won,
            awardLabel: judgeRes.won ? judgeRes.award.label : null,
            prize: judgeRes.won ? judgeRes.award.prize : 0,
        };

        if (judgeRes.won) {
            dispatch({
                type: 'APPLY_CUSTOM_EFFECTS',
                payload: {
                    effects: { money: judgeRes.award.prize, stress: -10 },
                    narrative: `你在【${selectedComp.name}】中凭借作品《${projName}》荣获 ${judgeRes.award.label}！获得奖金 ¥${judgeRes.award.prize}。`,
                    logMessage: `🏆 竞赛获奖: 奖金+¥${judgeRes.award.prize}, 压力-10`
                }
            });
        } else {
            dispatch({
                type: 'APPLY_CUSTOM_EFFECTS',
                payload: {
                    effects: { stress: 15 },
                    narrative: `很遗憾，你在【${selectedComp.name}】中投递的作品《${projName}》未能获奖。`,
                    logMessage: `🥀 竞赛落榜: 压力+15`
                }
            });
        }
    };

    if (result) {
        return (
            <div className="screen-container" style={{ padding: '40px', background: '#F8FAFC' }}>
                <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '40px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                    <div style={{ fontSize: '64px', marginBottom: '20px' }}>{result.won ? selectedComp.icon : '🥀'}</div>
                    <h2 style={{ fontSize: '28px', color: '#1E293B', marginBottom: '16px' }}>
                        {result.won ? '🎉 恭喜获奖！' : '落榜通知'}
                    </h2>
                    <p style={{ fontSize: '18px', color: '#475569', lineHeight: '1.6', marginBottom: '32px' }}>
                        {result.won ?
                            `你在【${selectedComp.name}】中脱颖而出，荣获 ${result.award.label}！奖金 ¥${result.award.prize} 已发放到账。` :
                            `你的作品在【${selectedComp.name}】的首轮筛选中被淘汰。别灰心，建筑之旅充满挫折。`}
                    </p>
                    <button
                        onClick={handleClose}
                        style={{
                            background: result.won ? '#10B981' : '#64748B',
                            color: 'white', padding: '16px 48px', border: 'none', borderRadius: '12px',
                            fontSize: '18px', fontWeight: 'bold', cursor: 'pointer'
                        }}
                    >
                        返回工作室
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="screen-container" style={{ padding: isMobile ? '12px' : '40px', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isMobile ? '16px' : '24px' }}>
                <h1 style={{ fontSize: isMobile ? '20px' : '28px', color: '#1E293B', margin: 0 }}>🏆 竞赛作品投递</h1>
                <button onClick={handleClose} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>✖</button>
            </div>

            <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '12px' : '24px', flex: 1, minHeight: 0 }}>
                {/* 竞赛列表 */}
                <div style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '24px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#334155' }}>选择赛事</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {competitions.map(comp => {
                            let available = true;
                            let limitMsg = '';
                            const hasNoProjects = unsubmittedProjects.length === 0;

                            if (hasNoProjects) {
                                available = false;
                                limitMsg = '作品集中暂无可用作品，请完成课题后参加评图';
                            } else if (state.progress.year < comp.yearRange[0] || state.progress.year > comp.yearRange[1]) {
                                available = false;
                                limitMsg = `赛事仅面向大${comp.yearRange[0]}至大${comp.yearRange[1]}学生`;
                            } else if (comp.skillRequirement?.software && state.attributes.software < comp.skillRequirement.software) {
                                available = false;
                                limitMsg = `需要软件基础 ≥ ${comp.skillRequirement.software}`;
                            }

                            const minQuality = Math.min(...comp.awards.map(a => a.qualityThreshold));

                            return (
                                <div
                                    key={comp.id}
                                    onClick={() => available && setSelectedComp(comp)}
                                    style={{
                                        padding: '16px', borderRadius: '12px', border: `2px solid ${selectedComp?.id === comp.id ? '#3B82F6' : '#E2E8F0'}`,
                                        background: selectedComp?.id === comp.id ? '#EFF6FF' : 'white',
                                        cursor: available ? 'pointer' : 'not-allowed', transition: 'all 0.2s', opacity: available ? 1 : 0.6
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '24px', filter: available ? 'none' : 'grayscale(1)' }}>{comp.icon}</span>
                                        <span style={{ fontWeight: 'bold', fontSize: '16px', color: '#1E293B' }}>{comp.name}</span>
                                        {!available && <span style={{ fontSize: '12px', color: '#EF4444', marginLeft: 'auto', fontWeight: 'bold' }}>{hasNoProjects ? '无作品' : '未解锁'}</span>}
                                    </div>
                                    <div style={{ fontSize: '13px', color: available ? '#64748B' : '#EF4444', marginBottom: '8px' }}>
                                        {limitMsg || `允许投递: 大${comp.yearRange[0]}至大${comp.yearRange[1]}`}
                                    </div>
                                    <div style={{ padding: '8px', background: 'rgba(0,0,0,0.02)', borderRadius: '6px', fontSize: '12px', color: '#64748B' }}>
                                        <div style={{ marginBottom: '4px' }}><strong>硬性门槛:</strong> 至少一件未参赛作品{comp.skillRequirement?.software ? `、软件能力 ≥ ${comp.skillRequirement.software}` : ''}</div>
                                        <div><strong>推荐质量:</strong> 至少 {minQuality} 分方有可能获奖</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 右侧面板：待投递 + 已投递 */}
                <div style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '8px', color: '#334155' }}>选择待投递作品</h3>

                    <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                        提示：需从你的个人作品集中选择至少一份未参赛的作品才能进行投递哦。
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', minHeight: 0 }}>
                        {unsubmittedProjects.length === 0 ? (
                            <div style={{ padding: '24px', textAlign: 'center', background: '#F8FAFC', borderRadius: '12px', color: '#94A3B8', border: '1px dashed #CBD5E1' }}>
                                空空如也。请先通过期末评图将优异作品存入个人作品集吧！
                            </div>
                        ) : (
                            unsubmittedProjects.map(proj => (
                                <div
                                    key={proj.id || proj.title || proj.name}
                                    onClick={() => setSelectedProject(proj)}
                                    style={{
                                        padding: '14px', borderRadius: '10px',
                                        border: `2px solid ${selectedProject?.id === proj.id ? '#10B981' : '#E2E8F0'}`,
                                        background: selectedProject?.id === proj.id ? '#F0FDF4' : 'white',
                                        cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: '#1E293B', marginBottom: '4px' }}>《{proj.title || proj.name}》</div>
                                    <div style={{ fontSize: '13px', color: '#64748B' }}>质量分: {proj.qualityScore} · {proj.grade}级</div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* 投递按钮 */}
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedComp || !selectedProject}
                        style={{
                            background: (!selectedComp || !selectedProject) ? '#CBD5E1' : '#3B82F6',
                            color: 'white', padding: '14px', border: 'none', borderRadius: '10px',
                            fontSize: '15px', fontWeight: 'bold', cursor: (!selectedComp || !selectedProject) ? 'not-allowed' : 'pointer',
                            width: '100%', marginBottom: '20px', flexShrink: 0
                        }}
                    >
                        {(!selectedComp || !selectedProject) ? (unsubmittedProjects.length === 0 ? '暂无可用作品' : '请先选择赛事与作品') : '确认投递'}
                    </button>

                    {/* 已投递作品记录 */}
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '16px', flexShrink: 0 }}>
                        <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#64748B' }}>📚 已投递作品记录</h4>
                        {submittedProjects.length === 0 ? (
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontStyle: 'italic' }}>暂无投递记录</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                                {submittedProjects.map((proj, i) => (
                                    <div key={i} style={{ padding: '8px 12px', borderRadius: '8px', background: proj.submissionRecord?.won ? '#F0FDF4' : '#FEF2F2', fontSize: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ color: '#334155' }}>《{proj.title || proj.name}》→ {proj.submissionRecord?.compName || '未知'}</span>
                                        <span style={{ fontWeight: '700', color: proj.submissionRecord?.won ? '#059669' : '#DC2626' }}>
                                            {proj.submissionRecord?.won ? `${proj.submissionRecord.awardLabel} ¥${proj.submissionRecord.prize}` : '🥀 未获奖'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
