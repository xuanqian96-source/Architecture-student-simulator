// 商店界面 - 带效果标签和商品图标

import React from 'react';
import { useGame } from '../logic/gameState';
import { shopItems } from '../data/shop';
import { useIsMobile } from '../hooks/useIsMobile';

// 效果翻译
const EFFECT_LABELS = {
    design: { label: '设计', fmt: v => `+${v}`, color: '#8b5cf6' },
    software: { label: '软件', fmt: v => `+${v}`, color: '#3b82f6' },
    stress: { label: '压力', fmt: v => `+${v}`, color: '#ef4444' },
    stressReduction: { label: '压力增量', fmt: v => `-${Math.round(v * 100)}%`, color: '#10b981' },
    weeklyStressReduction: { label: '每周压力', fmt: v => `-${v}`, color: '#10b981' },
    nextWeekAPBoost: { label: '下周AP', fmt: v => `+${v}`, color: '#f59e0b' },
};

function formatEffectTags(effect) {
    return Object.entries(effect).map(([key, value]) => {
        const meta = EFFECT_LABELS[key];
        if (!meta) return null;
        return { label: meta.label, value: meta.fmt(value), color: meta.color };
    }).filter(Boolean);
}

export default function ShopScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const isMobile = useIsMobile();
    const { money } = state.attributes;
    const { inventory } = state;

    const handlePurchase = (item) => {
        const owned = inventory.includes(item.id);
        if (item.repeatable) {
            // 可重复购买商品：仅需检查钱和是否已在本周购买
            if (money > item.price && !owned) {
                dispatch({ type: ActionTypes.PURCHASE_ITEM, payload: { item } });
            }
        } else if (!owned && money > item.price) {
            dispatch({ type: ActionTypes.PURCHASE_ITEM, payload: { item } });
        }
    };

    const handleClose = () => {
        dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'game' } });
    };

    return (
        <div style={{
            height: isMobile ? 'auto' : '100%',
            padding: isMobile ? '12px' : '24px',
            display: 'flex',
            flexDirection: 'column',
            overflow: isMobile ? 'visible' : 'hidden'
        }}>
            {/* 标题栏 */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                flexShrink: 0
            }}>
                <h2 style={{
                    fontSize: '22px',
                    fontWeight: '800',
                    color: '#1E293B',
                    margin: 0
                }}>
                    🛒 建材市场
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <span style={{
                        fontSize: '16px',
                        fontWeight: '700',
                        color: '#3B82F6'
                    }}>
                        💰 ¥{money.toLocaleString()}
                    </span>
                    <button
                        onClick={handleClose}
                        style={{
                            padding: '8px 20px',
                            background: '#64748B',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '14px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        返回游戏
                    </button>
                </div>
            </div>

            {/* 商品列表 - 可滚动 */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
                gap: isMobile ? '10px' : '14px',
                overflowY: 'auto',
                flex: 1,
                paddingRight: '4px'
            }}>
                {shopItems.map(item => {
                    const owned = inventory.includes(item.id);
                    const canAfford = money > item.price;
                    const isRepeatable = item.repeatable;
                    const isSemesterRepeatable = item.semesterRepeatable;
                    const effectTags = formatEffectTags(item.effect);

                    // 可重复购买商品已在 inventory 中 → 效果生效中
                    const isActive = isRepeatable && owned;
                    // 学期复购商品：已购本学期
                    const isSemesterOwned = isSemesterRepeatable && owned;
                    // 不可点击
                    const disabled = (!isRepeatable && !isSemesterRepeatable && owned) || isSemesterOwned || !canAfford || isActive;

                    return (
                        <div
                            key={item.id}
                            onClick={() => !disabled && handlePurchase(item)}
                            style={{
                                background: isSemesterOwned ? '#ECFEFF' : (owned && !isRepeatable ? '#F0FDF4' : isActive ? '#FFFBEB' : 'white'),
                                borderRadius: '14px',
                                padding: '18px',
                                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                border: isSemesterOwned
                                    ? '2px solid #0891b2'
                                    : owned && !isRepeatable && !isSemesterRepeatable
                                        ? '2px solid #10B981'
                                        : isActive
                                            ? '2px solid #f59e0b'
                                            : '2px solid #e2e8f0',
                                opacity: disabled ? 0.6 : 1,
                                cursor: disabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease, transform 0.15s ease',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px',
                                position: 'relative',
                            }}
                            onMouseEnter={e => { if (!disabled) e.currentTarget.style.transform = 'translateY(-2px)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; }}
                        >
                            {/* 顶部: 图标 + 名称 + 价格 */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <span style={{
                                    fontSize: '26px',
                                    width: '40px', height: '40px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: '#f8fafc',
                                    borderRadius: '10px',
                                    flexShrink: 0,
                                }}>
                                    {item.icon}
                                </span>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: '15px',
                                        fontWeight: '700',
                                        color: '#1E293B',
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                    }}>
                                        {item.name}
                                    </div>
                                    <span style={{
                                        fontSize: '14px',
                                        fontWeight: '800',
                                        color: canAfford && !disabled ? '#3B82F6' : '#94A3B8',
                                    }}>
                                        ¥{item.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            {/* 描述 */}
                            <p style={{
                                fontSize: '12px',
                                color: '#64748B',
                                margin: 0,
                                lineHeight: '1.6'
                            }}>
                                {item.description}
                            </p>

                            {/* 效果标签 */}
                            {effectTags.length > 0 && (
                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                    {effectTags.map((tag, i) => (
                                        <span key={i} style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: tag.color,
                                            background: `${tag.color}12`,
                                            borderRadius: '6px',
                                            padding: '3px 8px',
                                            border: `1px solid ${tag.color}30`,
                                        }}>
                                            {tag.label} {tag.value}
                                        </span>
                                    ))}
                                    {isRepeatable && (
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: '#6366f1',
                                            background: '#6366f112',
                                            borderRadius: '6px',
                                            padding: '3px 8px',
                                            border: '1px solid #6366f130',
                                        }}>
                                            🔄 可重复购买
                                        </span>
                                    )}
                                    {isSemesterRepeatable && (
                                        <span style={{
                                            fontSize: '11px',
                                            fontWeight: '700',
                                            color: '#0891b2',
                                            background: '#0891b212',
                                            borderRadius: '6px',
                                            padding: '3px 8px',
                                            border: '1px solid #0891b230',
                                        }}>
                                            📅 每学期限购1次
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* 状态标签 */}
                            {owned && !isRepeatable && !isSemesterRepeatable && (
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#10B981'
                                }}>
                                    ✓ 已拥有
                                </span>
                            )}
                            {isSemesterOwned && (
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#0891b2'
                                }}>
                                    ✓ 本学期已购
                                </span>
                            )}
                            {isActive && (
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '700',
                                    color: '#f59e0b'
                                }}>
                                    ⏳ 效果生效中
                                </span>
                            )}
                            {!owned && !canAfford && (
                                <span style={{
                                    fontSize: '12px',
                                    fontWeight: '600',
                                    color: '#EF4444'
                                }}>
                                    金钱不足
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
