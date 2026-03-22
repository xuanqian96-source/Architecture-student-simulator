// 建筑朝圣之旅 - 地图界面

import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { atlasBuildings, atlasMilestones } from '../data/atlas.js';
import { useIsMobile } from '../hooks/useIsMobile';

// 地图上12个节点的位置（Z字形蜿蜒路线）
const nodePositions = [
    { x: 16, y: 15 }, // 1 萨伏伊
    { x: 38, y: 10 }, // 2 流水别墅
    { x: 62, y: 15 }, // 3 光之教堂
    { x: 84, y: 10 }, // 4 范斯沃斯

    { x: 84, y: 46 }, // 5 朗香教堂
    { x: 62, y: 51 }, // 6 悉尼歌剧院
    { x: 38, y: 46 }, // 7 金泽21世纪
    { x: 16, y: 51 }, // 8 古根海姆

    { x: 16, y: 86 }, // 9 巴塞罗那德国馆
    { x: 38, y: 81 }, // 10 万神殿
    { x: 62, y: 86 }, // 11 犹太博物馆
    { x: 84, y: 81 }, // 12 阿布扎比卢浮宫
];

// 连线定义（相邻节点索引对）
const connections = [
    [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11]
];

function getNodeStatus(index, atlas) {
    const building = atlasBuildings[index];
    if (atlas.visited.includes(building.id)) return 'visited';
    if (atlas.currentExpedition?.buildingId === building.id) return 'exploring';
    // 可考察：第一座或前一座已点亮
    if (index === 0 || atlas.visited.includes(atlasBuildings[index - 1].id)) return 'available';
    return 'locked';
}

export default function AtlasScreen() {
    const { state, dispatch } = useGame();
    const atlas = state.atlas || {};
    const [selectedIdx, setSelectedIdx] = useState(null);
    const [flyingTarget, setFlyingTarget] = useState(null);
    const [showLegend, setShowLegend] = useState(false);
    const isMobile = useIsMobile();

    const handleClose = () => {
        dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } });
    };

    const handleStartExpedition = (building, targetIdx) => {
        if (state.attributes.money < building.cost) return;
        if (atlas.currentExpedition) return;

        // 起飞动画前，先关闭详情卡片
        setSelectedIdx(null);
        setFlyingTarget(targetIdx);

        // 动画时间延长至2.5s，等落地稍作停滞后再派发状态变更
        setTimeout(() => {
            dispatch({
                type: 'START_EXPEDITION',
                payload: { buildingId: building.id, cost: building.cost, weeks: building.weeks }
            });
            setFlyingTarget(null);
        }, 3000); // 预留3s缓冲，确保2.5s动画播完加上一点停滞
    };

    const visitedCount = (atlas.visited || []).length;
    // 找出已访问的最后一个节点（作为起飞点）
    let lastVisitedIdx = -1;
    if (atlas.visited.length > 0) {
        const lastId = atlas.visited[atlas.visited.length - 1];
        lastVisitedIdx = atlasBuildings.findIndex(b => b.id === lastId);
    }

    return (
        <div style={{
            width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
            // 纯白底色（去除所有灰底和网格）
            background: '#FFFFFF',
            borderRadius: '20px', overflow: 'hidden', position: 'relative',
            boxShadow: 'inset 0 0 60px rgba(0,0,0,0.02)'
        }}>
            {/* 顶部栏（毛玻璃特效） */}
            <div style={{
                padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                zIndex: 5
            }}>
                <div>
                    <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1E293B' }}>
                        🌍 建筑朝圣地图
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748B' }}>
                        已点亮 <strong style={{ color: '#0F172A' }}>{visitedCount}/12</strong> 座建筑
                        {atlas.currentExpedition && (() => {
                            const b = atlasBuildings.find(b => b.id === atlas.currentExpedition.buildingId);
                            return b ? ` · ✈️ ${b.name}（剩余${atlas.currentExpedition.weeksLeft}周）` : '';
                        })()}
                    </p>
                </div>
                <button onClick={handleClose} style={{
                    background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '12px',
                    padding: '8px 16px', cursor: 'pointer', fontWeight: '700', color: '#475569', fontSize: '14px',
                    transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                }} onMouseOver={e => e.currentTarget.style.background = '#E2E8F0'} onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}>
                    关闭地图
                </button>
            </div>

            {/* 图例说明卡片 */}
            {isMobile ? (
                /* 移动端：内联在标题下方 */
                <div style={{
                    padding: '8px 16px', display: 'flex', gap: '12px', flexWrap: 'wrap',
                    borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
                    background: 'rgba(255,255,255,0.6)', fontSize: '11px', color: '#475569', fontWeight: '600',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F1F5F9', border: '1px solid #CBD5E1' }} />
                        <span>未解锁</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'white', border: '1px solid #64748B' }} />
                        <span>可考察</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EFF6FF', border: '1px solid #3B82F6' }} />
                        <span style={{ color: '#2563EB' }}>考察中</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F0FDFA', border: '1px solid #0D9488' }} />
                        <span style={{ color: '#0F766E' }}>已点亮</span>
                    </div>
                </div>
            ) : (
                <div style={{
                    position: 'absolute', top: '90px', right: '20px',
                    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)',
                    padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid rgba(148, 163, 184, 0.2)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px', color: '#475569', fontWeight: '600',
                    display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 2
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F1F5F9', border: '1px solid #CBD5E1' }}></div>
                        <span>未解锁图标</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'white', border: '1px solid #64748B' }}></div>
                        <span>可前往考察</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EFF6FF', border: '1px solid #3B82F6' }}></div>
                        <span style={{ color: '#2563EB' }}>考察进行中</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F0FDFA', border: '1px solid #0D9488' }}></div>
                        <span style={{ color: '#0F766E' }}>已点亮建筑</span>
                    </div>
                </div>
            )}

            {/* 地图区域 */}
            <div style={{
                flex: 1, position: 'relative', padding: '20px', overflow: 'auto'
            }}>
                <div style={{ position: 'relative', width: '100%', height: isMobile ? '380px' : '480px', marginTop: '10px' }}>
                    {/* SVG连线（带弧度加粗的航线），使用 viewBox 映射百分比坐标 */}
                    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
                        {connections.map(([a, b], i) => {
                            const p1 = nodePositions[a];
                            const p2 = nodePositions[b];
                            
                            const isLit = atlas.visited.includes(atlasBuildings[a].id) && atlas.visited.includes(atlasBuildings[b].id);
                            
                            // 利用平滑的赛贝尔曲线规划一笔直连：
                            let pathD = '';
                            if (a === 3 && b === 4) {
                                // 第四到第五座：完美的右半圆弧弯折下排
                                pathD = `M ${p1.x} ${p1.y} C ${p1.x + 13} ${p1.y}, ${p2.x + 13} ${p2.y}, ${p2.x} ${p2.y}`;
                            } else if (a === 7 && b === 8) {
                                // 第八到第九座：完美的左半圆弧弯折下排
                                pathD = `M ${p1.x} ${p1.y} C ${p1.x - 13} ${p1.y}, ${p2.x - 13} ${p2.y}, ${p2.x} ${p2.y}`;
                            } else {
                                // 水平的波浪波纹连接
                                const dx = (p2.x - p1.x) * 0.45;
                                pathD = `M ${p1.x} ${p1.y} C ${p1.x + dx} ${p1.y}, ${p2.x - dx} ${p2.y}, ${p2.x} ${p2.y}`;
                            }

                            return (
                                <g key={i}>
                                    <path
                                        d={pathD}
                                        fill="none"
                                        vectorEffect="non-scaling-stroke"
                                        stroke={isLit ? '#0EA5E9' : '#93C5FD'}
                                        strokeWidth={isLit ? 4 : 3}
                                        strokeDasharray={isLit ? 'none' : '6 6'}
                                        strokeLinecap="round"
                                    />
                                </g>
                            );
                        })}
                    </svg>

                    {/* 飞机动效 */}
                    {flyingTarget !== null && (() => {
                        const targetPos = nodePositions[flyingTarget];
                        const startPos = lastVisitedIdx >= 0 ? nodePositions[lastVisitedIdx] : { x: 0, y: targetPos.y };
                        
                        return (
                            <div style={{
                                position: 'absolute',
                                left: `${startPos.x}%`, top: `${startPos.y}%`,
                                transform: 'translate(-50%, -50%)',
                                fontSize: '32px', zIndex: 20,
                                animation: 'flyAirplane 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards',
                                filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.3))'
                            }}>
                                ✈️
                                <style>{`
                                    @keyframes flyAirplane {
                                        0% { left: ${startPos.x}%; top: ${startPos.y}%; transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 0; }
                                        15% { left: ${startPos.x}%; top: ${startPos.y-5}%; transform: translate(-50%, -50%) scale(1.3) rotate(15deg); opacity: 1; } /* 原地起飞滞空一段 */
                                        60% { top: ${(startPos.y + targetPos.y)/2 - 15}%; } /* 抛物线顶点更高更优美 */
                                        85% { left: ${targetPos.x}%; top: ${targetPos.y}%; transform: translate(-50%, -50%) scale(1.2) rotate(-5deg); opacity: 1; } /* 到达终点 */
                                        95% { left: ${targetPos.x}%; top: ${targetPos.y}%; transform: translate(-50%, -50%) scale(1.1) rotate(0deg); opacity: 1; } /* 停留停滞 */
                                        100% { left: ${targetPos.x}%; top: ${targetPos.y}%; transform: translate(-50%, -50%) scale(0.8) rotate(0deg); opacity: 0; }
                                    }
                                `}</style>
                            </div>
                        );
                    })()}

                    {/* 建筑节点（全面放大） */}
                    {atlasBuildings.map((building, idx) => {
                        const pos = nodePositions[idx];
                        const status = getNodeStatus(idx, atlas);
                        const isSelected = selectedIdx === idx;
                        const isFlyingTarget = flyingTarget === idx;

                        const isLocked = status === 'locked';
                        const isAvailable = status === 'available';
                        const isExploring = status === 'exploring';
                        const isVisited = status === 'visited';

                        const nodeStyle = {
                            position: 'absolute',
                            left: `${pos.x}%`, top: `${pos.y}%`,
                            transform: 'translate(-50%, -50%)',
                            width: '64px', height: '64px', // 放大图标容器
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '28px', // 放大emoji
                            cursor: isLocked ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                            border: '3px solid', // 加粗边框
                            ...(isVisited ? {
                                background: '#F0FDFA',
                                borderColor: '#0D9488', // 琉璃孔雀绿印章效果，告别土黄
                                boxShadow: '0 4px 16px rgba(13, 148, 136, 0.2)',
                                color: '#0F766E'
                            } : isExploring ? {
                                background: '#EFF6FF',
                                borderColor: '#3B82F6',
                                animation: 'pulseRing 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                                boxShadow: '0 0 0 0 rgba(59, 130, 246, 0.7)',
                            } : isAvailable ? {
                                background: 'white',
                                borderColor: '#64748B',
                                padding: '4px',
                                boxShadow: '0 6px 12px rgba(0,0,0,0.08)',
                                transform: isSelected ? 'translate(-50%, -50%) scale(1.1)' : 'translate(-50%, -50%) scale(1)'
                            } : {
                                background: '#F1F5F9',
                                borderColor: '#CBD5E1',
                                opacity: 0.7,
                                filter: 'grayscale(100%)'
                            })
                        };

                        return (
                            <div key={building.id}>
                                <div
                                    style={nodeStyle}
                                    onClick={() => !isLocked && setSelectedIdx(isSelected ? null : idx)}
                                >
                                    {isLocked ? '🔒' : isVisited ? '🏛️' : building.icon}
                                </div>
                                {/* 节点名称标签（字体放大加粗） */}
                                <div style={{
                                    position: 'absolute',
                                    left: `${pos.x}%`, top: `calc(${pos.y}% + 42px)`,
                                    transform: 'translateX(-50%)',
                                    fontSize: '13px', fontWeight: '900', // 更大更粗
                                    color: isVisited ? '#0F766E' : isLocked ? '#94A3B8' : '#1E293B',
                                    whiteSpace: 'nowrap', textAlign: 'center',
                                    background: isVisited ? 'rgba(240, 253, 250, 0.9)' : 'rgba(255,255,255,0.8)',
                                    padding: '4px 8px', borderRadius: '6px',
                                    backdropFilter: 'blur(4px)',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                    border: isVisited ? '1px solid rgba(13, 148, 136, 0.2)' : 'none'
                                }}>
                                    {building.name}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 底部里程碑条 */}
            <div style={{
                position: 'relative',
                padding: isMobile ? '16px 12px' : '24px 32px',
                borderTop: '1px solid rgba(148, 163, 184, 0.2)',
                background: 'rgba(255, 255, 255, 0.85)',
                backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
                zIndex: 5
            }}>
                {/* 标题 */}
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '2px',
                    marginBottom: isMobile ? '12px' : '0',
                    ...(isMobile ? {} : { position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)' })
                }}>
                    <span style={{ fontSize: isMobile ? '14px' : '15px', fontWeight: '800', color: '#1E293B' }}>阶段里程碑</span>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#64748B' }}>点亮建筑领奖励</span>
                </div>

                {/* 里程碑节点 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isMobile ? '6px' : '16px',
                    flexWrap: isMobile ? 'nowrap' : 'nowrap',
                    overflowX: isMobile ? 'auto' : 'visible',
                    paddingBottom: isMobile ? '4px' : '0',
                }}>
                    {atlasMilestones.map((ms, i) => {
                        const reached = visitedCount >= ms.count;
                        return (
                            <div key={ms.count} style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '16px' }}>
                                {i > 0 && <div style={{
                                    width: isMobile ? '24px' : '60px', height: '3px',
                                    background: reached ? '#0EA5E9' : '#E2E8F0',
                                    flexShrink: 0,
                                }} />}
                                <div 
                                    style={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '4px' : '8px',
                                        cursor: 'pointer', transition: 'transform 0.2s',
                                        flexShrink: 0,
                                    }}
                                    onClick={() => setShowLegend(ms)}
                                >
                                    <div style={{
                                        width: isMobile ? '36px' : '44px', height: isMobile ? '36px' : '44px', borderRadius: '50%',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: isMobile ? '14px' : '18px', fontWeight: '900',
                                        background: reached ? '#F0F9FF' : '#F8FAFC',
                                        color: reached ? '#0284C7' : '#94A3B8',
                                        border: `3px solid ${reached ? '#0EA5E9' : '#E2E8F0'}`,
                                        boxShadow: reached ? '0 4px 16px rgba(14, 165, 233, 0.2)' : 'none',
                                    }}>
                                        {reached ? '✨' : ms.count}
                                    </div>
                                    <span style={{
                                        fontSize: isMobile ? '11px' : '13px', fontWeight: '800',
                                        color: reached ? '#0369A1' : '#94A3B8'
                                    }}>{ms.count}座</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* 里程碑奖励说明弹框 */}
            {showLegend && (
                <div style={{
                    position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(4px)', zIndex: 40,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    animation: 'fadeIn 0.2s ease-out'
                }} onClick={() => setShowLegend(null)}>
                    <div style={{
                        background: 'white', padding: '32px', borderRadius: '24px', width: '320px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3)', position: 'relative',
                        transform: 'translateY(0)', animation: 'slideUpModal 0.2s ease-out'
                    }} onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowLegend(null)} style={{
                            position: 'absolute', top: '16px', right: '16px', width: '30px', height: '30px',
                            borderRadius: '50%', border: 'none', background: '#F1F5F9', color: '#64748B',
                            fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>✕</button>
                        <h3 style={{ margin: '0 0 8px', color: '#0F172A', fontSize: '20px', fontWeight: '900' }}>
                            ✨ 阶段成就
                        </h3>
                        <p style={{ margin: '0 0 20px', color: '#64748B', fontSize: '14px', fontWeight: '600' }}>
                            点亮 {showLegend.count} 座殿堂级建筑解锁。
                        </p>
                        <div style={{ background: '#F0F9FF', padding: '16px', borderRadius: '12px', border: '1px solid #BAE6FD' }}>
                            <div style={{ fontSize: '12px', color: '#0369A1', fontWeight: '800', marginBottom: '8px' }}>达成奖励：</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: '#0284C7', fontWeight: '700', fontSize: '15px' }}>
                                {showLegend.reward?.design > 0 && <div>📐 设计能力 +{showLegend.reward.design}</div>}
                                {showLegend.reward?.software > 0 && <div>💻 软件能力 +{showLegend.reward.software}</div>}
                                {showLegend.reward?.portfolioScore > 0 && <div>📁 作品集加分 +{showLegend.reward.portfolioScore}</div>}
                            </div>
                        </div>
                        {visitedCount >= showLegend.count ? (
                            <div style={{ marginTop: '20px', textAlign: 'center', color: '#059669', fontWeight: '800', background: '#ECFDF5', padding: '12px', borderRadius: '12px' }}>✅ 此阶段奖励已领取</div>
                        ) : (
                            <div style={{ marginTop: '20px', textAlign: 'center', color: '#94A3B8', fontWeight: '600', fontSize: '13px' }}>继续考察以达成目标吧！</div>
                        )}
                    </div>
                </div>
            )}

            {/* 建筑详情弹窗 */}
            {selectedIdx !== null && (() => {
                const building = atlasBuildings[selectedIdx];
                const status = getNodeStatus(selectedIdx, atlas);
                const canAfford = state.attributes.money >= building.cost;
                const hasExpedition = !!atlas.currentExpedition;
                const isFlying = flyingTarget !== null;
                const canStart = status === 'available' && canAfford && !hasExpedition && !isFlying;

                return (
                    <div style={{
                        position: 'absolute', inset: 0, background: 'rgba(15, 23, 42, 0.4)',
                        backdropFilter: 'blur(4px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 30, animation: 'fadeIn 0.2s ease-out'
                    }} onClick={() => !isFlying && setSelectedIdx(null)}>
                        <div style={{
                            background: 'white', borderRadius: '24px', padding: '32px',
                            maxWidth: '420px', width: '90%', position: 'relative',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            transform: 'translateY(0)', animation: 'slideUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} onClick={e => e.stopPropagation()}>
                            
                            {/* 右上角关闭按钮 */}
                            <button onClick={() => setSelectedIdx(null)} style={{
                                position: 'absolute', top: '24px', right: '24px',
                                width: '32px', height: '32px', borderRadius: '50%',
                                background: '#F1F5F9', border: 'none', color: '#64748B', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '18px', fontWeight: 'bold', transition: 'background 0.2s'
                            }} onMouseOver={e => e.currentTarget.style.background = '#E2E8F0'} onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}>
                                ✕
                            </button>

                            {/* 标签 */}
                            <div style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px',
                                background: status === 'visited' ? '#F0FDFA' : '#F1F5F9',
                                color: status === 'visited' ? '#0F766E' : '#475569',
                                borderRadius: '20px', fontSize: '12px', fontWeight: '800',
                                marginBottom: '16px'
                            }}>
                                <span>{building.flag}</span>
                                <span>{building.style}</span>
                                <span style={{ opacity: 0.5 }}>|</span>
                                <span>{building.year}年</span>
                            </div>

                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#0F172A', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '32px' }}>
                                <span>{building.icon}</span>
                                {building.name}
                            </h2>
                            <p style={{ fontSize: '14px', fontWeight: '600', color: '#64748B', margin: '0 0 20px' }}>
                                {building.architect}
                            </p>

                            <p style={{ fontSize: '14px', lineHeight: '1.8', color: '#334155', margin: '0 0 16px' }}>
                                {building.description}
                            </p>

                            <div style={{
                                position: 'relative', padding: '16px', background: '#F8FAFC',
                                borderRadius: '12px', borderLeft: '4px solid #CBD5E1', marginBottom: '24px'
                            }}>
                                <p style={{ fontSize: '13px', fontStyle: 'italic', fontWeight: '600', color: '#475569', margin: 0, lineHeight: '1.6' }}>
                                    {building.quote}
                                </p>
                            </div>

                            {/* 费用信息 */}
                            {status !== 'visited' && (
                                <div style={{
                                    display: 'flex', gap: '12px', marginBottom: '24px',
                                }}>
                                    <div style={{
                                        flex: 1, padding: '12px', background: canAfford ? '#ECFDF5' : '#FEF2F2',
                                        borderRadius: '16px', border: `1px solid ${canAfford ? '#A7F3D0' : '#FECACA'}`
                                    }}>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: canAfford ? '#059669' : '#DC2626', marginBottom: '4px' }}>考察费用</div>
                                        <div style={{ fontSize: '18px', fontWeight: '900', color: canAfford ? '#065F46' : '#991B1B' }}>¥{building.cost.toLocaleString()}</div>
                                    </div>
                                    <div style={{
                                        flex: 1, padding: '12px', background: '#F8FAFC',
                                        borderRadius: '16px', border: '1px solid #E2E8F0'
                                    }}>
                                        <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748B', marginBottom: '4px' }}>所需时间</div>
                                        <div style={{ fontSize: '18px', fontWeight: '900', color: '#1E293B' }}>{building.weeks}周</div>
                                    </div>
                                </div>
                            )}

                            {/* 操作按钮 */}
                            {status === 'visited' ? (
                                <div style={{
                                    textAlign: 'center', padding: '16px',
                                    background: '#F0FDFA', borderRadius: '16px', border: '1px solid #CCFBF1',
                                    color: '#0F766E', fontWeight: '800', fontSize: '15px'
                                }}>
                                    ✅ 图鉴已点亮
                                </div>
                            ) : status === 'exploring' ? (
                                <div style={{
                                    textAlign: 'center', padding: '16px',
                                    background: '#EFF6FF', borderRadius: '16px', border: '1px solid #DBEAFE',
                                    color: '#1D4ED8', fontWeight: '800', fontSize: '15px'
                                }}>
                                    ✈️ 正在考察中 · 剩余 {atlas.currentExpedition?.weeksLeft} 周
                                </div>
                            ) : (
                                <button
                                    onClick={() => canStart && handleStartExpedition(building, selectedIdx)}
                                    disabled={!canStart}
                                    style={{
                                        width: '100%', padding: '16px',
                                        background: canStart ? '#0F172A' : '#F1F5F9',
                                        color: canStart ? 'white' : '#94A3B8',
                                        border: 'none', borderRadius: '16px',
                                        fontSize: '15px', fontWeight: '800',
                                        cursor: canStart ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s',
                                        boxShadow: canStart ? '0 10px 25px -5px rgba(15, 23, 42, 0.4)' : 'none'
                                    }}
                                    onMouseOver={e => canStart && (e.currentTarget.style.transform = 'translateY(-2px)')}
                                    onMouseOut={e => canStart && (e.currentTarget.style.transform = 'translateY(0)')}
                                >
                                    {isFlying ? '✈️ 航班排班中...'
                                        : hasExpedition ? '⏳ 需等待当前考察结束'
                                        : !canAfford ? '💰 经费不足'
                                        : '🛫 预定机票并出发'}
                                </button>
                            )}
                        </div>
                    </div>
                );
            })()}

            {/* 关键帧动画 */}
            <style>{`
                @keyframes pulseRing {
                    0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.6); transform: translate(-50%, -50%) scale(1); }
                    70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); transform: translate(-50%, -50%) scale(1.05); }
                    100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); transform: translate(-50%, -50%) scale(1); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUpModal {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
}
