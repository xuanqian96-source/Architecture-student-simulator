// 行动指令中心组件 - 重新布局版本

import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import { shouldTriggerReview, isMidtermWeek } from '../logic/reviewSystem';
import SkillModal from './SkillModal';


export default function ActionCenter() {
    const { state, dispatch, ActionTypes } = useGame();
    const { attributes, identity, skillCooldown, weeklyActions } = state;
    const [showSkillModal, setShowSkillModal] = useState(false);

    const performAction = (actionType) => {
        dispatch({ type: ActionTypes.PERFORM_ACTION, payload: { actionType } });
    };

    const handleNextWeek = () => {
        dispatch({ type: ActionTypes.NEXT_WEEK });
    };

    // 动态按钮文字
    const getNextWeekLabel = () => {
        const week = state.progress.week;
        const flags = state.weeklyFlags || {};
        if (shouldTriggerReview(week) && !flags.tutorJudgmentShown) {
            return '📋 进入评图流程';
        }
        return '下一周';
    };

    const handleOpenShop = () => {
        dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'shop' } });
    };

    const handleOpenJob = () => {
        dispatch({ type: ActionTypes.CHANGE_SCREEN, payload: { screen: 'job' } });
    };

    const isBurnout = attributes.stress >= 80;
    const isActionLimitReached = weeklyActions.count >= weeklyActions.limit;
    const remainingActions = weeklyActions.limit - weeklyActions.count;

    // 技能状态
    const isMiddle = identity?.family?.id === 'middle';
    const isSkillDisabled = isMiddle || skillCooldown > 0;
    const skillButtonLabel = isMiddle
        ? '无技能'
        : skillCooldown > 0
            ? `冷却${skillCooldown}周`
            : (identity?.family?.skill?.name || '身份技能');

    return (
        <div className="action-center">
            {/* 精神耗竭警告 */}
            {isBurnout && (
                <div className="action-hint warning">
                    😵 压力过高({attributes.stress}/100)——精神耗竭！无法进行高强度行动，请先天台吹风或火锅整顿
                </div>
            )}
            {/* 行动次数提示 */}
            {!isBurnout && remainingActions > 0 && (
                <div className="action-hint">
                    本周剩余行动次数: {remainingActions}/{weeklyActions.limit}
                </div>
            )}
            {!isBurnout && isActionLimitReached && (
                <div className="action-hint warning">
                    ⚠️ 本周行动次数已用完，请点击"下一周"
                </div>
            )}

            {/* 新布局:左侧行动按钮 + 右侧控制按钮 */}
            <div className="action-layout">
                {/* 左侧:行动按钮网格 */}
                <div className="action-grid-left">
                    <button
                        className="action-button-compact"
                        onClick={() => performAction('redbull')}
                        disabled={isBurnout || isActionLimitReached}
                        title="提升设计进度"
                    >
                        <span className="button-icon">🎨</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>通宵画图</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>加进度,受软件影响</span>
                        </div>
                    </button>

                    <button
                        className="action-button-compact"
                        onClick={() => performAction('polish')}
                        disabled={isBurnout || isActionLimitReached}
                        title="提升设计质量"
                    >
                        <span className="button-icon">💎</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>方案推敲</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>加质量,受设计影响</span>
                        </div>
                    </button>

                    <button
                        className="action-button-compact"
                        onClick={() => performAction('bilibili')}
                        disabled={isActionLimitReached}
                        title="提升软件能力"
                    >
                        <span className="button-icon">💻</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>软件教程</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>稳步提升软件能力</span>
                        </div>
                    </button>

                    <button
                        className="action-button-compact"
                        onClick={() => performAction('lecture')}
                        disabled={isActionLimitReached}
                        title="提升综合设计"
                    >
                        <span className="button-icon">🎓</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>学术讲座</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>稳步提升设计能力</span>
                        </div>
                    </button>

                    <button
                        className="action-button-compact"
                        onClick={() => performAction('rooftop')}
                        disabled={isActionLimitReached}
                        title="缓解压力"
                    >
                        <span className="button-icon">🌬️</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>天台放空</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>免费小幅缓解压力</span>
                        </div>
                    </button>

                    <button
                        className="action-button-compact"
                        onClick={() => performAction('hotpot')}
                        disabled={attributes.money < 600 || isActionLimitReached}
                        title="大幅缓解压力"
                    >
                        <span className="button-icon">🍲</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>社交大餐</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>花钱大幅缓解压力</span>
                        </div>
                    </button>

                    <button
                        className="action-button-compact"
                        onClick={handleOpenJob}
                        disabled={isActionLimitReached}
                        title="前往私活市场"
                    >
                        <span className="button-icon">💼</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span>接私活</span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>消耗行动换取金钱</span>
                        </div>
                    </button>

                    <button
                        className="action-button-compact"
                        onClick={() => setShowSkillModal(true)}
                        disabled={isSkillDisabled}
                        title={isMiddle ? '普通家庭没有主动技能' : skillCooldown > 0 ? `技能冷却中，还需${skillCooldown}周` : identity?.family?.skill?.description}
                        style={isMiddle ? {
                            opacity: 0.35,
                            background: '#f1f5f9',
                            cursor: 'not-allowed',
                        } : skillCooldown > 0 ? {
                            opacity: 0.5,
                            cursor: 'not-allowed',
                        } : {}}
                    >
                        <span className="button-icon">⚡</span>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: skillCooldown > 0 ? '11px' : undefined }}>
                                {skillButtonLabel}
                            </span>
                            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 'normal', marginTop: '2px' }}>专属身份技能</span>
                        </div>
                    </button>
                </div>

                {/* 右侧:控制按钮 */}
                <div className="action-control-right">
                    <button
                        className="control-button shop-button"
                        onClick={handleOpenShop}
                    >
                        <span className="button-icon">🛒</span>
                        <span>打开商店</span>
                    </button>

                    <button
                        className="control-button next-week-button"
                        onClick={handleNextWeek}
                    >
                        <span className="button-icon">⏭️</span>
                        <span>{getNextWeekLabel()}</span>
                    </button>
                </div>
            </div>

            {/* 技能弹窗 */}
            {showSkillModal && (
                <SkillModal onClose={() => setShowSkillModal(false)} />
            )}
        </div>
    );
}
