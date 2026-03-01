// 初始化界面 - 含身份抽取系统

import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { generateIdentity } from '../data/identities';

// ── 稀有度工具函数 ──────────────────────────────────────────────────────────
// 概率 = school.probability × family.probability
// < 0.008  → 传说  (≈5种组合，如老八校×院士)
// < 0.025  → 史诗  (≈更多精英组合)
// < 0.09   → 稀有
// else     → 普通
export function getRarity(school, family) {
    const p = (school?.probability ?? 0.45) * (family?.probability ?? 0.6);
    if (p < 0.008) return 'legendary';
    if (p < 0.025) return 'epic';
    if (p < 0.09) return 'rare';
    return 'normal';
}

const RARITY = {
    legendary: {
        label: '✦ S · 传说',
        gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 40%, #ff6b6b 100%)',
        glow: '0 0 32px 8px rgba(255,200,0,0.45), 0 8px 32px rgba(255,107,107,0.3)',
        badge: '#d97706',
        shimmer: true,
    },
    epic: {
        label: '◈ A · 史诗',
        gradient: 'linear-gradient(135deg, #7b2ff7 0%, #f107a3 100%)',
        glow: '0 0 28px 6px rgba(123,47,247,0.4), 0 8px 28px rgba(241,7,163,0.25)',
        badge: '#7c3aed',
        shimmer: false,
    },
    rare: {
        label: '◆ B · 稀有',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
        glow: '0 8px 28px rgba(37,99,235,0.35)',
        badge: '#2563eb',
        shimmer: false,
    },
    normal: {
        label: '◇ C · 普通',
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        glow: '0 8px 20px rgba(5,150,105,0.25)',
        badge: '#059669',
        shimmer: false,
    },
};

// ── 技能效果人话翻译 ─────────────────────────────────────────────────────────
function formatEffect(effect, cooldown) {
    if (!effect || Object.keys(effect).length === 0) return '无实际加成（精神支持）';
    const parts = [];
    if (effect.quality) parts.push(`作品质量 +${effect.quality}`);
    if (effect.progress) parts.push(`课题进度 +${effect.progress}%`);
    if (effect.stress) parts.push(`压力 +${effect.stress}`);
    if (effect.moneyCost) parts.push(`花费 ¥${effect.moneyCost.toLocaleString()}`);
    const cdText = cooldown >= 100 ? '仅限1次' : `冷却${cooldown}周`;
    return `${parts.join('，')}（${cdText}）`;
}

export default function InitScreen() {
    const gameContext = useGame();
    const [phase, setPhase] = useState('intro');
    const [identity, setIdentity] = useState(null);
    const [cardFlipped, setCardFlipped] = useState(false);
    const [rarity, setRarity] = useState(null);

    if (!gameContext) {
        return <div style={{ color: 'red', padding: '20px' }}>错误: GameContext未初始化</div>;
    }
    const { dispatch, ActionTypes } = gameContext;

    const handleDraw = () => {
        const drawn = generateIdentity();
        const r = getRarity(drawn.school, drawn.family);
        setIdentity(drawn);
        setRarity(r);
        setPhase('drawing');
        setCardFlipped(false);
        setTimeout(() => setCardFlipped(true), 1200);
        setTimeout(() => setPhase('result'), 2200);
    };

    const handleStartGame = () => {
        dispatch({ type: ActionTypes.INIT_GAME, payload: { identity } });
    };

    const ri = RARITY[rarity] || RARITY.normal;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <style>{`
                @keyframes spin3d {
                    0%   { transform: rotateY(0deg) scale(1); }
                    50%  { transform: rotateY(180deg) scale(1.1); }
                    100% { transform: rotateY(360deg) scale(1); }
                }
                @keyframes flipIn {
                    from { transform: rotateY(90deg); opacity:0; }
                    to   { transform: rotateY(0deg);  opacity:1; }
                }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(20px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes pulse {
                    0%,100% { box-shadow:0 0 0 0 rgba(102,126,234,0.5); }
                    50%     { box-shadow:0 0 0 16px rgba(102,126,234,0); }
                }
                .draw-btn { transition: all 0.2s ease; }
                .draw-btn:hover { opacity:0.9; transform:translateY(-2px); }
                .draw-btn:active { transform:translateY(0); }
                .result-card { animation: fadeUp 0.5s ease forwards; }
                .shimmer-text {
                    background: linear-gradient(90deg,#fff 0%,#ffe066 40%,#fff 60%,#ffe066 100%);
                    background-size:200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 2s linear infinite;
                }
            `}</style>

            <div style={{
                maxWidth: '580px', width: '100%',
                background: 'white', borderRadius: '24px',
                padding: '44px 44px 36px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                textAlign: 'center',
            }}>

                {/* ── 阶段 1：简介 ── */}
                {phase === 'intro' && <>
                    <h1 style={{ fontSize: '46px', fontWeight: '900', color: '#667eea', marginBottom: '8px' }}>
                        建筑生模拟器
                    </h1>
                    <p style={{ fontSize: '17px', color: '#64748B', marginBottom: '28px' }}>从硫酸纸到大师</p>

                    <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
                        <p style={{ fontSize: '15px', color: '#475569', marginBottom: '10px' }}>📚 <strong>游戏简介</strong></p>
                        <p style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.8', margin: 0 }}>
                            欢迎来到建筑学院！经历5年的建筑学习生涯，从空间构成练习到大型奥体中心毕业设计，
                            平衡设计进度、作品质量、压力和金钱，顺利通过每次评图，最终成为建筑大师！
                        </p>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)',
                        borderRadius: '12px', padding: '14px', marginBottom: '24px',
                        border: '1px solid #c7d2fe'
                    }}>
                        <p style={{ fontSize: '13px', color: '#5b21b6', margin: 0, lineHeight: '1.7' }}>
                            🎲 <strong>身份抽取</strong>：你的学校背景与家庭背景将随机抽取，<br />
                            决定初始属性与专属技能。命运的骰子即将掷下……
                        </p>
                    </div>

                    <button onClick={handleDraw} className="draw-btn" style={{
                        width: '100%', padding: '17px',
                        background: 'linear-gradient(135deg,#667eea,#764ba2)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        fontSize: '19px', fontWeight: '700', cursor: 'pointer',
                        animation: 'pulse 2s infinite'
                    }}>
                        🎲 抽取身份
                    </button>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '18px' }}>
                        v1.0 Final Edition | Made with ❤️ for Architecture Students
                    </p>
                </>}

                {/* ── 阶段 2：抽取动画 ── */}
                {phase === 'drawing' && (
                    <div style={{ padding: '20px 0' }}>
                        <p style={{ fontSize: '18px', color: '#667eea', fontWeight: '700', marginBottom: '36px' }}>
                            命运的骰子正在滚动……
                        </p>
                        <div style={{ perspective: '800px', marginBottom: '36px' }}>
                            <div style={{
                                width: '160px', height: '220px', margin: '0 auto',
                                background: cardFlipped ? ri.gradient : 'linear-gradient(135deg,#1e3a5f,#0f2040)',
                                borderRadius: '18px',
                                boxShadow: cardFlipped ? ri.glow : '0 12px 40px rgba(0,0,0,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: cardFlipped ? 'flipIn 0.6s ease forwards' : 'spin3d 0.8s ease-in-out infinite',
                                transition: 'background 0.3s, box-shadow 0.6s',
                            }}>
                                {!cardFlipped
                                    ? <span style={{ fontSize: '48px', opacity: 0.7 }}>🏗️</span>
                                    : <div style={{ color: 'white', textAlign: 'center', padding: '16px' }}>
                                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800' }}>
                                            {identity?.narrative?.title}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#94A3B8' }}>正在确认你的命运……</p>
                    </div>
                )}

                {/* ── 阶段 3：结果 ── */}
                {phase === 'result' && identity && (
                    <div className="result-card">
                        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '14px' }}>🎉 身份已确认</p>

                        {/* 身份大卡 */}
                        <div style={{
                            background: ri.gradient,
                            borderRadius: '20px', padding: '28px 24px 24px',
                            marginBottom: '16px', color: 'white', textAlign: 'left',
                            boxShadow: ri.glow, position: 'relative', overflow: 'hidden',
                        }}>
                            {/* 稀有度角标 */}
                            <span style={{
                                position: 'absolute', top: '14px', right: '14px',
                                fontSize: '11px', fontWeight: '800',
                                background: 'rgba(255,255,255,0.22)',
                                padding: '3px 10px', borderRadius: '20px',
                            }}>
                                {ri.label}
                            </span>

                            {/* 标题 */}
                            <h2 className={ri.shimmer ? 'shimmer-text' : ''} style={{
                                fontSize: '28px', fontWeight: '900', margin: '0 0 10px',
                                ...(ri.shimmer ? {} : { color: 'white' })
                            }}>
                                {identity.narrative?.title}
                            </h2>

                            {/* 标签 */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '600' }}>
                                    🏫 {identity.school?.name}
                                </span>
                                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '600' }}>
                                    👨‍👩‍👧 {identity.family?.name}
                                </span>
                            </div>

                            {/* 介绍词 */}
                            <p style={{
                                fontSize: '13px', lineHeight: '1.8', fontStyle: 'italic',
                                opacity: 0.92, margin: '0 0 18px',
                                borderLeft: '3px solid rgba(255,255,255,0.45)', paddingLeft: '12px'
                            }}>
                                "{identity.narrative?.description}"
                            </p>

                            {/* 专属技能 */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '14px' }}>
                                <p style={{ fontSize: '11px', opacity: 0.75, margin: '0 0 4px', fontWeight: '700', letterSpacing: '0.05em' }}>
                                    ⚡ 专属技能
                                </p>
                                <p style={{ fontSize: '16px', fontWeight: '900', margin: '0 0 4px' }}>
                                    {identity.family?.skill?.name}
                                </p>
                                <p style={{ fontSize: '12px', opacity: 0.88, margin: '0 0 6px' }}>
                                    {identity.family?.skill?.description}
                                </p>
                                {/* 技能效果数值 */}
                                <p style={{
                                    fontSize: '12px', fontWeight: '700',
                                    background: 'rgba(0,0,0,0.18)', borderRadius: '8px',
                                    padding: '6px 10px', margin: 0, display: 'inline-block'
                                }}>
                                    📊 {formatEffect(identity.family?.skill?.effect, identity.family?.skill?.cooldown)}
                                </p>
                            </div>
                        </div>

                        {/* 初始属性预览 */}
                        <div style={{
                            background: '#F8FAFC', borderRadius: '12px', padding: '14px 16px',
                            marginBottom: '20px', display: 'grid',
                            gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left'
                        }}>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                🎨 设计：<strong style={{ color: '#3b82f6' }}>{identity.initialAttributes?.design}</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                💻 软件：<strong style={{ color: '#3b82f6' }}>{identity.initialAttributes?.software}</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                😰 压力：<strong style={{ color: '#ef4444' }}>{identity.initialAttributes?.stress}</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                💰 金钱：<strong style={{ color: '#10b981' }}>¥{identity.initialAttributes?.money?.toLocaleString()}</strong>
                            </p>
                        </div>

                        <button onClick={handleStartGame} className="draw-btn" style={{
                            width: '100%', padding: '17px',
                            background: 'linear-gradient(135deg,#667eea,#764ba2)',
                            color: 'white', border: 'none', borderRadius: '12px',
                            fontSize: '19px', fontWeight: '700', cursor: 'pointer',
                        }}>
                            🎮 开始游戏
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
