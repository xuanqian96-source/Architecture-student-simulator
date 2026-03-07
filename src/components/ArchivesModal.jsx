import React, { useState } from 'react';
import { ALL_ENDINGS, getEndingRecord, getEndingCounts } from '../data/endings';

export default function ArchivesModal({ onClose }) {
    const unlockedIds = getEndingRecord();
    const endingCounts = getEndingCounts();
    const [selectedEnding, setSelectedEnding] = useState(null);
    const totalCount = ALL_ENDINGS.length;
    const unlockedCount = unlockedIds.length;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '20px'
        }}>
            <div style={{
                background: '#F8FAFC', borderRadius: '24px', width: '100%', maxWidth: '720px',
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden',
                position: 'relative'
            }}>
                {/* 头部区域 */}
                <div style={{
                    padding: '24px 32px', background: 'white',
                    borderBottom: '1px solid #E2E8F0', display: 'flex',
                    alignItems: 'center', justifyContent: 'space-between'
                }}>
                    <div>
                        <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', margin: '0 0 4px' }}>
                            🏛️ 档案馆：我的一百种人生
                        </h2>
                        <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
                            已收集结局：<span style={{ color: '#3B82F6' }}>{unlockedCount}</span> / {totalCount}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#F1F5F9', border: 'none', width: '40px', height: '40px',
                            borderRadius: '50%', fontSize: '20px', cursor: 'pointer',
                            color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.2s'
                        }}
                        onMouseOver={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#1E293B' }}
                        onMouseOut={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B' }}
                    >
                        ✕
                    </button>
                </div>

                {/* 徽章网格展示区 */}
                <div style={{
                    padding: '32px', overflowY: 'auto', flex: 1,
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '20px'
                }}>
                    {ALL_ENDINGS.map(ending => {
                        const isUnlocked = unlockedIds.includes(ending.id);

                        // 基于评级渲染徽章的背景色彩
                        let badgeBg = '#E2E8F0';
                        let badgeColor = '#94A3B8';
                        let glow = 'none';

                        if (isUnlocked) {
                            if (ending.type === 'S') { badgeBg = 'linear-gradient(135deg, #F59E0B, #D97706)'; badgeColor = 'white'; glow = '0 8px 20px rgba(245,158,11,0.3)'; }
                            else if (ending.type === 'A') { badgeBg = 'linear-gradient(135deg, #6366F1, #4F46E5)'; badgeColor = 'white'; glow = '0 8px 20px rgba(99,102,241,0.3)'; }
                            else if (ending.type === 'B') { badgeBg = 'linear-gradient(135deg, #10B981, #059669)'; badgeColor = 'white'; glow = '0 8px 20px rgba(16,185,129,0.3)'; }
                            else if (ending.type === 'FAIL') { badgeBg = 'linear-gradient(135deg, #EF4444, #DC2626)'; badgeColor = 'white'; glow = '0 8px 20px rgba(239,68,68,0.3)'; }
                        }

                        return (
                            <div key={ending.id} style={{
                                background: 'white', borderRadius: '16px', padding: '20px 12px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                border: `2px solid ${isUnlocked ? 'transparent' : '#F1F5F9'}`,
                                boxShadow: isUnlocked ? glow : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                opacity: isUnlocked ? 1 : 0.6,
                                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                                transition: 'transform 0.2s',
                                cursor: isUnlocked ? 'pointer' : 'default'
                            }}
                                onClick={() => isUnlocked && setSelectedEnding(ending)}
                                onMouseOver={e => isUnlocked && (e.currentTarget.style.transform = 'translateY(-4px)')}
                                onMouseOut={e => isUnlocked && (e.currentTarget.style.transform = 'translateY(0)')}
                            >
                                <div style={{
                                    width: '64px', height: '64px', borderRadius: '50%',
                                    background: badgeBg, color: badgeColor,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '32px', marginBottom: '12px',
                                    boxShadow: isUnlocked ? 'inset 0 2px 4px rgba(255,255,255,0.3)' : 'none'
                                }}>
                                    {isUnlocked ? ending.image : '❔'}
                                </div>
                                <div style={{
                                    fontSize: '14px', fontWeight: '800', color: isUnlocked ? '#1E293B' : '#94A3B8',
                                    textAlign: 'center', lineHeight: '1.4'
                                }}>
                                    {isUnlocked ? ending.name : '未解锁结局'}
                                </div>
                                {isUnlocked && (
                                    <div style={{
                                        marginTop: '8px', fontSize: '11px', fontWeight: '900',
                                        color: badgeBg.includes('gradient') ? '#64748B' : 'white',
                                        background: '#F1F5F9', padding: '2px 8px', borderRadius: '10px'
                                    }}>
                                        {ending.type} 级评定
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* 详情卡片浮层 */}
                {selectedEnding && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(255, 255, 255, 0.98)', zIndex: 10,
                        display: 'flex', flexDirection: 'column',
                        overflowY: 'auto'
                    }}>
                        <div style={{
                            padding: '24px 32px', borderBottom: '1px solid #E2E8F0', display: 'flex',
                            alignItems: 'center', justifyContent: 'space-between',
                            position: 'sticky', top: 0, background: 'rgba(255, 255, 255, 0.98)',
                            zIndex: 20
                        }}>
                            <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#1E293B' }}>
                                结局详情
                            </h3>
                            <button
                                onClick={() => setSelectedEnding(null)}
                                style={{
                                    background: '#F1F5F9', border: 'none', width: '36px', height: '36px',
                                    borderRadius: '50%', fontSize: '18px', cursor: 'pointer',
                                    color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={e => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.color = '#1E293B' }}
                                onMouseOut={e => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.color = '#64748B' }}
                            >
                                ✕
                            </button>
                        </div>
                        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%',
                                background: selectedEnding.type === 'S' ? 'linear-gradient(135deg, #F59E0B, #D97706)' :
                                    selectedEnding.type === 'A' ? 'linear-gradient(135deg, #6366F1, #4F46E5)' :
                                        selectedEnding.type === 'B' ? 'linear-gradient(135deg, #10B981, #059669)' :
                                            'linear-gradient(135deg, #EF4444, #DC2626)',
                                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '48px', marginBottom: '24px',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                            }}>
                                {selectedEnding.image}
                            </div>
                            <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: '900', color: '#1E293B', textAlign: 'center' }}>
                                {selectedEnding.name}
                            </h2>
                            <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                                <span style={{
                                    background: '#F1F5F9', color: '#475569', padding: '6px 16px',
                                    borderRadius: '12px', fontSize: '14px', fontWeight: '700'
                                }}>
                                    评级：{selectedEnding.type} 级
                                </span>
                                <span style={{
                                    background: '#EFF6FF', color: '#2563EB', padding: '6px 16px',
                                    borderRadius: '12px', fontSize: '14px', fontWeight: '700'
                                }}>
                                    达成次数：{endingCounts[selectedEnding.id] || 0} 次
                                </span>
                            </div>

                            {selectedEnding.triggerCondition && (
                                <div style={{
                                    background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '12px',
                                    padding: '16px 20px', width: '100%', maxWidth: '500px', marginBottom: '24px'
                                }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#B91C1C', fontSize: '14px', fontWeight: '800' }}>⚠️ 触发条件</h4>
                                    <p style={{ margin: 0, color: '#991B1B', fontSize: '14px', lineHeight: '1.5' }}>{selectedEnding.triggerCondition}</p>
                                </div>
                            )}

                            <div style={{
                                background: '#F8FAFC', borderRadius: '16px', padding: '24px', width: '100%',
                                borderLeft: '4px solid #CBD5E1'
                            }}>
                                <p style={{
                                    margin: 0, color: '#334155', fontSize: '16px', lineHeight: '1.8',
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {selectedEnding.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
