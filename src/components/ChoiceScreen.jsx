// 交互抉择弹窗 - 半透明遮罩 + 卡片布局，与 EventModal 风格一致

import React from 'react';
import { useGame } from '../logic/gameState';

export default function ChoiceScreen() {
    const { state, dispatch, ActionTypes } = useGame();
    const { pendingChoice } = state.ui;

    if (!pendingChoice) return null;

    const handleChoice = (index) => {
        dispatch({ type: ActionTypes.MAKE_CHOICE, payload: { optionIndex: index } });
    };

    return (
        <div style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: 'white', borderRadius: '20px', padding: '32px',
                maxWidth: '520px', width: '90%',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                animation: 'fadeIn 0.2s ease-out'
            }} onClick={e => e.stopPropagation()}>
                {/* 标签 */}
                <div style={{
                    display: 'inline-block', padding: '4px 12px',
                    background: '#FDF2F8', color: '#EC4899',
                    borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                    marginBottom: '12px', letterSpacing: '1px'
                }}>
                    🎲 交互抉择
                </div>

                {/* 事件名 */}
                <h2 style={{
                    fontSize: '22px', fontWeight: '800', color: '#1E293B',
                    marginBottom: '12px', marginTop: '0'
                }}>
                    {pendingChoice.name}
                </h2>

                {/* 描述 */}
                <p style={{
                    fontSize: '15px', lineHeight: '1.8', color: '#475569',
                    marginBottom: '24px'
                }}>
                    {pendingChoice.description}
                </p>

                {/* 选项按钮 */}
                <div style={{
                    display: 'flex', flexDirection: 'column', gap: '12px'
                }}>
                    {pendingChoice.options.map((option, index) => (
                        <button
                            key={index}
                            onClick={() => handleChoice(index)}
                            style={{
                                padding: '16px 20px',
                                background: '#F8FAFC',
                                border: '2px solid #E2E8F0',
                                borderRadius: '12px',
                                textAlign: 'left',
                                fontSize: '15px',
                                fontWeight: '600',
                                color: '#1E293B',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = '#EC4899';
                                e.currentTarget.style.background = '#FDF2F8';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = '#E2E8F0';
                                e.currentTarget.style.background = '#F8FAFC';
                            }}
                        >
                            {option.text}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
