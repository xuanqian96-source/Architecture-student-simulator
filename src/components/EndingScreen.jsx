// 结局界面

import React from 'react';
import { useGame } from '../logic/gameState';
import { saveEndingRecord } from '../data/endings';

export default function EndingScreen() {
    const { state, dispatch } = useGame();
    const { ending } = state.ui;

    // 当最终展示结局时持久化记录徽章
    React.useEffect(() => {
        if (ending && ending.id) {
            saveEndingRecord(ending.id);
        }
    }, [ending]);

    if (!ending) return null;

    const handleHardRestart = () => {
        window.location.reload();
    };

    const handleNewLife = () => {
        // 轻量级状态清零，回到抽选导师前主界面
        dispatch({ type: 'HARD_RESET_GAME' });
    };

    const getEndingStyle = (id) => {
        // S级结局 (金色/史诗炫酷特效)
        if (['postgrad_s', 'abroad_s', 'job_s'].includes(id)) {
            return {
                background: 'linear-gradient(135deg, #451a03 0%, #78350f 50%, #b45309 100%)',
                boxShadow: 'inset 0 0 120px rgba(245, 158, 11, 0.6)'
            };
        }
        // A级/优异结局 (蓝紫高科技)
        if (['job_a', 'pivot_tech', 'pivot_game', 'civil_success'].includes(id)) {
            return {
                background: 'linear-gradient(135deg, #1e3a8a 0%, #312e81 50%, #4c1d95 100%)',
                boxShadow: 'inset 0 0 80px rgba(99, 102, 241, 0.4)'
            };
        }
        // B级结局 (墨绿/良好)
        if (['postgrad_a_b', 'abroad_a_b', 'job_b', 'pivot_media'].includes(id)) {
            return {
                background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f766e 100%)',
                boxShadow: 'inset 0 0 60px rgba(16, 185, 129, 0.2)'
            };
        }
        // 失败/惩罚结局 (暗红警示深渊)
        if (['civil_fail', 'abroad_fail', 'postgrad_fail', 'failure_stress', 'failure_warning'].includes(id)) {
            return {
                background: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 50%, #b91c1c 100%)',
                boxShadow: 'inset 0 0 100px rgba(220, 38, 38, 0.5)'
            };
        }
        // C/D级普通结局 (灰暗平庸)
        return {
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
            boxShadow: 'none'
        };
    };

    return (
        <div className="ending-screen" style={getEndingStyle(ending.id)}>
            <div className="ending-content">
                <div className="ending-emoji">{ending.image}</div>
                <h1 className="ending-title">{ending.name}</h1>

                {ending.triggerCondition && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#FECACA',
                        padding: '14px 20px',
                        borderRadius: '10px',
                        marginBottom: '24px',
                        fontSize: '15px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        📌 触发原因：{ending.triggerCondition}
                    </div>
                )}

                <p className="ending-description">{ending.description}</p>

                <div style={{
                    marginBottom: '32px',
                    padding: '24px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '14px', marginBottom: '8px', color: '#94A3B8' }}>最终数据结算表</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', lineHeight: '1.8', color: '#CBD5E1' }}>
                        设计能力: <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.floor(state.attributes.design)}</span><br />
                        软件能力: <span style={{ color: 'white', fontWeight: 'bold' }}>{Math.floor(state.attributes.software)}</span><br />
                        作品集荣誉分: <span style={{ color: 'white', fontWeight: 'bold' }}>{state.portfolio.reduce((s, p) => s + (p.qualityScore || 0), 0)}</span><br />
                        雅思最高分: <span style={{ color: 'white', fontWeight: 'bold' }}>{state.bestIelts > 0 ? state.bestIelts.toFixed(1) : '未参加'}</span><br />
                        实习经历: <span style={{ color: 'white', fontWeight: 'bold' }}>{(state.internHistory || []).length} 段</span><br />
                        最终耗时: <span style={{ color: 'white', fontWeight: 'bold' }}>{state.progress.totalWeeks} / 60 周</span><br />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <button className="restart-button" onClick={handleNewLife} style={{
                        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
                        boxShadow: '0 8px 20px rgba(59, 130, 246, 0.4)'
                    }}>
                        ✨ 重新开始新人生
                    </button>

                </div>
            </div>
        </div>
    );
}
