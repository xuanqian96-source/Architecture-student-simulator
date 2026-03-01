// 结局界面

import React from 'react';
import { useGame } from '../logic/gameState';

export default function EndingScreen() {
    const { state } = useGame();
    const { ending } = state.ui;

    if (!ending) return null;

    const handleRestart = () => {
        window.location.reload();
    };

    return (
        <div className="ending-screen">
            <div className="ending-content">
                <div className="ending-emoji">{ending.image}</div>
                <h1 className="ending-title">{ending.name}</h1>
                <p className="ending-description">{ending.description}</p>

                <div style={{
                    marginBottom: '32px',
                    padding: '24px',
                    background: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px'
                }}>
                    <div style={{ fontSize: '14px', marginBottom: '8px' }}>最终数据</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', lineHeight: '1.8' }}>
                        设计能力: {Math.floor(state.attributes.design)}<br />
                        软件能力: {Math.floor(state.attributes.software)}<br />
                        总周数: {state.progress.totalWeeks} / 120<br />
                        警告次数: {state.history.warningCount}
                    </div>
                </div>

                <button className="restart-button" onClick={handleRestart}>
                    重新开始
                </button>
            </div>
        </div>
    );
}
