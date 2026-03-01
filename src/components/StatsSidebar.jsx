// 左侧个人看板组件

import React from 'react';
import { useGame } from '../logic/gameState';
import { getRarity } from './InitScreen';

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
    const { state } = useGame();
    const { identity, attributes, progress } = state;

    if (!identity) return null;

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
                    <div className="attribute-value">¥ {Math.floor(attributes.money).toLocaleString()}</div>
                </div>
            </div>

            {/* 时间看板 */}
            <div className="time-card">
                <div className="time-display">
                    本科第{progress.year}学年 · {progress.semester % 2 === 1 ? '上学期' : '下学期'}
                </div>
                <div className="time-label">
                    Week {progress.week} / 12
                </div>
                <div className="time-label" style={{ marginTop: '8px', fontSize: '11px' }}>
                    总计: {(progress.semester - 1) * 12 + progress.week} / 120 周
                </div>
            </div>
        </div>
    );
}
