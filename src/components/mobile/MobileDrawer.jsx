// 移动端侧边抽屉菜单 — 属性详情 + 导航按钮列表
import React from 'react';
import { useGame } from '../../logic/gameState';
import { getRarity } from '../InitScreen';
import { WEEKLY_LIVING_COST } from '../../logic/calculator';
import ArchivesModal from '../ArchivesModal';
import LeaderboardModal from '../LeaderboardModal';
import SettingsModal from '../SettingsModal';

const IDENTITY_ICONS = {
    'elite-academic': '👑', 'elite-wealthy': '💎', 'elite-middle': '🌟', 'elite-poor': '⚔️',
    'newElite-academic': '🚀', 'newElite-wealthy': '🎩', 'newElite-middle': '📐', 'newElite-poor': '🌊',
    'regular-academic': '🧙', 'regular-wealthy': '🎪', 'regular-middle': '📚', 'regular-poor': '🔨',
    'vocational-academic': '🃏', 'vocational-wealthy': '🏢', 'vocational-middle': '🔧', 'vocational-poor': '💪',
};

const RARITY_BAR = {
    legendary: 'linear-gradient(90deg,#f7971e,#ffd200,#ff6b6b)',
    epic: 'linear-gradient(90deg,#7b2ff7,#f107a3)',
    rare: 'linear-gradient(90deg,#2563eb,#06b6d4)',
    normal: 'linear-gradient(90deg,#059669,#10b981)',
};

export default function MobileDrawer({ open, onClose }) {
    const { state, dispatch } = useGame();
    const { identity, attributes, progress } = state;
    const [showArchives, setShowArchives] = React.useState(false);
    const [showLeaderboard, setShowLeaderboard] = React.useState(false);
    const [showSettings, setShowSettings] = React.useState(false);

    if (!identity) return null;

    const flowScreens = ['review', 'model', 'defense', 'reviewFlow', 'tutorDraw', 'choice'];
    const isInFlow = flowScreens.includes(state.ui.screen);

    const rarity = getRarity(identity.school, identity.family);
    const identityKey = `${identity.school?.id}-${identity.family?.id}`;
    const icon = IDENTITY_ICONS[identityKey] || '🏛️';
    const barGradient = RARITY_BAR[rarity];
    const weeklyLivingCost = identity.family?.weeklyLivingCost || WEEKLY_LIVING_COST;

    const getStressColor = (s) => {
        if (s >= 80) return '#EF4444';
        if (s >= 50) return '#F59E0B';
        return '#10B981';
    };

    const navTo = (screen) => {
        if (!isInFlow) {
            dispatch({ type: 'CHANGE_SCREEN', payload: { screen } });
            onClose();
        }
    };

    const navItems = [
        { icon: '📁', label: '个人作品集', screen: 'portfolio', badge: state.portfolio.length > 0 ? state.portfolio.length : null },
        { icon: state.atlas?.unlocked ? '🌍' : '🔒', label: '建筑朝圣之旅', screen: 'atlas', disabled: !state.atlas?.unlocked },
        { icon: '🏅', label: '竞赛投稿', screen: 'competitions' },
        { icon: '✈️', label: '出国留学', screen: 'studyAbroad' },
        { icon: '👑', label: '申请保研', screen: 'postgrad' },
        { icon: '🤝', label: '实习与工作', screen: 'jobSearch' },
        { icon: '📚', label: '参加考研', screen: 'examGrad' },
        { icon: '🍵', label: '考公选调', screen: 'examCivil' },
    ];

    const menuBtnStyle = (disabled) => ({
        width: '100%',
        padding: '14px 16px',
        background: disabled ? '#F1F5F9' : 'white',
        color: disabled ? '#94A3B8' : '#334155',
        border: 'none',
        borderRadius: '12px',
        fontWeight: '700',
        fontSize: '14px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex', alignItems: 'center', gap: '10px',
        textAlign: 'left',
        opacity: disabled ? 0.5 : 1,
    });

    return (
        <>
            {/* 遮罩层 */}
            {open && (
                <div
                    onClick={onClose}
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 9500,
                        transition: 'opacity 0.3s',
                    }}
                />
            )}

            {/* 抽屉面板 */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0, bottom: 0,
                width: '80vw', maxWidth: '320px',
                background: '#F8FAFC',
                zIndex: 9600,
                transform: open ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                overflowY: 'auto',
                display: 'flex', flexDirection: 'column',
                boxShadow: open ? '4px 0 20px rgba(0,0,0,0.15)' : 'none',
            }}>
                {/* 稀有度色条 */}
                <div style={{ height: '4px', background: barGradient, flexShrink: 0 }} />

                {/* 身份信息 */}
                <div style={{ padding: '20px 16px 12px', textAlign: 'center', borderBottom: '1px solid #E2E8F0' }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
                    <div style={{ fontWeight: '900', fontSize: '16px', color: '#1E293B', marginBottom: '6px' }}>
                        {identity.narrative?.title}
                    </div>
                    <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#374151', background: '#f1f5f9', borderRadius: '6px', padding: '2px 6px' }}>
                            🏫 {identity.school?.name}
                        </span>
                        <span style={{ fontSize: '11px', fontWeight: '800', color: '#374151', background: '#f1f5f9', borderRadius: '6px', padding: '2px 6px' }}>
                            👨‍👩‍👧 {identity.family?.name}
                        </span>
                    </div>
                </div>

                {/* 属性区 */}
                <div style={{ padding: '12px 16px', borderBottom: '1px solid #E2E8F0' }}>
                    <AttrBar label="设计" value={Math.floor(attributes.design)} max={200} color="#3B82F6" />
                    <AttrBar label="软件" value={Math.floor(attributes.software)} max={200} color="#8B5CF6" />
                    <AttrBar label="压力" value={Math.floor(attributes.stress)} max={100} color={getStressColor(attributes.stress)} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>💰 金钱</span>
                        <span style={{ fontSize: '14px', fontWeight: '800', color: '#059669', fontFamily: 'var(--font-mono)' }}>
                            ¥{Math.floor(attributes.money).toLocaleString()}
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginLeft: '4px' }}>
                                (-¥{weeklyLivingCost}/周)
                            </span>
                        </span>
                    </div>
                </div>

                {/* 导航列表 */}
                <div style={{ padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: '6px', flex: 1 }}>
                    {navItems.map(item => (
                        <button
                            key={item.screen}
                            onClick={() => !item.disabled && navTo(item.screen)}
                            style={menuBtnStyle(isInFlow || item.disabled)}
                        >
                            <span style={{ fontSize: '18px' }}>{item.icon}</span>
                            <span style={{ flex: 1 }}>{item.label}</span>
                            {item.badge && (
                                <span style={{
                                    background: '#F59E0B', color: 'white', fontSize: '11px',
                                    padding: '1px 6px', borderRadius: '10px', fontWeight: '800',
                                }}>
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}

                    {/* 分隔线 */}
                    <div style={{ height: '1px', background: '#E2E8F0', margin: '4px 0' }} />

                    {/* 归档/排行/设置 */}
                    <button onClick={() => setShowArchives(true)} style={menuBtnStyle(false)}>
                        <span style={{ fontSize: '18px' }}>🏛️</span>
                        <span>档案馆</span>
                    </button>
                    <button onClick={() => setShowLeaderboard(true)} style={menuBtnStyle(false)}>
                        <span style={{ fontSize: '18px' }}>🏆</span>
                        <span>排行榜</span>
                    </button>
                    <button onClick={() => setShowSettings(true)} style={menuBtnStyle(false)}>
                        <span style={{ fontSize: '18px' }}>⚙️</span>
                        <span>设置</span>
                    </button>
                </div>
            </div>

            {/* 弹窗渲染 */}
            {showArchives && <ArchivesModal onClose={() => setShowArchives(false)} />}
            {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </>
    );
}

// 紧凑属性条
function AttrBar({ label, value, max, color }) {
    const pct = Math.min((value / max) * 100, 100);
    return (
        <div style={{ marginBottom: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: '#64748B' }}>{label}</span>
                <span style={{ fontSize: '12px', fontWeight: '800', color, fontFamily: 'var(--font-mono)' }}>{value}/{max}</span>
            </div>
            <div style={{ height: '6px', background: '#E2E8F0', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px', transition: 'width 0.3s' }} />
            </div>
        </div>
    );
}
