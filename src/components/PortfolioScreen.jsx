import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { getPortfolioData, getTutorPortfolioComment } from '../data/portfolioCorpus';

export default function PortfolioScreen() {
    const { state, dispatch } = useGame();
    const { portfolio, portfolioScore } = state;
    const [selectedProject, setSelectedProject] = useState(null);

    // 辅助函数：根据等级返回视觉颜色
    const getGradeColor = (grade) => {
        if (grade === 'S') return '#F59E0B'; // 卓越金
        if (grade === 'A') return '#8B5CF6'; // 优秀紫
        if (grade === 'B') return '#3B82F6'; // 良好蓝
        return '#64748B'; // 默认灰
    };

    // 宫格卡片组件
    const ProjectCard = ({ project }) => {
        const { params } = getPortfolioData(project.projectId);
        return (
            <div
                style={{
                    background: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    cursor: 'pointer',
                    border: '1px solid #E2E8F0',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                }}
                onClick={() => setSelectedProject(project)}
            >
                {/* 顶部图片占位/缩略图图 */}
                <div style={{
                    width: '100%',
                    height: '140px',
                    background: '#F8FAFC',
                    backgroundImage: `url(/portfolio/${project.projectId}.png), url(/portfolio/y1p1.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.6) 100%)' }} />
                    <span style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '16px',
                        color: 'white',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        letterSpacing: '1px'
                    }}>
                        {params.tags}
                    </span>
                    <div style={{
                        position: 'absolute',
                        top: '12px', right: '12px',
                        background: getGradeColor(project.grade),
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '900',
                        fontSize: '18px',
                        fontFamily: 'serif',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}>
                        {project.grade}
                    </div>
                </div>

                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '8px' }}>
                        {project.semester}
                    </span>
                    <h3 style={{
                        margin: '0 0 12px 0',
                        fontSize: '20px',
                        fontWeight: '900',
                        color: '#1E293B',
                        lineHeight: '1.3'
                    }}>
                        {project.title}
                    </h3>
                    <div style={{
                        marginTop: 'auto',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '12px',
                        color: '#64748B',
                        borderTop: '1px dashed #E2E8F0',
                        paddingTop: '12px'
                    }}>
                        <span>导师: {project.tutorName}</span>
                        <span style={{ fontWeight: 'bold', color: '#475569' }}>Q: {project.qualityScore}</span>
                    </div>
                </div>
            </div>
        );
    };

    // 详情大展板组件
    const DetailViewer = () => {
        if (!selectedProject) return null;

        const { text, params } = getPortfolioData(selectedProject.projectId);
        const comment = getTutorPortfolioComment(selectedProject.tutorId, selectedProject.grade);

        return (
            <div style={{
                position: 'fixed',
                top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(15, 23, 42, 0.85)',
                backdropFilter: 'blur(12px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px'
            }}>
                <div style={{
                    background: 'white',
                    width: '100%',
                    maxWidth: '1400px',
                    height: '100%',
                    maxHeight: '850px',
                    borderRadius: '12px',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    flexDirection: 'row',
                    overflow: 'hidden',
                    position: 'relative',
                    fontFamily: 'sans-serif'
                }}>
                    {/* 关闭按钮 */}
                    <button
                        onClick={() => setSelectedProject(null)}
                        style={{
                            position: 'absolute',
                            top: '24px', right: '32px',
                            background: 'rgba(255,255,255,0.8)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '48px', height: '48px',
                            fontSize: '32px',
                            color: '#1E293B',
                            cursor: 'pointer',
                            zIndex: 20,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    >×</button>

                    {/* 左侧文字与参数面板 (35%) */}
                    <div style={{
                        width: '35%',
                        padding: '50px',
                        display: 'flex',
                        flexDirection: 'column',
                        background: 'white',
                        borderRight: '1px solid #E2E8F0',
                        zIndex: 10,
                        overflowY: 'auto'
                    }}>
                        <div style={{ fontSize: '12px', color: '#94A3B8', letterSpacing: '4px', textTransform: 'uppercase', marginBottom: '8px' }}>
                            Project No. {selectedProject.id.slice(-6)} · {selectedProject.semester}
                        </div>
                        <h1 style={{
                            fontSize: '40px',
                            fontWeight: '900',
                            color: '#0F172A',
                            lineHeight: '1.2',
                            margin: '0 0 32px 0'
                        }}>
                            {selectedProject.title}
                        </h1>

                        <div style={{ display: 'flex', gap: '32px', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #E2E8F0' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Design Studio</div>
                                <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#334155' }}>
                                    {selectedProject.tutorName}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Evaluation</div>
                                <div style={{ fontSize: '20px', fontWeight: '900', color: getGradeColor(selectedProject.grade), lineHeight: '1.2' }}>
                                    GRADE {selectedProject.grade}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px', textTransform: 'uppercase' }}>Quality</div>
                                <div style={{ fontSize: '20px', fontWeight: '900', color: '#0F172A', lineHeight: '1.2' }}>{selectedProject.qualityScore}</div>
                            </div>
                        </div>

                        {/* 建筑学参数区 */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '40px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Site Area (基地面积)</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', fontFamily: 'monospace' }}>{params.siteArea}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Gross Flr Area (总建面)</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', fontFamily: 'monospace' }}>{params.gfa}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>FAR (容积率)</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155', fontFamily: 'monospace' }}>{params.far}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase' }}>Typology (类型)</div>
                                <div style={{ fontSize: '14px', fontWeight: '600', color: '#334155' }}>{params.tags}</div>
                            </div>
                        </div>

                        {/* 设计说明框 */}
                        <div style={{ marginBottom: '40px' }}>
                            <h2 style={{ margin: '0 0 16px 0', fontSize: '14px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: '#0F172A' }}>
                                Architecture Narrative
                            </h2>
                            <p style={{ fontSize: '15px', lineHeight: '1.8', color: '#475569', textAlign: 'justify' }}>
                                {text}
                            </p>
                        </div>

                        {/* 导师评语框 */}
                        <div style={{ marginTop: 'auto', background: '#FEF3C7', padding: '24px', borderRadius: '8px', borderLeft: '4px solid #F59E0B' }}>
                            <h2 style={{ margin: '0 0 12px 0', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', color: '#B45309' }}>
                                Jury Comments · {selectedProject.tutorName}
                            </h2>
                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.7', color: '#92400E', fontStyle: 'italic' }}>
                                "{comment}"
                            </p>
                        </div>
                    </div>

                    {/* 右侧：纯白底图纸全景展示区 (65%) */}
                    <div style={{
                        width: '65%',
                        position: 'relative',
                        background: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '24px'
                    }}>
                        <img
                            src={`/portfolio/${selectedProject.projectId}.png`}
                            alt="Blueprint"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain', // 确保无裁剪完全展示
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/portfolio/y1p1.png'; // 兜底加载默认图
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div style={{ padding: '40px', width: '100%', height: '100%', overflowY: 'auto', background: '#F0F4F8' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

                {/* 顶部标题栏 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                    <div>
                        <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '900', color: '#1E293B' }}>个人作品集</h1>
                        <div style={{ fontSize: '15px', color: '#64748B', letterSpacing: '1px' }}>PERSONAL PORTFOLIO ARCHIVE</div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', marginBottom: '4px', letterSpacing: '1px' }}>Total Rating Score</div>
                        <div style={{ fontSize: '32px', fontWeight: '900', color: '#3B82F6' }}>{Math.floor(portfolioScore)}</div>
                    </div>
                </div>

                {/* 按钮区 */}
                <button
                    onClick={() => dispatch({ type: 'CHANGE_SCREEN', payload: { screen: 'game' } })}
                    style={{
                        padding: '12px 28px',
                        background: 'white',
                        border: '1px solid #CBD5E1',
                        borderRadius: '30px',
                        cursor: 'pointer',
                        fontWeight: '800',
                        color: '#475569',
                        marginBottom: '32px',
                        fontSize: '14px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                >
                    ← 返回主界面
                </button>

                {/* 宫格展示区 */}
                {portfolio.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '120px 0',
                        color: '#94A3B8',
                        background: 'white',
                        borderRadius: '16px',
                        border: '2px dashed #E2E8F0'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>📐</div>
                        <h3 style={{ margin: '0 0 12px 0', color: '#475569', fontSize: '24px' }}>个人图档库空缺</h3>
                        <p style={{ margin: 0, fontSize: '15px' }}>仅当期末评图斩获评委卓越(S)或优秀(A)的极致肯定，才能被收录进作品集中。</p>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '28px'
                    }}>
                        {portfolio.map(proj => (
                            <ProjectCard key={proj.id} project={proj} />
                        ))}
                    </div>
                )}
            </div>

            <DetailViewer />
        </div>
    );
}
