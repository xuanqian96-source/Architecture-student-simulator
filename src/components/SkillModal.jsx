// 技能确认弹窗 - 含三种技能动画效果

import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../logic/gameState';

// ── 粒子动画引擎 ──────────────────────────────────────────────────────
function useParticleAnimation(type, onDone) {
    const canvasRef = useRef(null);
    const [running, setRunning] = useState(false);

    const start = () => setRunning(true);

    useEffect(() => {
        if (!running || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        let particles = [];
        let frame = 0;
        const maxFrames = 120; // ~2s at 60fps
        let animId;

        // 根据技能类型生成粒子
        if (type === 'masterGuidance') {
            // ✨ 金色光粒 + 上升
            for (let i = 0; i < 60; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: canvas.height + Math.random() * 40,
                    vx: (Math.random() - 0.5) * 2,
                    vy: -(2 + Math.random() * 4),
                    size: 2 + Math.random() * 4,
                    opacity: 0.8 + Math.random() * 0.2,
                    color: ['#ffd700', '#ffec8b', '#fff4c1', '#ffe066'][Math.floor(Math.random() * 4)],
                    rotation: Math.random() * Math.PI * 2,
                });
            }
        } else if (type === 'moneyPower') {
            // 💰 撒钱 / 金币雨
            const emojis = ['💵', '💰', '💲', '🪙', '💴'];
            for (let i = 0; i < 45; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: -20 - Math.random() * 200,
                    vx: (Math.random() - 0.5) * 3,
                    vy: 2 + Math.random() * 5,
                    size: 18 + Math.random() * 16,
                    opacity: 0.9,
                    emoji: emojis[Math.floor(Math.random() * emojis.length)],
                    rotation: Math.random() * 0.2 - 0.1,
                    rotationSpeed: (Math.random() - 0.5) * 0.1,
                });
            }
        } else if (type === 'underdog') {
            // 🔥 火焰粒子 + 震动
            for (let i = 0; i < 80; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 5;
                particles.push({
                    x: canvas.width / 2 + (Math.random() - 0.5) * 60,
                    y: canvas.height / 2 + (Math.random() - 0.5) * 60,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 2,
                    size: 3 + Math.random() * 6,
                    opacity: 1,
                    color: ['#ff4500', '#ff6347', '#ff8c00', '#ffd700', '#ff0000'][Math.floor(Math.random() * 5)],
                    life: 0.6 + Math.random() * 0.4,
                });
            }
        }

        const animate = () => {
            frame++;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const globalAlpha = frame > maxFrames - 30 ? (maxFrames - frame) / 30 : 1;

            // 震动效果（仅底层爆种）
            if (type === 'underdog' && frame < 40) {
                const shake = Math.max(0, (40 - frame) / 40) * 6;
                canvas.style.transform = `translate(${(Math.random() - 0.5) * shake}px, ${(Math.random() - 0.5) * shake}px)`;
            } else {
                canvas.style.transform = '';
            }

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (type === 'masterGuidance') {
                    p.opacity -= 0.005;
                    p.vy *= 0.99;
                    ctx.globalAlpha = Math.max(0, p.opacity * globalAlpha);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    // 星形
                    const cx = p.x, cy = p.y, s = p.size;
                    for (let j = 0; j < 5; j++) {
                        const a = (j * 4 * Math.PI) / 5 - Math.PI / 2 + p.rotation;
                        const r = j % 2 === 0 ? s : s * 0.4;
                        j === 0 ? ctx.moveTo(cx + r * Math.cos(a), cy + r * Math.sin(a))
                            : ctx.lineTo(cx + r * Math.cos(a), cy + r * Math.sin(a));
                    }
                    ctx.closePath();
                    ctx.fill();
                } else if (type === 'moneyPower') {
                    p.vy += 0.05; // gravity
                    p.rotation += p.rotationSpeed;
                    ctx.globalAlpha = globalAlpha;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate(p.rotation);
                    ctx.font = `${p.size}px serif`;
                    ctx.textAlign = 'center';
                    ctx.fillText(p.emoji, 0, 0);
                    ctx.restore();
                } else if (type === 'underdog') {
                    p.life -= 0.01;
                    p.vy -= 0.03; // float up
                    p.size *= 0.99;
                    ctx.globalAlpha = Math.max(0, p.life * globalAlpha);
                    ctx.fillStyle = p.color;
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, Math.max(0.5, p.size), 0, Math.PI * 2);
                    ctx.fill();
                }
            });

            ctx.globalAlpha = 1;

            if (frame < maxFrames) {
                animId = requestAnimationFrame(animate);
            } else {
                canvas.style.transform = '';
                setRunning(false);
                onDone?.();
            }
        };

        animId = requestAnimationFrame(animate);
        return () => {
            cancelAnimationFrame(animId);
            canvas.style.transform = '';
        };
    }, [running, type, onDone]);

    return { canvasRef, start, running };
}

// ── 技能效果格式化 ───────────────────────────────────────────────────
function formatEffectList(effect) {
    if (!effect || Object.keys(effect).length === 0) return [];
    const list = [];
    if (effect.quality) list.push({ label: '作品质量', value: `+${effect.quality}`, color: '#10b981' });
    if (effect.progress) list.push({ label: '课题进度', value: `+${effect.progress}%`, color: '#3b82f6' });
    if (effect.stress) list.push({ label: '压力', value: `+${effect.stress}`, color: '#ef4444' });
    if (effect.moneyCost) list.push({ label: '花费', value: `-¥${effect.moneyCost.toLocaleString()}`, color: '#f59e0b' });
    return list;
}

// ── 技能图标映射 ─────────────────────────────────────────────────────
const SKILL_ICONS = {
    masterGuidance: '🌟',
    moneyPower: '💰',
    underdog: '🔥',
    ordinaryPath: '🚶',
};

export default function SkillModal({ onClose }) {
    const { state, dispatch, ActionTypes } = useGame();
    const { identity, skillCooldown } = state;
    const skill = identity?.family?.skill;
    const isMiddle = identity?.family?.id === 'middle';
    const hasMoneyCost = skill?.effect?.moneyCost > 0;
    const canAfford = !hasMoneyCost || state.attributes.money > skill.effect.moneyCost;

    const [phase, setPhase] = useState('confirm'); // 'confirm' | 'animating' | 'done'

    const handleAnimDone = () => setPhase('done');
    const { canvasRef, start: startAnim, running } = useParticleAnimation(skill?.id, handleAnimDone);

    const handleUse = () => {
        dispatch({ type: ActionTypes.USE_SKILL });
        setPhase('animating');
        setTimeout(() => startAnim(), 100);
    };

    const effectList = formatEffectList(skill?.effect);
    const skillIcon = SKILL_ICONS[skill?.id] || '⚡';

    return (
        <div style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000,
            animation: 'fadeIn 0.2s ease',
        }}>
            <style>{`
                @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
                @keyframes slideUp { from { transform:translateY(30px); opacity:0; } to { transform:translateY(0); opacity:1; } }
                @keyframes pulseGlow {
                    0%,100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
                    50%     { box-shadow: 0 0 40px rgba(255,215,0,0.6); }
                }
            `}</style>

            {/* 粒子动画 Canvas（全屏） */}
            <canvas ref={canvasRef} style={{
                position: 'fixed', inset: 0,
                width: '100%', height: '100%',
                pointerEvents: 'none', zIndex: 2001,
                display: phase === 'animating' || phase === 'done' ? 'block' : 'none',
            }} />

            {/* 弹窗卡片 */}
            <div style={{
                background: 'white', borderRadius: '20px',
                maxWidth: '420px', width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                animation: 'slideUp 0.3s ease',
                zIndex: 2002, overflow: 'hidden',
            }}>
                {/* 头部 */}
                <div style={{
                    background: isMiddle
                        ? 'linear-gradient(135deg, #94a3b8, #cbd5e1)'
                        : 'linear-gradient(135deg, #667eea, #764ba2)',
                    padding: '28px 24px 20px', textAlign: 'center', color: 'white',
                }}>
                    <div style={{ fontSize: '42px', marginBottom: '8px' }}>{skillIcon}</div>
                    <div style={{ fontSize: '22px', fontWeight: '900' }}>{skill?.name}</div>
                </div>

                {/* 内容 */}
                <div style={{ padding: '24px' }}>
                    {/* 描述 */}
                    <p style={{
                        fontSize: '14px', color: '#475569', lineHeight: '1.8',
                        marginBottom: '16px', textAlign: 'center',
                    }}>
                        {skill?.description}
                    </p>

                    {/* 效果列表 */}
                    {effectList.length > 0 ? (
                        <div style={{
                            background: '#f8fafc', borderRadius: '12px',
                            padding: '16px', marginBottom: '20px',
                        }}>
                            <p style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', marginBottom: '10px', letterSpacing: '0.05em' }}>
                                📊 技能效果
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {effectList.map((e, i) => (
                                    <div key={i} style={{
                                        background: 'white', borderRadius: '8px',
                                        padding: '8px 14px', border: '1px solid #e2e8f0',
                                        flex: '1 1 auto', textAlign: 'center', minWidth: '100px',
                                    }}>
                                        <div style={{ fontSize: '11px', color: '#94a3b8', marginBottom: '2px' }}>{e.label}</div>
                                        <div style={{ fontSize: '18px', fontWeight: '800', color: e.color }}>{e.value}</div>
                                    </div>
                                ))}
                            </div>
                            {hasMoneyCost && !canAfford && (
                                <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '10px', textAlign: 'center' }}>
                                    ⚠️ 金钱不足，无法使用此技能
                                </p>
                            )}
                        </div>
                    ) : (
                        /* 普通家庭无效果说明 */
                        <div style={{
                            background: '#f1f5f9', borderRadius: '12px',
                            padding: '20px', marginBottom: '20px', textAlign: 'center',
                        }}>
                            <p style={{ fontSize: '28px', marginBottom: '8px' }}>😔</p>
                            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.7' }}>
                                普通家庭没有主动技能可以使用。<br />
                                但平凡之路，也有坚韧的力量。<br />
                                加油，建筑牲口！
                            </p>
                        </div>
                    )}

                    {/* 冷却信息 */}
                    {!isMiddle && (
                        <p style={{ fontSize: '11px', color: '#94a3b8', textAlign: 'center', marginBottom: '16px' }}>
                            ⏱ 使用后冷却 {skill?.cooldown} 周
                        </p>
                    )}

                    {/* 按钮区 */}
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {phase === 'confirm' && (
                            <>
                                <button onClick={onClose} style={{
                                    flex: 1, padding: '14px', background: '#f1f5f9',
                                    border: 'none', borderRadius: '12px',
                                    fontSize: '15px', fontWeight: '700', color: '#64748b',
                                    cursor: 'pointer',
                                }}>
                                    {isMiddle ? '知道了' : '取消'}
                                </button>
                                {!isMiddle && (
                                    <button
                                        onClick={handleUse}
                                        disabled={!canAfford}
                                        style={{
                                            flex: 1, padding: '14px',
                                            background: canAfford
                                                ? 'linear-gradient(135deg, #667eea, #764ba2)'
                                                : '#cbd5e1',
                                            border: 'none', borderRadius: '12px',
                                            fontSize: '15px', fontWeight: '700', color: 'white',
                                            cursor: canAfford ? 'pointer' : 'not-allowed',
                                        }}
                                    >
                                        ⚡ 确认使用
                                    </button>
                                )}
                            </>
                        )}
                        {(phase === 'animating' || phase === 'done') && (
                            <button onClick={onClose} style={{
                                flex: 1, padding: '14px',
                                background: 'linear-gradient(135deg, #10b981, #059669)',
                                border: 'none', borderRadius: '12px',
                                fontSize: '15px', fontWeight: '700', color: 'white',
                                cursor: phase === 'done' ? 'pointer' : 'default',
                                opacity: phase === 'done' ? 1 : 0.6,
                            }}>
                                {phase === 'done' ? '✅ 完成' : '⏳ 施展中...'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
