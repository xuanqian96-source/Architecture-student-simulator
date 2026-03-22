import React from 'react';
import { useGame } from '../logic/gameState';
import { saveEndingRecord, getEndingRecord, getEndingCounts } from '../data/endings';
import { checkEndingAchievements } from '../data/achievements';
import { calculateTotalScore } from '../utils/scoreCalculator';
import SaveManager from '../utils/saveManager';
import { useIsMobile } from '../hooks/useIsMobile';

export default function EndingScreen() {
    const { state, dispatch } = useGame();
    const isMobile = useIsMobile();
    const { ending } = state.ui;

    // 当最终展示结局时持久化记录徽章 + 检测成就 + 自动同步积分
    React.useEffect(() => {
        if (ending && ending.id) {
            saveEndingRecord(ending.id);
            // 成就检测（在 saveEndingRecord 之后执行，确保 counts 已更新）
            const unlockedIds = getEndingRecord();
            const counts = getEndingCounts();
            checkEndingAchievements(ending.id, ending.type, state, unlockedIds, counts);

            // ===== 自动同步积分到排行榜 =====
            const playerName = SaveManager.getPlayerName();
            if (playerName) {
                const { totalScore } = calculateTotalScore();
                if (totalScore > 0) {
                    SaveManager.updateScore(playerName, totalScore).catch(() => {});
                }
            }
        }
    }, [ending]);

    if (!ending) return null;

    const handleHardRestart = () => {
        window.location.reload();
    };

    const handleNewLife = () => {
        // 清除云端游戏进程存档（保留玩家名和积分）
        const pn = SaveManager.getPlayerName();
        if (pn) SaveManager.clearSave(pn);
        // 轻量级状态清零，回到抽选导师前主界面
        dispatch({ type: 'HARD_RESET_GAME' });
    };

    const getEndingStyle = (endingType) => {
        // S级结局 (金色/史诗炫酷特效)
        if (endingType === 'S') {
            return {
                background: 'linear-gradient(135deg, #78350f 0%, #d97706 50%, #f59e0b 100%)',
                boxShadow: 'inset 0 0 150px rgba(245, 158, 11, 0.4)'
            };
        }
        // A级结局 (蓝紫高科技)
        if (endingType === 'A') {
            return {
                background: 'linear-gradient(135deg, #1e3a8a 0%, #4338ca 50%, #6366f1 100%)',
                boxShadow: 'inset 0 0 100px rgba(99, 102, 241, 0.3)'
            };
        }
        // B级结局 (墨绿生机)
        if (endingType === 'B') {
            return {
                background: 'linear-gradient(135deg, #064e3b 0%, #047857 50%, #10b981 100%)',
                boxShadow: 'inset 0 0 80px rgba(16, 185, 129, 0.2)'
            };
        }
        // FAIL/失败/惩罚结局 (暗红警示)
        if (endingType === 'FAIL') {
            return {
                background: 'linear-gradient(135deg, #450a0a 0%, #991b1b 50%, #ef4444 100%)',
                boxShadow: 'inset 0 0 120px rgba(239, 68, 68, 0.4)'
            };
        }
        // 其它/默认 (质感灰)
        return {
            background: 'linear-gradient(135deg, #1f2937 0%, #374151 50%, #4b5563 100%)',
            boxShadow: 'none'
        };
    };

    return (
        <div className="ending-screen" style={getEndingStyle(ending.type)}>
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
                    marginBottom: isMobile ? '20px' : '32px',
                    padding: isMobile ? '14px' : '24px',
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
