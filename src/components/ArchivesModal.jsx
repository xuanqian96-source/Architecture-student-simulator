import React, { useState } from 'react';
import { ALL_ENDINGS, getEndingRecord, getEndingCounts } from '../data/endings';
import { achievements, getAchievementRecord, getUnlockedCount } from '../data/achievements';
import { calculateTotalScore } from '../utils/scoreCalculator';

export default function ArchivesModal({ onClose }) {
    const [tab, setTab] = useState('endings'); // 'endings' | 'achievements'
    const unlockedIds = getEndingRecord();
    const endingCounts = getEndingCounts();
    const [selectedEnding, setSelectedEnding] = useState(null);
    const [selectedAch, setSelectedAch] = useState(null);
    const totalEndingsCount = ALL_ENDINGS.length;
    const unlockedEndingsCount = unlockedIds.length;
    const achRecord = getAchievementRecord();
    const achUnlockedCount = getUnlockedCount();
    const { endingScore, achievementScore, totalScore } = calculateTotalScore();

    // 成就难度对应颜色
    const difficultyStyle = (diff, isUnlocked) => {
        if (!isUnlocked) return { bg: '#E2E8F0', color: '#94A3B8', glow: 'none', label: '???' };
        switch (diff) {
            case 'easy':   return { bg: 'linear-gradient(135deg, #10B981, #059669)', color: 'white', glow: '0 8px 20px rgba(16,185,129,0.3)', label: '入门' };
            case 'medium': return { bg: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white', glow: '0 8px 20px rgba(59,130,246,0.3)', label: '中等' };
            case 'hard':   return { bg: 'linear-gradient(135deg, #F59E0B, #D97706)', color: 'white', glow: '0 8px 20px rgba(245,158,11,0.3)', label: '高难' };
            case 'hidden': return { bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', color: 'white', glow: '0 8px 20px rgba(139,92,246,0.3)', label: '隐藏' };
            default:       return { bg: '#E2E8F0', color: '#94A3B8', glow: 'none', label: '???' };
        }
    };

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99999, padding: '20px'
        }}>
            <div style={{
                background: '#F8FAFC', borderRadius: '24px', width: '100%', maxWidth: '780px',
                maxHeight: '85vh', display: 'flex', flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', overflow: 'hidden',
                position: 'relative'
            }}>
                {/* 头部区域 */}
                <div style={{
                    padding: '24px 32px 0', background: 'white',
                    borderBottom: '1px solid #E2E8F0',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '24px', fontWeight: '900', color: '#1E293B', margin: '0 0 4px' }}>
                                🏛️ 档案馆：我的一百种人生
                            </h2>
                            <p style={{ margin: 0, fontSize: '14px', color: '#64748B', fontWeight: '600' }}>
                                {tab === 'endings'
                                    ? <>已收集结局：<span style={{ color: '#3B82F6' }}>{unlockedEndingsCount}</span> / {totalEndingsCount}</>
                                    : <>已解锁成就：<span style={{ color: '#F59E0B' }}>{achUnlockedCount}</span> / {achievements.length}</>
                                }
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

                    {/* 标签切换 + 积分面板 */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[
                                { key: 'endings', label: '🏆 结局图鉴' },
                                { key: 'achievements', label: '🎖️ 成就图鉴' },
                            ].map(t => (
                                <button
                                    key={t.key}
                                    onClick={() => { setTab(t.key); setSelectedEnding(null); setSelectedAch(null); }}
                                    style={{
                                        padding: '10px 24px',
                                        background: tab === t.key ? '#1E293B' : 'transparent',
                                        color: tab === t.key ? 'white' : '#64748B',
                                        border: 'none',
                                        borderRadius: '12px 12px 0 0',
                                        fontWeight: '800',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>

                        {/* 积分面板 */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingRight: '4px' }}>
                            <div style={{
                                padding: '6px 12px', borderRadius: '10px',
                                background: '#EFF6FF', fontSize: '13px', fontWeight: '700', color: '#3B82F6'
                            }}>
                                结局积分 {endingScore}
                            </div>
                            <div style={{
                                padding: '6px 12px', borderRadius: '10px',
                                background: '#FFFBEB', fontSize: '13px', fontWeight: '700', color: '#D97706'
                            }}>
                                成就积分 {achievementScore}
                            </div>
                            <div style={{
                                padding: '8px 16px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                                fontSize: '14px', fontWeight: '900', color: 'white',
                                boxShadow: '0 2px 8px rgba(245,158,11,0.3)'
                            }}>
                                ⭐ 总积分 {totalScore}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== 结局图鉴内容 ===== */}
                {tab === 'endings' && (
                    <div style={{
                        padding: '32px', overflowY: 'auto', flex: 1,
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '20px'
                    }}>
                        {ALL_ENDINGS.map(ending => {
                            const isUnlocked = unlockedIds.includes(ending.id);
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
                                            marginTop: '8px', fontSize: '10px', fontWeight: '600',
                                            color: badgeColor,
                                            background: badgeBg, padding: '2px 8px', borderRadius: '10px',
                                            textAlign: 'center', lineHeight: '1.3'
                                        }}>
                                            {ending.hint}
                                        </div>
                                    )}
                                    {!isUnlocked && (
                                        <div style={{
                                            marginTop: '8px', fontSize: '10px', fontWeight: '600',
                                            color: '#94A3B8', textAlign: 'center', lineHeight: '1.3',
                                            fontStyle: 'italic'
                                        }}>
                                            {ending.hint}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ===== 成就图鉴内容 ===== */}
                {tab === 'achievements' && (
                    <div style={{
                        padding: '32px', overflowY: 'auto', flex: 1,
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                        gap: '20px'
                    }}>
                        {achievements.map(ach => {
                            const isUnlocked = !!achRecord[ach.id]?.unlocked;
                            const unlockDate = achRecord[ach.id]?.date;
                            const ds = difficultyStyle(ach.difficulty, isUnlocked);

                            return (
                                <div key={ach.id} style={{
                                    background: 'white', borderRadius: '16px', padding: '20px 12px',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    border: `2px solid ${isUnlocked ? 'transparent' : '#F1F5F9'}`,
                                    boxShadow: isUnlocked ? ds.glow : '0 4px 6px -1px rgba(0,0,0,0.05)',
                                    opacity: isUnlocked ? 1 : 0.6,
                                    filter: isUnlocked ? 'none' : 'grayscale(100%)',
                                    transition: 'transform 0.2s',
                                    cursor: 'pointer'
                                }}
                                    onClick={() => setSelectedAch(ach)}
                                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                                >
                                    <div style={{
                                        width: '64px', height: '64px', borderRadius: '50%',
                                        background: ds.bg, color: ds.color,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '32px', marginBottom: '12px',
                                        boxShadow: isUnlocked ? 'inset 0 2px 4px rgba(255,255,255,0.3)' : 'none'
                                    }}>
                                        {isUnlocked ? ach.icon : '❔'}
                                    </div>
                                    <div style={{
                                        fontSize: '13px', fontWeight: '800', color: isUnlocked ? '#1E293B' : '#94A3B8',
                                        textAlign: 'center', lineHeight: '1.4'
                                    }}>
                                        {isUnlocked ? ach.name : '未解锁成就'}
                                    </div>
                                    {isUnlocked && (
                                        <div style={{
                                            marginTop: '8px', fontSize: '10px', fontWeight: '600',
                                            color: 'white',
                                            background: ds.bg, padding: '2px 8px', borderRadius: '10px',
                                            textAlign: 'center', lineHeight: '1.3'
                                        }}>
                                            {ach.hint}
                                        </div>
                                    )}
                                    {!isUnlocked && (
                                        <div style={{
                                            marginTop: '8px', fontSize: '10px', fontWeight: '600',
                                            color: '#94A3B8', textAlign: 'center', lineHeight: '1.3',
                                            fontStyle: 'italic'
                                        }}>
                                            {ach.hint}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ===== 结局详情浮层 ===== */}
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

                            <div style={{
                                background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '12px',
                                padding: '16px 20px', width: '100%', maxWidth: '500px', marginBottom: '24px',
                                textAlign: 'center'
                            }}>
                                <h4 style={{ margin: '0 0 8px 0', color: '#166534', fontSize: '14px', fontWeight: '800' }}>✅ 解锁条件</h4>
                                <p style={{ margin: 0, color: '#15803D', fontSize: '14px', lineHeight: '1.5' }}>{selectedEnding.hint}</p>
                            </div>

                            <div style={{
                                background: '#F8FAFC', borderRadius: '16px', padding: '24px', width: '100%'
                            }}>
                                <p style={{
                                    margin: 0, color: '#334155', fontSize: '16px', lineHeight: '1.8',
                                    whiteSpace: 'pre-wrap', textAlign: 'center'
                                }}>
                                    {selectedEnding.description}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ===== 成就详情浮层 ===== */}
                {selectedAch && (
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
                                成就详情
                            </h3>
                            <button
                                onClick={() => setSelectedAch(null)}
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
                            {(() => {
                                const isUnlocked = !!achRecord[selectedAch.id]?.unlocked;
                                const ds = difficultyStyle(selectedAch.difficulty, isUnlocked);
                                return (
                                    <>
                                        <div style={{
                                            width: '100px', height: '100px', borderRadius: '50%',
                                            background: isUnlocked ? ds.bg : '#E2E8F0',
                                            color: isUnlocked ? ds.color : '#94A3B8',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '48px', marginBottom: '24px',
                                            boxShadow: isUnlocked ? '0 10px 25px rgba(0,0,0,0.1)' : 'none',
                                            filter: isUnlocked ? 'none' : 'grayscale(100%)'
                                        }}>
                                            {isUnlocked ? selectedAch.icon : '❔'}
                                        </div>
                                        <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: '900', color: isUnlocked ? '#1E293B' : '#94A3B8', textAlign: 'center' }}>
                                            {isUnlocked ? selectedAch.name : '未解锁成就'}
                                        </h2>
                                        <div style={{ display: 'flex', gap: '12px', marginBottom: '32px' }}>
                                            <span style={{
                                                background: '#F1F5F9', color: '#475569', padding: '6px 16px',
                                                borderRadius: '12px', fontSize: '14px', fontWeight: '700'
                                            }}>
                                                难度：{isUnlocked ? ds.label : '???'}
                                            </span>
                                            {isUnlocked && achRecord[selectedAch.id]?.date && (
                                                <span style={{
                                                    background: '#FEF9EE', color: '#92400E', padding: '6px 16px',
                                                    borderRadius: '12px', fontSize: '14px', fontWeight: '700'
                                                }}>
                                                    解锁于：{new Date(achRecord[selectedAch.id].date).toLocaleDateString('zh-CN')}
                                                </span>
                                            )}
                                        </div>

                                        <div style={{
                                            background: isUnlocked ? '#F0FDF4' : '#FEF2F2',
                                            border: `1px solid ${isUnlocked ? '#BBF7D0' : '#FECACA'}`,
                                            borderRadius: '12px',
                                            padding: '16px 20px', width: '100%', maxWidth: '500px', marginBottom: '24px',
                                            textAlign: 'center'
                                        }}>
                                            <h4 style={{ margin: '0 0 8px 0', color: isUnlocked ? '#166534' : '#B91C1C', fontSize: '14px', fontWeight: '800' }}>
                                                {isUnlocked ? '✅ 解锁条件' : '🔒 解锁条件'}
                                            </h4>
                                            <p style={{ margin: 0, color: isUnlocked ? '#15803D' : '#991B1B', fontSize: '14px', lineHeight: '1.5' }}>
                                                {selectedAch.hint}
                                            </p>
                                        </div>

                                        {isUnlocked && (
                                            <div style={{
                                                background: '#F8FAFC', borderRadius: '16px', padding: '24px', width: '100%'
                                            }}>
                                                <p style={{
                                                    margin: 0, color: '#334155', fontSize: '16px', lineHeight: '1.8',
                                                    fontStyle: 'italic', textAlign: 'center'
                                                }}>
                                                    "{selectedAch.description}"
                                                </p>
                                            </div>
                                        )}
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
