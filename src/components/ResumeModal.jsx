// 个人简历模态窗 - 浅色玻璃现代风格 + 动态介绍

import React, { useMemo } from 'react';
import { useGame } from '../logic/gameState';
import { internships } from '../data/employment';

export default function ResumeModal({ onClose }) {
    const { state } = useGame();
    const year = state.progress.year;
    const yearLabel = ['一', '二', '三', '四', '五'][year - 1] || year;
    const school = state.identity?.school?.name || '某建筑大学';
    const attrs = state.attributes;
    const bestIelts = state.bestIelts || 0;

    // 竞赛获奖记录
    const awards = (state.portfolio || []).filter(p => p.submissionRecord?.won);

    // 实习经历
    const internHistory = (state.internHistory || []).map(entry => {
        // 如果是新版带年份结构：{ id: 'design_institute', year: 3 }
        // 旧版仅存储 ID：'design_institute'
        const id = typeof entry === 'string' ? entry : entry.id;
        const entryYear = typeof entry === 'string' ? '' : `大${['一', '二', '三', '四', '五'][entry.year - 1] || entry.year} · `;

        const intern = internships.find(i => i.id === id);
        return intern ? { name: entryYear + intern.name, icon: intern.icon, type: intern.type } : { name: entryYear + id, icon: '💼', type: '未知' };
    });

    // 前3作品
    const topWorks = [...(state.portfolio || [])].sort((a, b) => (b.qualityScore || 0) - (a.qualityScore || 0)).slice(0, 3);

    // 动态自我介绍
    const bioText = useMemo(() => {
        let texts = [];
        if (topWorks.length > 0) {
            texts.push(`主导过《${topWorks[0].title || topWorks[0].name}》等高分设计项目。`);
        }
        if (awards.length > 0) {
            texts.push(`在 ${awards[0].submissionRecord.compName} 等竞赛中荣获佳绩。`);
        }

        const diff = attrs.design - attrs.software;
        if (diff > 50) {
            texts.push(`偏向于方案推敲与空间生成的建筑学子。`);
        } else if (diff < -50) {
            texts.push(`精通多种工作流与软件表达的技术型人才。`);
        } else {
            texts.push(`综合能力均衡，兼备设计核心思维与软件落地能力。`);
        }

        if (internHistory.length > 0) {
            texts.push(`曾在 ${internHistory[0].name.replace(/^大[一二三四五] · /, '')} 等机构实习，具备实战经验。`);
        } else {
            texts.push(`对职业生涯充满热情，渴望在实践中不断成长。`);
        }

        return texts.join(' ');
    }, [topWorks, awards, attrs, internHistory]);

    // 随机占位头像（基于存档时间或一个伪随机种子，这里简单用 emoji 组合）
    const avatarSeed = (state.progress.year * 7 + state.progress.week * 13) % 4;
    const avatars = ['🧑‍💻', '👩‍💻', '🧑‍🎨', '👩‍🎨'];
    const avatar = avatars[avatarSeed];

    const barStyle = (value, max, color) => ({
        height: '8px',
        borderRadius: '4px',
        background: '#E2E8F0',
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
    });

    const fillStyle = (value, max, color) => ({
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: `${Math.min(100, (value / max) * 100)}%`,
        background: color,
        borderRadius: '4px',
        transition: 'width 0.5s ease',
    });

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            {/* 卡片主体：浅色玻璃与平滑阴影 */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(20px)',
                padding: '0',
                borderRadius: '24px',
                width: '90%',
                maxWidth: '650px',
                maxHeight: '85vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.4) inset',
                color: '#1E293B',
                position: 'relative'
            }}>
                {/* 装饰性背景渐变斑块 */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '160px', background: 'linear-gradient(135deg, #E0F2FE 0%, #DBEAFE 100%)', zIndex: 0, borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}></div>

                {/* 头部区（头像 + 姓名信息位于渐变底色上） */}
                <div style={{ position: 'relative', zIndex: 1, padding: '32px 32px 24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                            {/* 头像 */}
                            <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '2px solid rgba(255,255,255,0.8)' }}>
                                {avatar}
                            </div>
                            <div>
                                <h2 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 4px 0', color: '#0F172A', letterSpacing: '-0.5px' }}>个人简历</h2>
                                <div style={{ fontSize: '13px', color: '#475569', fontWeight: '600', letterSpacing: '1px' }}>CURRICULUM VITAE</div>
                            </div>
                        </div>
                        <button onClick={onClose} style={{ background: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', cursor: 'pointer', color: '#64748B', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>✖</button>
                    </div>
                </div>

                <div style={{ padding: '8px 32px 32px', position: 'relative', zIndex: 1 }}>

                    {/* 个人摘要（动态介绍） */}
                    <div style={{ marginBottom: '28px', background: 'linear-gradient(to right, #F8FAFC, #FFFFFF)', padding: '16px 20px', borderRadius: '16px', border: '1px solid #E2E8F0', borderLeft: '4px solid #3B82F6', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                        <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '800', letterSpacing: '2px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>💡</span> 个人摘要
                        </div>
                        <div style={{ fontSize: '14px', color: '#334155', lineHeight: '1.6', fontWeight: '500' }}>
                            {bioText}
                        </div>
                    </div>

                    {/* 基本信息 */}
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' }}>基本信息</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                <div style={{ fontSize: '12px', color: '#64748B' }}>在读年级</div>
                                <div style={{ fontSize: '18px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>大{yearLabel}</div>
                            </div>
                            <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '12px', border: '1px solid #F1F5F9' }}>
                                <div style={{ fontSize: '12px', color: '#64748B' }}>就读院校</div>
                                <div style={{ fontSize: '16px', fontWeight: '800', color: '#0F172A', marginTop: '4px' }}>{school}</div>
                            </div>
                        </div>
                    </div>

                    {/* 技能属性 */}
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' }}>专业技能</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#FFFFFF', padding: '20px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                            {[
                                { label: '设计能力', value: attrs.design, max: 300, color: '#3B82F6' },
                                { label: '软件能力', value: attrs.software, max: 300, color: '#8B5CF6' },
                            ].map(({ label, value, max, color }) => (
                                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <span style={{ fontSize: '13px', color: '#475569', width: '70px', flexShrink: 0, fontWeight: '600' }}>{label}</span>
                                    <div style={barStyle(value, max, color)}>
                                        <div style={fillStyle(value, max, color)} />
                                    </div>
                                    <span style={{ fontSize: '14px', color: '#0F172A', width: '40px', textAlign: 'right', fontWeight: '800' }}>{Math.floor(value)}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 雅思 */}
                    {bestIelts > 0 && (
                        <div style={{ marginBottom: '28px' }}>
                            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' }}>语言成绩</div>
                            <div style={{ background: 'linear-gradient(to right, #F0FDF4, #FFFFFF)', padding: '16px 20px', borderRadius: '16px', border: '1px solid #DCFCE7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#166534', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>🇬🇧 IELTS Academic</span>
                                <span style={{ fontSize: '24px', fontWeight: '900', color: bestIelts >= 6.5 ? '#059669' : '#D97706' }}>{bestIelts.toFixed(1)}</span>
                            </div>
                        </div>
                    )}

                    {/* 竞赛获奖 */}
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' }}>竞赛获奖</div>
                        {awards.length === 0 ? (
                            <div style={{ color: '#94A3B8', fontSize: '13px', fontStyle: 'italic', background: '#F8FAFC', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>暂无获奖记录</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {awards.map((p, i) => (
                                    <div key={i} style={{ background: '#FFFFFF', padding: '14px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <span style={{ color: '#334155', fontSize: '14px', fontWeight: '600' }}>《{p.title || p.name}》</span>
                                        <span style={{ color: '#059669', fontSize: '13px', fontWeight: '700', background: '#ECFDF5', padding: '4px 10px', borderRadius: '20px' }}>
                                            {p.submissionRecord.compName} · {p.submissionRecord.awardLabel}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 实习经历 */}
                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' }}>实习经历</div>
                        {internHistory.length === 0 ? (
                            <div style={{ color: '#94A3B8', fontSize: '13px', fontStyle: 'italic', background: '#F8FAFC', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>暂无实习经历</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {internHistory.map((intern, i) => (
                                    <div key={i} style={{ background: '#FFFFFF', padding: '16px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <span style={{ fontSize: '24px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{intern.icon}</span>
                                        <span style={{ color: '#1E293B', fontSize: '15px', fontWeight: '700' }}>{intern.name}</span>
                                        <span style={{ fontSize: '12px', color: '#64748B', marginLeft: 'auto', background: '#F1F5F9', padding: '4px 10px', borderRadius: '20px', fontWeight: '600' }}>{intern.type}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 代表作品 */}
                    <div>
                        <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: '800', letterSpacing: '2px', marginBottom: '12px' }}>代表作品 (TOP 3)</div>
                        {topWorks.length === 0 ? (
                            <div style={{ color: '#94A3B8', fontSize: '13px', fontStyle: 'italic', background: '#F8FAFC', padding: '16px', borderRadius: '12px', textAlign: 'center' }}>作品集为空</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {topWorks.map((w, i) => (
                                    <div key={i} style={{ background: '#FFFFFF', padding: '16px 18px', borderRadius: '14px', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '18px' }}>{['🥇', '🥈', '🥉'][i]}</span>
                                            <span style={{ color: '#1E293B', fontSize: '14px', fontWeight: '700' }}>《{w.title || w.name}》</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: (w.grade || '').toUpperCase() === 'S' ? '#F59E0B' : (w.grade || '').toUpperCase() === 'A' ? '#F97316' : '#64748B' }}>
                                                {(w.grade || '').toUpperCase()}级
                                            </span>
                                            <span style={{ fontSize: '12px', color: '#64748B', fontWeight: '600', background: '#F1F5F9', padding: '2px 8px', borderRadius: '12px' }}>
                                                {w.qualityScore}分
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
