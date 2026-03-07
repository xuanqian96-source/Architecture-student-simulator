// 行动日志组件 - 按日志类型自动着色

import React, { useEffect, useRef } from 'react';
import { useGame } from '../logic/gameState';

// 根据日志内容判断类型并返回对应颜色
function getLogColor(text) {
    if (!text || typeof text !== 'string') return { color: '#475569', fontWeight: '600' };

    // 随机事件 (紫色)
    if (text.includes('📌 随机事件')) return { color: '#8B5CF6', fontWeight: '700' };
    // 交互抉择 + 选择结果 (粉色)
    if (text.includes('🎲 交互抉择') || text.includes('→ 选择')) return { color: '#EC4899', fontWeight: '700' };
    // 技能使用 (金色)
    if (text.includes('⚡ 使用技能')) return { color: '#D97706', fontWeight: '700' };
    // 商店购买 / 被动效果 (青色)
    if (text.includes('🛒') || text.includes('🥫')) return { color: '#0891B2', fontWeight: '600' };
    // 新学期 / 游戏开始 (蓝色)
    if (text.includes('新学期') || text.includes('游戏开始')) return { color: '#2563EB', fontWeight: '700' };
    // 生活费 (灰色)
    if (text.includes('生活费')) return { color: '#94A3B8', fontWeight: '600' };
    // 玩家行动 (深色加粗)
    if (text.includes('通宵画图') || text.includes('方案推敲') ||
        text.includes('软件教程') || text.includes('学术讲座') ||
        text.includes('天台放空') || text.includes('社交大餐') ||
        text.includes('接私活')) return { color: '#1E293B', fontWeight: '700' };

    return { color: '#475569', fontWeight: '600' };
}

export default function NarrativeWindow() {
    const { state } = useGame();
    const { logs } = state.ui;
    const logListRef = useRef(null);

    // 新日志追加时自动滚到底部
    useEffect(() => {
        if (logListRef.current) {
            logListRef.current.scrollTop = logListRef.current.scrollHeight;
        }
    }, [logs]);

    // 将日志数组处理成带周标签的条目
    const processedLogs = [];
    let currentLabel = '';

    for (const log of logs) {
        if (typeof log === 'string' && log.startsWith('──')) {
            const match = log.match(/第(\d+)年\s*Week\s*(\d+)/);
            if (match) {
                currentLabel = `Y${match[1]}W${match[2]}`;
            }
        } else {
            processedLogs.push({ label: currentLabel, text: log });
        }
    }

    return (
        <div className="narrative-window">
            {/* 固定标题栏，新增右侧时间进度显示区 */}
            <div className="log-header" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #E2E8F0',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px' }}>📋</span>
                    <span>行动日志</span>
                </div>
                {/* 融合的时间卡片 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '13px',
                    background: '#F8FAFC',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    border: '1px solid #E2E8F0'
                }}>
                    <span style={{ fontWeight: '800', color: '#1E293B' }}>本科第{state.progress.year}学年</span>
                    <span style={{ width: '1px', height: '14px', background: '#CBD5E1' }}></span>
                    <span style={{ fontWeight: '600', color: '#3B82F6' }}>Week {state.progress.week} / 12</span>
                    <span style={{ width: '1px', height: '14px', background: '#CBD5E1' }}></span>
                    <span style={{ fontWeight: '600', color: '#64748B' }}>总第 {state.progress.totalWeeks} / 60 周</span>
                </div>
            </div>

            {/* 只有这个区域滚动 */}
            <div className="log-list" ref={logListRef}>
                {processedLogs.length === 0 ? (
                    <div className="log-placeholder">
                        游戏开始，等待您的第一个行动...
                    </div>
                ) : (
                    processedLogs.map((entry, index) => {
                        const logStyle = getLogColor(entry.text);
                        return (
                            <div key={index} className="log-entry">
                                {entry.label && (
                                    <span className="log-week-label">{entry.label}</span>
                                )}
                                <span className="log-text" style={logStyle}>
                                    {entry.text}
                                </span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
