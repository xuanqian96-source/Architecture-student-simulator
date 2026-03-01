// 综合事件日志框组件 - 显示所有行动和事件历史，按类型着色

import React, { useRef, useEffect } from 'react';
import { useGame } from '../logic/gameState';

// 根据日志内容判断类型并返回对应颜色
function getLogStyle(log) {
    // 周分隔线
    if (log.startsWith('──')) {
        return { color: '#94A3B8', fontWeight: '800', fontSize: '13px', letterSpacing: '0.5px' };
    }
    // 随机事件
    if (log.includes('📌 随机事件')) {
        return { color: '#8B5CF6', fontWeight: '700' };
    }
    // 交互抉择
    if (log.includes('🎲 交互抉择')) {
        return { color: '#EC4899', fontWeight: '700' };
    }
    // 技能使用
    if (log.includes('⚡ 使用技能')) {
        return { color: '#F59E0B', fontWeight: '700' };
    }
    // 商店被动效果 (星巴克、红牛)
    if (log.includes('☕') || log.includes('🥫')) {
        return { color: '#0891B2', fontWeight: '600' };
    }
    // 购买
    if (log.includes('购买成功')) {
        return { color: '#10B981', fontWeight: '600' };
    }
    // 生活费 / 收到生活费
    if (log.includes('生活费')) {
        return { color: '#64748B', fontWeight: '600' };
    }
    // 新学期
    if (log.includes('新学期') || log.includes('游戏开始')) {
        return { color: '#3B82F6', fontWeight: '700' };
    }
    // 玩家行动 (通宵、推敲、教程、讲座、天台、大餐、接私活)
    if (log.includes('通宵画图') || log.includes('方案推敲') ||
        log.includes('软件教程') || log.includes('学术讲座') ||
        log.includes('天台放空') || log.includes('社交大餐') ||
        log.includes('接私活')) {
        return { color: '#1E293B', fontWeight: '700' };
    }
    // 默认
    return { color: '#475569', fontWeight: '600' };
}

export default function ConsoleLog() {
    const { state } = useGame();
    const { logs } = state.ui;
    const listRef = useRef(null);

    // 自动滚动到底部
    useEffect(() => {
        if (listRef.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
    }, [logs.length]);

    return (
        <div className="console-log">
            <div className="log-list" ref={listRef}>
                {logs.length === 0 ? (
                    <div className="log-placeholder">等待事件记录...</div>
                ) : (
                    logs.map((log, index) => {
                        const style = getLogStyle(log);
                        const isSeparator = log.startsWith('──');

                        return (
                            <div
                                key={index}
                                className={isSeparator ? 'log-separator' : 'log-entry'}
                                style={isSeparator ? style : undefined}
                            >
                                {!isSeparator && (
                                    <span className="log-text" style={style}>
                                        {log}
                                    </span>
                                )}
                                {isSeparator && log}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
