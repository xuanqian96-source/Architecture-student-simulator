// 自动保存 Hook — 每3分钟将游戏进度存入 localStorage
import { useEffect, useRef } from 'react';

const AUTOSAVE_KEY = 'archsim_autosave';
const AUTOSAVE_TIME_KEY = 'archsim_autosave_time';
const AUTOSAVE_INTERVAL = 3 * 60 * 1000; // 3分钟

/**
 * 放入 MainStage 等持续渲染的组件中。
 * 每 3 分钟自动将 state 存入 localStorage。
 * 游戏结局时自动清除自动存档。
 */
export function useAutoSave(state) {
    const timerRef = useRef(null);
    const stateRef = useRef(state);

    // 始终持有最新 state 引用
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // 启动定时器
    useEffect(() => {
        if (!state || !state.initialized) return;

        // 如果进入结局，清除自动存档
        if (state.ui?.screen === 'ending') {
            clearAutoSave();
            return;
        }

        // 立即保存一次（刚进入游戏时）
        doAutoSave(stateRef.current);

        // 每3分钟保存一次
        timerRef.current = setInterval(() => {
            if (stateRef.current?.initialized && stateRef.current.ui?.screen !== 'ending') {
                doAutoSave(stateRef.current);
            }
        }, AUTOSAVE_INTERVAL);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [state?.initialized, state?.ui?.screen]);
}

function doAutoSave(state) {
    try {
        const saveData = JSON.stringify(state);
        localStorage.setItem(AUTOSAVE_KEY, saveData);
        localStorage.setItem(AUTOSAVE_TIME_KEY, new Date().toISOString());
        console.log('💾 自动保存完成', new Date().toLocaleTimeString());
    } catch (e) {
        console.error('自动保存失败:', e);
    }
}

/** 获取自动存档 */
export function getAutoSave() {
    try {
        const data = localStorage.getItem(AUTOSAVE_KEY);
        const time = localStorage.getItem(AUTOSAVE_TIME_KEY);
        if (!data) return null;
        return {
            state: JSON.parse(data),
            time: time || null
        };
    } catch (e) {
        return null;
    }
}

/** 清除自动存档 */
export function clearAutoSave() {
    localStorage.removeItem(AUTOSAVE_KEY);
    localStorage.removeItem(AUTOSAVE_TIME_KEY);
}
