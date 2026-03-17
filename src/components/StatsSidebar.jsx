// 左侧个人看板组件

import React from 'react';
import { useGame } from '../logic/gameState';
import { getRarity } from './InitScreen';
import { WEEKLY_LIVING_COST } from '../logic/calculator';

// 按学校+家庭背景映射头像图标
const IDENTITY_ICONS = {
    'elite-academic': '👑',
    'elite-wealthy': '💎',
    'elite-middle': '🌟',
    'elite-poor': '⚔️',
    'newElite-academic': '🚀',
    'newElite-wealthy': '🎩',
    'newElite-middle': '📐',
    'newElite-poor': '🌊',
    'regular-academic': '🧙',
    'regular-wealthy': '🎪',
    'regular-middle': '📚',
    'regular-poor': '🔨',
    'vocational-academic': '🃏',
    'vocational-wealthy': '🏢',
    'vocational-middle': '🔧',
    'vocational-poor': '💪',
};

// 稀有度对应的渐变色条
const RARITY_BAR = {
    legendary: 'linear-gradient(90deg,#f7971e,#ffd200,#ff6b6b)',
    epic: 'linear-gradient(90deg,#7b2ff7,#f107a3)',
    rare: 'linear-gradient(90deg,#2563eb,#06b6d4)',
    normal: 'linear-gradient(90deg,#059669,#10b981)',
};

export default function StatsSidebar() {
    const { state, dispatch } = useGame();
    const { identity, attributes, progress } = state;

    if (!identity) return null;

    // 流程保护：评图/模型/汇报/导师抽取/拉样选择等流程进行中时，禁止侧边栏导航
    const flowScreens = ['review', 'model', 'defense', 'reviewFlow', 'tutorDraw', 'choice'];
    const isInFlow = flowScreens.includes(state.ui.screen);

    const getStressColor = (stress) => {
        if (stress >= 80) return 'stress-high';
        if (stress >= 50) return 'stress-mid';
        return 'stress-low';
    };

    const rarity = getRarity(identity.school, identity.family);
    const identityKey = `${identity.school?.id}-${identity.family?.id}`;
    const icon = IDENTITY_ICONS[identityKey] || '🏛️';
    const barGradient = RARITY_BAR[rarity];



    return (
        <div className="stats-sidebar">
            {/* Profile卡片 */}
            <div className="profile-card" style={{ position: 'relative' }}>
                {/* 稀有度色条 */}
                <div style={{
                    height: '5px', background: barGradient,
                    borderRadius: '16px 16px 0 0',
                    margin: '-24px -24px 16px -24px'
                }} />

                {/* 图标 */}
                <div className="profile-icon" style={{ fontSize: '36px', marginBottom: '10px' }}>
                    {icon}
                </div>

                {/* 身份标题 */}
                <div className="profile-title" style={{ fontSize: '20px', fontWeight: '900', marginBottom: '8px' }}>
                    {identity.narrative?.title}
                </div>

                {/* 学校 · 家庭（黑体加粗）*/}
                <div style={{
                    display: 'flex', gap: '6px', flexWrap: 'wrap',
                    marginBottom: '10px', justifyContent: 'center'
                }}>
                    <span style={{
                        fontSize: '13px', fontWeight: '800', color: '#374151',
                        background: '#f1f5f9', borderRadius: '6px',
                        padding: '2px 8px',
                    }}>
                        🏫 {identity.school?.name}
                    </span>
                    <span style={{
                        fontSize: '13px', fontWeight: '800', color: '#374151',
                        background: '#f1f5f9', borderRadius: '6px',
                        padding: '2px 8px',
                    }}>
                        👨‍👩‍👧 {identity.family?.name}
                    </span>
                </div>

                {/* 介绍词（浅色小字）*/}
                <p style={{
                    fontSize: '12px', color: '#94a3b8', lineHeight: '1.7',
                    fontStyle: 'italic', margin: 0,
                    textAlign: 'left',
                    borderLeft: '2px solid #e2e8f0',
                    paddingLeft: '8px',
                }}>
                    {identity.narrative?.description}
                </p>
            </div>

            {/* 属性卡片 */}
            <div className="attributes-card">
                {/* 设计能力 */}
                <div className="attribute-item">
                    <div className="attribute-label">设计能力 Design</div>
                    <div className="attribute-value">{Math.floor(attributes.design)} / 200</div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${(attributes.design / 200) * 100}%` }}
                        />
                    </div>
                </div>

                {/* 软件能力 */}
                <div className="attribute-item">
                    <div className="attribute-label">软件能力 Software</div>
                    <div className="attribute-value">{Math.floor(attributes.software)} / 200</div>
                    <div className="progress-bar-container">
                        <div
                            className="progress-bar"
                            style={{ width: `${(attributes.software / 200) * 100}%` }}
                        />
                    </div>
                </div>

                {/* 压力值 */}
                <div className="attribute-item">
                    <div className="attribute-label">压力值 Stress</div>
                    <div className="attribute-value">{Math.floor(attributes.stress)}</div>
                    <div className="progress-bar-container">
                        <div
                            className={`progress-bar ${getStressColor(attributes.stress)}`}
                            style={{ width: `${Math.min((attributes.stress / 100) * 100, 100)}%` }}
                        />
                    </div>
                </div>

                {/* 金钱 */}
                <div className="attribute-item">
                    <div className="attribute-label">金钱 Money</div>
                    {(() => {
                        const weeklyLivingCost = identity.family?.weeklyLivingCost || WEEKLY_LIVING_COST;
                        const isLowMoney = attributes.money > 0 && attributes.money < weeklyLivingCost * 2;
                        return (
                            <div className="attribute-value" style={{
                                color: isLowMoney ? '#EF4444' : undefined,
                                fontWeight: isLowMoney ? '900' : undefined,
                            }}>
                                {isLowMoney && <span style={{ marginRight: '4px' }}>⚠️</span>}
                                ¥ {Math.floor(attributes.money).toLocaleString()}
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* 作品集与分流选项包裹区（用于引导定位） */}
            <div className="sidebar-bottom-actions" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* 作品集入口 */}
                <button
                    onClick={() => !isInFlow && dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'portfolio' } })}
                    disabled={isInFlow}
                    style={{
                        width: '100%',
                        padding: '20px',
                        background: 'white',
                        color: '#334155', // 深灰字
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '800',
                        fontSize: '15px',
                        cursor: isInFlow ? 'not-allowed' : 'pointer',
                        opacity: isInFlow ? 0.5 : 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                        transition: 'all 0.2s ease',
                        marginTop: '0' // 依靠 flex gap 保证等距
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)'; }}
                >
                    <span style={{ fontSize: '18px' }}>📁</span>
                    <span>个人作品集</span>
                    {state.portfolio.length > 0 && (
                        <span style={{
                            background: '#F59E0B',
                            color: 'white',
                            fontSize: '12px',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            marginLeft: '4px'
                        }}>
                            {state.portfolio.length}
                        </span>
                    )}
                </button>

                {/* 建筑朝圣之旅入口 — 始终显示，大二解锁 */}
                {(() => {
                    const isUnlocked = state.atlas?.unlocked;
                    const isDisabled = !isUnlocked || isInFlow;
                    return (
                        <button
                            onClick={() => isUnlocked && !isInFlow && dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'atlas' } })}
                            disabled={isDisabled}
                            style={{
                                width: '100%',
                                padding: '20px',
                                background: isUnlocked ? 'white' : '#F3F4F6',
                                color: isUnlocked ? '#334155' : '#9CA3AF',
                                border: 'none',
                                borderRadius: '16px',
                                fontWeight: '800',
                                fontSize: '15px',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                            }}
                            onMouseOver={(e) => {
                                if (!isDisabled) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                                }
                            }}
                            onMouseOut={(e) => {
                                if (!isDisabled) {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                                }
                            }}
                        >
                            <span style={{ fontSize: '18px', opacity: isUnlocked ? 1 : 0.5 }}>
                                {isUnlocked ? '🌍' : '🔒'}
                            </span>
                            <span>
                                建筑朝圣之旅
                            </span>

                            {isUnlocked && state.atlas?.currentExpedition && (
                                <span style={{
                                    background: '#DBEAFE',
                                    borderRadius: '10px',
                                    padding: '2px 6px',
                                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '12px',
                                    marginLeft: '4px'
                                }}>
                                    ✈️
                                </span>
                            )}

                            {!isUnlocked && (
                                <span style={{
                                    position: 'absolute',
                                    top: '50%', right: '16px',
                                    transform: 'translateY(-50%)',
                                    background: '#E5E7EB',
                                    color: '#6B7280',
                                    fontSize: '12px',
                                    padding: '4px 8px',
                                    borderRadius: '12px',
                                    fontWeight: '700'
                                }}>大二解锁</span>
                            )}
                        </button>
                    );
                })()}

                {/* 毕业分流选项 (栅格布局，一排两列) */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '8px',
                    marginTop: '0'
                }}>
                    {/* 竞赛投稿 */}
                    <GraduationOptionButton
                        icon="🏅" label="竞赛投稿"
                        isActive={!isInFlow}
                        onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'competitions' } })}
                    />

                    {/* 国外留学 (大一激活雅思考试，大五激活申请) */}
                    <GraduationOptionButton
                        icon="✈️" label="出国留学"
                        isActive={!isInFlow}
                        onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'studyAbroad' } })}
                    />

                    {/* 申请保研 (大四结束，即第4年12周后激活) */}
                    <GraduationOptionButton
                        icon="👑" label="申请保研"
                        isActive={!isInFlow}
                        onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'postgrad' } })}
                    />

                    {/* 实习与求职 (全年级激活寻找实习，大五激活全职) */}
                    <GraduationOptionButton
                        icon="🤝" label="实习与工作"
                        isActive={!isInFlow}
                        onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'jobSearch' } })}
                    />

                    {/* 参加考研 (大五激活) */}
                    <GraduationOptionButton
                        icon="📚" label="参加考研"
                        isActive={!isInFlow}
                        onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'examGrad' } })}
                    />

                    {/* 决定考公 (大五激活) */}
                    <GraduationOptionButton
                        icon="🍵" label="考公选调"
                        isActive={!isInFlow}
                        onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'examCivil' } })}
                    />
                </div>
            </div>

        </div>
    );
}

// 分流按钮子组件
function GraduationOptionButton({ icon, label, isActive, onClick }) {
    return (
        <button
            onClick={isActive ? onClick : undefined}
            style={{
                padding: '12px 6px',
                background: isActive ? 'white' : '#E2E8F0',
                color: isActive ? '#334155' : '#94A3B8',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '13px',
                cursor: isActive ? 'pointer' : 'not-allowed',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => { if (isActive) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 10px rgba(0,0,0,0.08)'; } }}
            onMouseOut={(e) => { if (isActive) { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'; } }}
        >
            <span style={{ fontSize: '20px', filter: isActive ? 'none' : 'grayscale(100%) opacity(0.5)' }}>{icon}</span>
            <span>{label}</span>
        </button>
    );
}
