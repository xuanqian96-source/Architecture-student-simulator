// 新学期导师抽取界面 - 类似开局身份选择，展示3张候选导师卡片

import React, { useState } from 'react';
import { useGame } from '../logic/gameState';

export default function TutorDrawScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const [revealedCards, setRevealedCards] = useState([]);
    const [chosen, setChosen] = useState(null);

    const pending = state.pendingNewSemester;
    if (!pending) return null;

    const { candidates } = pending;

    const handleReveal = (idx) => {
        if (revealedCards.includes(idx) || chosen) return;
        setRevealedCards(prev => [...prev, idx]);
    };

    const handleChoose = (tutorId) => {
        setChosen(tutorId);
        setTimeout(() => {
            dispatch({ type: ActionTypes.DRAW_TUTOR, payload: { tutorId } });
        }, 600);
    };

    // 导师稀有度颜色 (院士最特别)
    const getTutorColor = (tutor) => {
        if (tutor.isSpecial) return { bg: 'linear-gradient(135deg, #7B2FF7, #F107A3)', text: '#fff', border: '#7B2FF7' };
        const colors = [
            { bg: 'linear-gradient(135deg, #2563EB, #06B6D4)', text: '#fff', border: '#2563EB' },
            { bg: 'linear-gradient(135deg, #059669, #10B981)', text: '#fff', border: '#059669' },
            { bg: 'linear-gradient(135deg, #D97706, #F59E0B)', text: '#fff', border: '#D97706' },
        ];
        const idxMap = { wang: 0, chen: 1, li: 2, zhang: 0, sun: 2, ai: 1 };
        return colors[idxMap[tutor.id] ?? 0];
    };

    const getTutorMeta = (tutorId) => {
        const meta = {
            ai: { stars: '★☆☆☆☆', desc: '任务通常与【缓解压力】有关' },
            sun: { stars: '★★☆☆☆', desc: '任务通常与【省钱和低消耗】有关' },
            wang: { stars: '★★★☆☆', desc: '任务通常与【爆肝出图/软件】有关' },
            zhang: { stars: '★★★☆☆', desc: '任务通常与【软件补习】有关' },
            chen: { stars: '★★★★☆', desc: '任务通常与【讲座/设计熏陶】有关' },
            li: { stars: '★★★★☆', desc: '任务与【高压紧凑管控】有关' },
            academician: { stars: '★★★★★', desc: '极致追求：期末大考全满贯' }
        };
        return meta[tutorId] || { stars: '★★★☆☆', desc: '未知特征' };
    };

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '32px 24px',
            background: 'radial-gradient(ellipse at 50% 0%, rgba(59,130,246,0.08), transparent 60%)',
        }}>
            {/* 标题 */}
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <div style={{
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#94A3B8',
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    marginBottom: '10px',
                }}>
                    新学期 · 导师分配
                </div>
                <h2 style={{
                    fontSize: '26px',
                    fontWeight: '900',
                    color: '#1E293B',
                    margin: 0,
                    lineHeight: 1.2,
                }}>
                    点击卡片以翻开，<br />选择本学期导师
                </h2>
                <p style={{
                    fontSize: '13px',
                    color: '#64748B',
                    marginTop: '10px',
                }}>
                    每位导师将带来不同风格的任务与奖励
                </p>
            </div>

            {/* 候选卡片 */}
            <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                width: '100%',
                maxWidth: '720px',
                alignItems: 'stretch',
            }}>
                {candidates.map((tutor, idx) => {
                    const isRevealed = revealedCards.includes(idx);
                    const isChosen = chosen === tutor.id;
                    const colors = getTutorColor(tutor);

                    return (
                        <div
                            key={tutor.id}
                            onClick={() => !isRevealed && handleReveal(idx)}
                            style={{
                                flex: 1,
                                minWidth: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                perspective: '1200px', // 为3D翻转提供透视
                                cursor: chosen ? (isChosen ? 'default' : 'not-allowed') : (isRevealed ? 'default' : 'pointer'),
                                opacity: chosen && !isChosen ? 0.45 : 1,
                                transition: 'all 0.3s ease',
                                transform: isChosen ? 'scale(1.05)' : (chosen && !isChosen) ? 'scale(0.95)' : 'scale(1)',
                            }}
                        >
                            <div style={{
                                position: 'relative',
                                width: '100%',
                                flex: 1,
                                display: 'flex',
                                transition: 'transform 0.6s cubic-bezier(0.4, 0.0, 0.2, 1)',
                                transformStyle: 'preserve-3d',
                                transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)',
                                borderRadius: '20px',
                                boxShadow: isChosen
                                    ? `0 12px 40px ${colors.border}40`
                                    : '0 8px 24px rgba(0,0,0,0.08)',
                            }}>
                                {/* 卡背（未翻开） */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0, bottom: 0,
                                    backfaceVisibility: 'hidden',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '40px 20px',
                                    background: 'linear-gradient(135deg, #334155, #1E293B)',
                                    color: '#94A3B8',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                }}>
                                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🎴</div>
                                    <div style={{
                                        fontSize: '14px',
                                        fontWeight: '700',
                                        letterSpacing: '1px',
                                    }}>
                                        点击翻开
                                    </div>
                                    <div style={{
                                        fontSize: '11px',
                                        marginTop: '6px',
                                        opacity: 0.6,
                                    }}>
                                        候选导师 {idx + 1}
                                    </div>
                                </div>

                                {/* 卡面（已翻开） */}
                                <div style={{
                                    position: 'relative', // 负责撑开包裹器的高度
                                    width: '100%',
                                    flex: 1,
                                    backfaceVisibility: 'hidden',
                                    transform: 'rotateY(180deg)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    background: 'white',
                                }}>
                                    {/* 顶部渐变区域 */}
                                    <div style={{
                                        background: colors.bg,
                                        padding: '24px 20px 20px',
                                        textAlign: 'center',
                                        flexShrink: 0,
                                    }}>
                                        <div style={{ fontSize: '40px', marginBottom: '8px' }}>
                                            {tutor.icon}
                                        </div>
                                        <div style={{
                                            fontSize: '15px',
                                            fontWeight: '800',
                                            color: colors.text,
                                            lineHeight: '1.3',
                                        }}>
                                            {tutor.name}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            color: '#FEF3C7',
                                            marginTop: '6px',
                                            letterSpacing: '2px',
                                        }}>
                                            {tutor.isSpecial ? '⭐ 特殊导师' : `难度: ${getTutorMeta(tutor.id).stars}`}
                                        </div>
                                    </div>

                                    {/* 介绍区域 (使用 flex: 1 撑开高度) */}
                                    <div style={{
                                        padding: '16px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        flex: 1,
                                    }}>
                                        <p style={{
                                            fontSize: '12px',
                                            color: '#64748B',
                                            lineHeight: '1.6',
                                            margin: '0 0 12px 0',
                                            fontStyle: 'italic',
                                        }}>
                                            {tutor.bio}
                                        </p>

                                        {/* 任务预览与按钮组容器 (marginTop: auto 推向底部) */}
                                        <div style={{ marginTop: 'auto' }}>
                                            <div style={{
                                                background: '#FEF2F2',
                                                borderRadius: '6px',
                                                padding: '8px 10px',
                                                fontSize: '11px',
                                                color: '#991B1B',
                                                marginBottom: '8px',
                                                fontWeight: 'bold',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                <span style={{ marginRight: '6px', fontSize: '14px' }}>📌</span>
                                                特征: {getTutorMeta(tutor.id).desc}
                                            </div>

                                            {/* 盲盒体验：移除了具体的前期任务要求面板 */}

                                            {/* 选择按钮 */}
                                            <button
                                                onClick={(e) => { e.stopPropagation(); handleChoose(tutor.id); }}
                                                disabled={!!chosen}
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '8px',
                                                    border: 'none',
                                                    background: chosen ? '#E2E8F0' : colors.bg,
                                                    color: chosen ? '#94A3B8' : colors.text,
                                                    fontSize: '13px',
                                                    fontWeight: '700',
                                                    cursor: chosen ? 'not-allowed' : 'pointer',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {isChosen ? '✓ 已选择' : '选择此导师'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <p style={{
                marginTop: '24px',
                fontSize: '12px',
                color: '#94A3B8',
            }}>
                翻开卡片后才可选择 · 选择后不可更改
            </p>
        </div>
    );
}
