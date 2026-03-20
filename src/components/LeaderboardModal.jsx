import React, { useState, useEffect } from 'react';
import SaveManager from '../utils/saveManager';
import { calculateTotalScore } from '../utils/scoreCalculator';

export default function LeaderboardModal({ onClose }) {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [myScore, setMyScore] = useState(0);
    const [myRank, setMyRank] = useState(null);
    const playerName = SaveManager.getPlayerName();

    useEffect(() => {
        // 计算本地积分
        const { totalScore } = calculateTotalScore();
        setMyScore(totalScore);

        const fetchData = async () => {
            // 先自动同步积分到服务器（保留已有存档数据，只更新积分）
            if (playerName && totalScore > 0) {
                try {
                    const existing = await SaveManager.load(playerName);
                    const existingSaveData = (existing.success && existing.data?.saveData) ? existing.data.saveData : {};
                    await SaveManager.save(playerName, existingSaveData, totalScore);
                } catch (e) { /* 忽略同步失败 */ }
            }

            // 再获取排行榜
            const result = await SaveManager.getLeaderboard();
            if (result.success) {
                setLeaderboard(result.data);
                const idx = result.data.findIndex(p => p.playerName === playerName);
                if (idx >= 0) setMyRank(idx + 1);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    // 前三名特殊样式
    const getRankStyle = (rank) => {
        if (rank === 1) return {
            bg: 'linear-gradient(135deg, #F59E0B, #D97706)',
            glow: '0 4px 20px rgba(245,158,11,0.4)',
            icon: '🥇', color: '#FFFBEB',
            border: '2px solid #F59E0B'
        };
        if (rank === 2) return {
            bg: 'linear-gradient(135deg, #9CA3AF, #6B7280)',
            glow: '0 4px 16px rgba(156,163,175,0.35)',
            icon: '🥈', color: '#F9FAFB',
            border: '2px solid #9CA3AF'
        };
        if (rank === 3) return {
            bg: 'linear-gradient(135deg, #D97706, #92400E)',
            glow: '0 4px 16px rgba(217,119,6,0.3)',
            icon: '🥉', color: '#FFFBEB',
            border: '2px solid #D97706'
        };
        return {
            bg: rank % 2 === 0 ? '#F8FAFC' : 'white',
            glow: 'none', icon: null, color: '#334155',
            border: '1px solid #f1f5f9'
        };
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '20px'
        }}>
            <div style={{
                background: '#F8FAFC', borderRadius: '24px', width: '100%', maxWidth: '560px',
                height: '90vh', maxHeight: '800px',
                display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden'
            }}>
                {/* 顶部 */}
                <div style={{
                    padding: '24px 28px 20px', background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white', position: 'relative', flexShrink: 0
                }}>
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '16px', right: '16px',
                        background: 'rgba(255,255,255,0.2)', border: 'none', width: '32px', height: '32px',
                        borderRadius: '50%', color: 'white', fontWeight: 'bold', cursor: 'pointer',
                        fontSize: '14px'
                    }}>✕</button>

                    <h2 style={{ margin: '0 0 4px', fontSize: '22px', fontWeight: '900' }}>🏆 玩家排行榜</h2>
                    <p style={{ margin: 0, fontSize: '13px', opacity: 0.85 }}>全服积分排名 TOP 100</p>

                    {/* 玩家自身积分 */}
                    {playerName && (
                        <div style={{
                            marginTop: '16px', padding: '12px 16px',
                            background: 'rgba(255,255,255,0.15)', borderRadius: '12px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                        }}>
                            <div>
                                <div style={{ fontSize: '13px', opacity: 0.8 }}>我的排名</div>
                                <div style={{ fontSize: '20px', fontWeight: '900' }}>
                                    {myRank ? `第 ${myRank} 名` : '暂未上榜'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '13px', opacity: 0.8 }}>{playerName}</div>
                                <div style={{ fontSize: '24px', fontWeight: '900' }}>
                                    {myScore.toLocaleString()} <span style={{ fontSize: '13px', fontWeight: '400' }}>分</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* 列表区域 - 可滚动 */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 20px' }}>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: '15px' }}>
                            ⏳ 正在加载排行榜...
                        </div>
                    ) : leaderboard.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '40px 0', color: '#94A3B8', fontSize: '15px' }}>
                            暂无数据，快去创造你的建筑传奇吧！
                        </div>
                    ) : (
                        leaderboard.map((player, index) => {
                            const rank = player.rank;
                            const rs = getRankStyle(rank);
                            const isTop3 = rank <= 3;
                            const isMe = player.playerName === playerName;

                            return (
                                <div key={index} style={{
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: isTop3 ? '14px 16px' : '10px 16px',
                                    background: rs.bg, borderRadius: isTop3 ? '14px' : '8px',
                                    marginBottom: '6px', color: isTop3 ? rs.color : rs.color,
                                    boxShadow: rs.glow, border: isMe && !isTop3 ? '2px solid #667eea' : rs.border,
                                    transition: 'all 0.2s'
                                }}>
                                    {/* 排名 */}
                                    <div style={{
                                        width: '36px', textAlign: 'center',
                                        fontSize: isTop3 ? '22px' : '14px',
                                        fontWeight: '900',
                                        opacity: isTop3 ? 1 : 0.6
                                    }}>
                                        {rs.icon || rank}
                                    </div>

                                    {/* 玩家名 */}
                                    <div style={{
                                        flex: 1, fontWeight: isTop3 ? '800' : '600',
                                        fontSize: isTop3 ? '16px' : '14px'
                                    }}>
                                        {player.playerName}
                                        {isMe && <span style={{
                                            marginLeft: '6px', padding: '2px 6px',
                                            background: isTop3 ? 'rgba(255,255,255,0.3)' : '#667eea',
                                            color: isTop3 ? 'white' : 'white',
                                            borderRadius: '4px', fontSize: '11px', fontWeight: '700'
                                        }}>我</span>}
                                    </div>

                                    {/* 积分 */}
                                    <div style={{
                                        fontWeight: '900',
                                        fontSize: isTop3 ? '18px' : '14px'
                                    }}>
                                        {player.score.toLocaleString()}
                                        <span style={{ fontSize: '11px', fontWeight: '400', marginLeft: '2px' }}>分</span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}
