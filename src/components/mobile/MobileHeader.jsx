// 移动端顶部导航栏 — 属性文字标签 + 菜单按钮指引
import React from 'react';
import { useGame } from '../../logic/gameState';
import { WEEKLY_LIVING_COST } from '../../logic/calculator';

export default function MobileHeader({ onMenuToggle, highlightMenu }) {
    const { state } = useGame();
    const { identity, attributes, progress } = state;
    if (!identity) return null;

    const yearLabels = ['一', '二', '三', '四', '五'];
    const yearStr = `大${yearLabels[progress.year - 1] || progress.year}`;
    const weeklyLivingCost = identity.family?.weeklyLivingCost || WEEKLY_LIVING_COST;

    const getStressColor = (s) => {
        if (s >= 80) return '#EF4444';
        if (s >= 50) return '#F59E0B';
        return '#10B981';
    };

    return (
        <>
            {/* 呼吸灯动画 */}
            {highlightMenu && (
                <style>{`
                    @keyframes menuPulse {
                        0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.6); }
                        50% { box-shadow: 0 0 0 10px rgba(59,130,246,0); }
                    }
                `}</style>
            )}
            <div style={{
                position: 'fixed', top: 0, left: 0, right: 0,
                zIndex: 9000,
                background: 'white',
                borderBottom: '1px solid #E2E8F0',
                padding: '8px 10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            }}>
                {/* 第一行：菜单 + 时间 + 属性概要 */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                }}>
                    {/* 菜单按钮 + 文字 */}
                    <button
                        onClick={onMenuToggle}
                        style={{
                            background: highlightMenu ? '#3B82F6' : 'none',
                            border: highlightMenu ? '2px solid #2563EB' : 'none',
                            borderRadius: '8px',
                            fontSize: '18px',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            display: 'flex', alignItems: 'center', gap: '4px',
                            color: highlightMenu ? 'white' : '#334155',
                            animation: highlightMenu ? 'menuPulse 1.5s infinite' : 'none',
                            transition: 'all 0.3s',
                        }}
                    >
                        <span>☰</span>
                        <span style={{ fontSize: '12px', fontWeight: '700' }}>菜单</span>
                    </button>

                    {/* 分隔 */}
                    <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />

                    {/* 时间 */}
                    <div style={{
                        fontWeight: '800', fontSize: '14px', color: '#1E293B',
                        whiteSpace: 'nowrap',
                    }}>
                        {yearStr} W{progress.week}
                    </div>

                    {/* 分隔 */}
                    <div style={{ width: '1px', height: '24px', background: '#E2E8F0' }} />

                    {/* 属性紧凑行 */}
                    <div style={{
                        display: 'flex', gap: '8px', flex: 1,
                        overflow: 'hidden', alignItems: 'center',
                    }}>
                        <AttrChip label="设计" value={Math.floor(attributes.design)} color="#3B82F6" />
                        <AttrChip label="软件" value={Math.floor(attributes.software)} color="#8B5CF6" />
                        <AttrChip label="压力" value={Math.floor(attributes.stress)} color={getStressColor(attributes.stress)} />
                    </div>
                </div>

                {/* 第二行：金钱 */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    marginTop: '4px', gap: '4px',
                }}>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>💰 金钱</span>
                    <span style={{ fontSize: '14px', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                        ¥{Math.floor(attributes.money).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                        (-{weeklyLivingCost}/w)
                    </span>
                </div>

                {/* 高亮提示文字 */}
                {highlightMenu && (
                    <div style={{
                        textAlign: 'center', fontSize: '11px', fontWeight: '700',
                        color: '#3B82F6', marginTop: '2px',
                        animation: 'menuPulse 1.5s infinite',
                    }}>
                        👆 点击菜单查看更多选项
                    </div>
                )}
            </div>
        </>
    );
}

// 紧凑属性标签
function AttrChip({ label, value, color }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: '11px', fontWeight: '700', color: '#94A3B8' }}>{label}</span>
            <span style={{ fontSize: '14px', fontWeight: '800', color, fontFamily: 'var(--font-mono)' }}>
                {value}
            </span>
        </div>
    );
}
