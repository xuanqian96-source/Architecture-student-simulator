// 移动端底部固定行动栏 — 精简的行动按钮 + 商店/下一周
import React, { useState } from 'react';
import { useGame } from '../../logic/gameState';
import { shouldTriggerReview } from '../../logic/reviewSystem';
import SkillModal from '../SkillModal';

export default function MobileActionBar() {
    const { state, dispatch, ActionTypes } = useGame();
    const { attributes, identity, skillCooldown, weeklyActions } = state;
    const [showSkillModal, setShowSkillModal] = useState(false);

    const performAction = (actionType) => {
        dispatch({ type: ActionTypes.PERFORM_ACTION, payload: { actionType } });
    };
    const handleNextWeek = () => dispatch({ type: ActionTypes.NEXT_WEEK });
    const handleOpenShop = () => dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'shop' } });
    const handleOpenJob = () => dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'job' } });

    const isBurnout = attributes.stress >= 80;
    const isActionLimitReached = weeklyActions.count >= weeklyActions.limit;
    const remainingActions = weeklyActions.limit - weeklyActions.count;

    const isMiddle = identity?.family?.id === 'middle';
    const isSkillDisabled = isMiddle || skillCooldown > 0;
    const skillLabel = isMiddle ? '无技能' : skillCooldown > 0 ? `冷却${skillCooldown}w` : '技能';

    const getNextWeekLabel = () => {
        const week = state.progress.week;
        const flags = state.weeklyFlags || {};
        if (shouldTriggerReview(week) && !flags.tutorJudgmentShown) return '📋 评图';
        return '⏭️ 下一周';
    };

    const actionBtnStyle = (disabled) => ({
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'white', border: '1px solid #E2E8F0', borderRadius: '10px',
        padding: '6px 2px', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1, fontSize: '11px', fontWeight: '600',
        color: '#1E293B', gap: '2px', minHeight: '48px',
    });

    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            zIndex: 8000,
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            padding: '6px 8px',
            paddingBottom: 'max(6px, env(safe-area-inset-bottom))',
            boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
        }}>
            {/* 提示行 */}
            {isBurnout && (
                <div style={{
                    background: '#FEF3C7', borderLeft: '3px solid #F59E0B',
                    borderRadius: '6px', padding: '4px 8px', marginBottom: '6px',
                    fontSize: '11px', fontWeight: '600', color: '#92400E', textAlign: 'center',
                }}>
                    😵 精神耗竭！无法高强度行动
                </div>
            )}
            {!isBurnout && !isActionLimitReached && (
                <div style={{
                    background: '#EFF6FF', borderLeft: '3px solid #3B82F6',
                    borderRadius: '6px', padding: '4px 8px', marginBottom: '6px',
                    fontSize: '11px', fontWeight: '600', color: '#1E40AF', textAlign: 'center',
                }}>
                    剩余行动: {remainingActions}/{weeklyActions.limit}
                </div>
            )}
            {!isBurnout && isActionLimitReached && (
                <div style={{
                    background: '#FEF3C7', borderLeft: '3px solid #F59E0B',
                    borderRadius: '6px', padding: '4px 8px', marginBottom: '6px',
                    fontSize: '11px', fontWeight: '600', color: '#92400E', textAlign: 'center',
                }}>
                    ⚠️ 行动已用完，请下一周
                </div>
            )}

            {/* 行动按钮网格 3列 */}
            <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '4px', marginBottom: '6px',
            }}>
                <button style={actionBtnStyle(isBurnout || isActionLimitReached)} disabled={isBurnout || isActionLimitReached} onClick={() => performAction('redbull')}>
                    <span style={{ fontSize: '18px' }}>🎨</span><span>通宵画图</span>
                </button>
                <button style={actionBtnStyle(isBurnout || isActionLimitReached)} disabled={isBurnout || isActionLimitReached} onClick={() => performAction('polish')}>
                    <span style={{ fontSize: '18px' }}>💎</span><span>方案推敲</span>
                </button>
                <button style={actionBtnStyle(isActionLimitReached)} disabled={isActionLimitReached} onClick={() => performAction('bilibili')}>
                    <span style={{ fontSize: '18px' }}>💻</span><span>软件教程</span>
                </button>
                <button style={actionBtnStyle(isActionLimitReached)} disabled={isActionLimitReached} onClick={() => performAction('lecture')}>
                    <span style={{ fontSize: '18px' }}>🎓</span><span>学术讲座</span>
                </button>
                <button style={actionBtnStyle(isActionLimitReached)} disabled={isActionLimitReached} onClick={() => performAction('rooftop')}>
                    <span style={{ fontSize: '18px' }}>🌬️</span><span>天台放空</span>
                </button>
                <button style={actionBtnStyle(attributes.money < 600 || isActionLimitReached)} disabled={attributes.money < 600 || isActionLimitReached} onClick={() => performAction('hotpot')}>
                    <span style={{ fontSize: '18px' }}>🍲</span><span>社交大餐</span>
                </button>
                <button style={actionBtnStyle(isActionLimitReached)} disabled={isActionLimitReached} onClick={handleOpenJob}>
                    <span style={{ fontSize: '18px' }}>💼</span><span>接私活</span>
                </button>
                <button
                    style={{
                        ...actionBtnStyle(isSkillDisabled),
                        ...(isMiddle ? { background: '#f1f5f9' } : {}),
                    }}
                    disabled={isSkillDisabled}
                    onClick={() => setShowSkillModal(true)}
                >
                    <span style={{ fontSize: '18px' }}>⚡</span><span style={{ fontSize: '10px' }}>{skillLabel}</span>
                </button>
            </div>

            {/* 底部控制行 */}
            <div style={{ display: 'flex', gap: '6px' }}>
                <button
                    onClick={handleOpenShop}
                    style={{
                        flex: 1, padding: '10px', background: '#F59E0B', color: 'white',
                        border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}
                >
                    🛒 商店
                </button>
                <button
                    onClick={handleNextWeek}
                    style={{
                        flex: 1.5, padding: '10px', background: '#3B82F6', color: 'white',
                        border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                    }}
                >
                    {getNextWeekLabel()}
                </button>
            </div>

            {showSkillModal && <SkillModal onClose={() => setShowSkillModal(false)} />}
        </div>
    );
}
