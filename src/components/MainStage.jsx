// 主舞台容器组件 - 包含叙事窗口、当前的课题导师面板和底部行动中心

import React, { useEffect } from 'react';
import { useGame } from '../logic/gameState';
import { getMissionProgress, isMissionComplete } from '../data/tutors';
import { calculateBaseDifficulty, calculateThreshold } from '../data/reviews';
import { getQualityCap } from '../logic/calculator';
import NarrativeWindow from './NarrativeWindow';
import ActionCenter from './ActionCenter';
import SettingsModal from './SettingsModal';

export default function MainStage() {
    const { state, dispatch } = useGame();
    const [showSettings, setShowSettings] = React.useState(false);
    const tutor = state.tutor;
    const mission = state.tutorMission;
    const tracking = state.tutorMissionTracking;
    const missionComplete = mission ? isMissionComplete(mission, state, tracking) : false;
    const missionProgress = mission ? getMissionProgress(mission, state, tracking) : '';

    // 检测是否是开局第一回合，且尚未显示过指引
    useEffect(() => {
        if (state.progress.totalWeeks === 1 && !state.tutorialShown) {
            // 标记为已展示，防止反复触发
            dispatch({ type: 'MARK_TUTORIAL_SHOWN' });
            // 唤出全屏指引
            dispatch({ type: 'TOGGLE_TUTORIAL', payload: true });
        }
    }, [state.progress.totalWeeks, state.tutorialShown, dispatch]);

    // ==== 目标状态动态计算 ====
    const isBeforeMidterm = state.progress.week <= 6;
    const progressTarget = isBeforeMidterm ? 50 : 100;
    const currentProgress = Math.min(Math.floor(state.currentProject?.progress || 0), 100);
    const progressReached = currentProgress >= progressTarget;
    const progressColor = progressReached ? '#10B981' : '#EF4444';
    const progressLabel = isBeforeMidterm ? '期中目标' : '期末目标';

    const baseDiff = calculateBaseDifficulty(state.progress.year, isBeforeMidterm);
    const thresholdD = calculateThreshold(baseDiff, state.identity?.school?.difficulty || 1.0);
    const currentQuality = Math.floor(state.currentProject?.quality || 0);

    const qualityCap = getQualityCap(state.progress.year);

    let qualityColor = '#EF4444';
    let qualityTargetText = '';
    if (currentQuality >= qualityCap) {
        qualityColor = '#F59E0B';
        qualityTargetText = `✅ 已达质量上限 (${qualityCap})`;
    } else if (currentQuality < thresholdD) {
        qualityColor = '#EF4444';
        qualityTargetText = `合格门槛: ${Math.floor(thresholdD)}`;
    } else if (currentQuality < thresholdD + 40) {
        qualityColor = '#64748B';
        qualityTargetText = `下一级(B)要求: ${Math.floor(thresholdD + 40)}`;
    } else if (currentQuality < thresholdD + 80) {
        qualityColor = '#3B82F6';
        qualityTargetText = `下一级(A)要求: ${Math.floor(thresholdD + 80)}`;
    } else if (currentQuality < thresholdD + 130) {
        qualityColor = '#8B5CF6';
        qualityTargetText = `下一级(S)要求: ${Math.floor(thresholdD + 130)}`;
    } else {
        qualityColor = '#F59E0B';
        qualityTargetText = `已达最高(S)评级要求`;
    }

    return (
        <div className="main-stage">
            {/* 上半部分：左右分栏排列 */}
            <div className="main-stage-top">
                {/* 左半区：行动日志 */}
                <div className="log-area-container">
                    <NarrativeWindow />
                </div>

                {/* 右半区：课题与导师合并面板 */}
                <div className="project-tutor-panel" style={{ position: 'relative' }}>
                    {/* 右上角绝对定位的设置小齿轮 */}
                    <button
                        id="settings-gear-btn"
                        onClick={() => setShowSettings(true)}
                        style={{
                            position: 'absolute', top: '12px', right: '12px',
                            background: 'transparent', border: 'none', cursor: 'pointer',
                            fontSize: '22px', opacity: 0.6, transition: 'all 0.2s',
                            padding: '6px', zIndex: 10
                        }}
                        onMouseOver={e => { e.currentTarget.style.opacity = 1; e.currentTarget.style.transform = 'rotate(30deg)' }}
                        onMouseOut={e => { e.currentTarget.style.opacity = 0.6; e.currentTarget.style.transform = 'rotate(0)' }}
                        title="系统设置"
                    >
                        ⚙️
                    </button>

                    {/* 上半部：当前课题 (极限压榨无用留白以让位，绝不修改字号) */}
                    <div style={{
                        padding: '10px 16px 6px 16px', // 进一步压榨内外留空
                        borderBottom: '1px solid var(--color-border)',
                        flexShrink: 0,
                    }}>
                        <div className="project-header" style={{ marginBottom: '0px' }}>
                            <div className="attribute-label" style={{ fontSize: '11px', marginBottom: '0px' }}>当前课题</div>
                            <div className="project-name" style={{ marginTop: '0', fontSize: '18px', lineHeight: '1.2' }}>{state.currentProject?.name || '未开始'}</div>
                        </div>

                        <div className="attribute-item" style={{ marginTop: '4px' }}>
                            <div className="attribute-label" style={{ marginBottom: '0px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>进度 PROGRESS</span>
                                <span style={{ color: progressColor, fontWeight: 'bold' }}>[{progressLabel}] {progressTarget}%</span>
                            </div>
                            <div className="attribute-value" style={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.1', color: progressColor }}>
                                {currentProgress}%
                            </div>
                            <div className="progress-bar-container" style={{ height: '5px', marginTop: '2px' }}>
                                <div
                                    className="progress-bar"
                                    style={{ width: `${currentProgress}%`, backgroundColor: progressColor }}
                                />
                            </div>
                        </div>

                        <div className="attribute-item" style={{ marginTop: '4px' }}>
                            <div className="attribute-label" style={{ marginBottom: '0px', fontSize: '11px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>质量 QUALITY</span>
                                <span style={{ color: qualityColor, fontWeight: 'bold' }}>{qualityTargetText}</span>
                            </div>
                            <div className="attribute-value" style={{ fontSize: '15px', fontWeight: '700', lineHeight: '1.1', color: qualityColor }}>
                                {currentQuality}
                            </div>
                            <div className="progress-bar-container" style={{ height: '5px', marginTop: '2px' }}>
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${Math.min((currentQuality / qualityCap) * 100, 100)}%`,
                                        backgroundColor: qualityColor
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 下半部：当前导师 (占满剩余高，通过弹性分布美化留白) */}
                    {tutor ? (
                        <div style={{
                            padding: '12px 16px', // 极致消减边缘空白
                            display: 'flex',
                            flexDirection: 'column',
                            flex: 1,
                            minHeight: 0
                        }}>
                            {/* 导师头部区域：固定高度 */}
                            <div style={{ flexShrink: 0 }}>
                                <div className="attribute-label" style={{ marginBottom: '4px' }}>当前导师</div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    marginBottom: '0px',
                                }}>
                                    <div className="project-name" style={{ fontSize: '18px', marginTop: 0 }}>
                                        {tutor.name}
                                    </div>
                                    <span style={{ fontSize: '32px', lineHeight: 1 }}>{tutor.icon}</span>
                                </div>
                            </div>

                            {/* 导师介绍区域：彻底移除overflow限制，绝对不出现滚动条 */}
                            <div style={{
                                flexGrow: 1,
                                minHeight: 0,
                                display: 'flex',
                                flexDirection: 'column',
                                margin: '6px 0'
                            }}>
                                <div style={{
                                    margin: 'auto 0', // 文本短则自动居中留白，绝不产生滚动限制
                                }}>
                                    <p style={{
                                        fontSize: '14px',
                                        color: '#64748B',
                                        lineHeight: '1.45', // 柔和缩小行高容纳更多文本
                                        fontStyle: 'italic',
                                        margin: '0',
                                        borderLeft: '4px solid #E2E8F0',
                                        paddingLeft: '10px',
                                    }}>
                                        {tutor.bio}
                                    </p>
                                </div>
                            </div>

                            {/* 当前任务（固定高度，被挤压时绝对保证存活并在最底端） */}
                            <div style={{ flexShrink: 0 }}>
                                <div className="attribute-label" style={{ marginBottom: '6px' }}>当前任务</div>

                                {/* 当前任务框 */}
                                {mission && (
                                    <div style={{
                                        background: missionComplete ? '#F0FDF4' : '#F8FAFC',
                                        borderRadius: '6px',
                                        padding: '10px 14px',
                                        borderLeft: `3px solid ${missionComplete ? '#10B981' : '#3B82F6'}`,
                                    }}>
                                        <div style={{
                                            fontSize: '13px',
                                            fontWeight: '700',
                                            color: missionComplete ? '#059669' : '#1E293B',
                                            marginBottom: '4px',
                                        }}>
                                            {missionComplete ? '✅ ' : '📋 '}
                                            {mission.description}
                                            {tutor.isSpecial && <span style={{ fontSize: '11px', color: '#EF4444', marginLeft: '6px' }}>(期末结算)</span>}
                                        </div>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#64748B',
                                            fontWeight: '600',
                                        }}>
                                            {missionProgress}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '14px' }}>
                            没有指派导师
                        </div>
                    )}
                </div>
            </div>

            <ActionCenter />
            {/* 顶层挂载的全局设置系统 */}
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
        </div>
    );
}
