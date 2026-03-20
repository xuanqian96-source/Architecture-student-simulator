// 成就追踪 Hook - 监听游戏状态变化并自动检测成就解锁
import { useEffect, useRef } from 'react';
import {
    checkActionAchievements,
    checkAttributeAchievements,
    checkPortfolioAchievements,
    checkInternAchievement,
    checkShopAchievements,
    checkTutorAchievements,
    checkAtlasAchievements,
} from '../data/achievements';

/**
 * 放入 MainStage 或 App 等持续渲染的组件中
 * 自动对比新旧 state 变化来检测成就解锁
 */
export function useAchievementTracker(state) {
    const prevStateRef = useRef(null);

    // 新游戏开始时重置压力标记
    useEffect(() => {
        if (state?.initialized && state.progress.totalWeeks <= 1) {
            localStorage.removeItem('archsim_stress_exceeded_90');
            localStorage.setItem('archsim_redbull_count', '0');
        }
    }, [state?.initialized]);

    useEffect(() => {
        if (!state || !state.initialized) return;
        const prev = prevStateRef.current;
        prevStateRef.current = state;
        if (!prev) return; // 首次渲染时不比较

        // 1. 属性阈值检测（设计180/软件180/金钱80000/双满）
        if (
            state.attributes.design !== prev.attributes.design ||
            state.attributes.software !== prev.attributes.software ||
            state.attributes.money !== prev.attributes.money
        ) {
            checkAttributeAchievements(state);
        }

        // 2. 作品集检测
        if (state.portfolio.length !== prev.portfolio.length) {
            checkPortfolioAchievements(state.portfolio);
        }

        // 3. 实习检测
        if (state.currentIntern && !prev.currentIntern) {
            checkInternAchievement();
        }

        // 4. 导师选择检测
        if (state.tutor && (!prev.tutor || state.tutor.id !== prev.tutor.id)) {
            checkTutorAchievements(state.tutor, state.chosenTutorIds || []);
        }

        // 5. 朝圣图鉴检测
        const prevVisited = prev.atlas?.visited?.length || 0;
        const curVisited = state.atlas?.visited?.length || 0;
        if (curVisited > prevVisited) {
            checkAtlasAchievements(curVisited);
        }

        // 6. 行动检测（通宵/推敲/接私活 首次执行）
        if (state.weeklyActions.count > prev.weeklyActions.count) {
            // 检测最近一次行动类型（通过追踪变化推断）
            const tracking = state.tutorMissionTracking?.actionCounts || {};
            const prevTracking = prev.tutorMissionTracking?.actionCounts || {};
            for (const actionType of ['redbull', 'polish', 'freelance']) {
                if ((tracking[actionType] || 0) > (prevTracking[actionType] || 0)) {
                    checkActionAchievements(actionType, state);
                }
            }
        }
        // 接私活特殊检测 (TAKE_JOB separately)
        if (state.jobTakenThisWeek && !prev.jobTakenThisWeek) {
            checkActionAchievements('freelance', state);
        }

        // 7. 商店购买检测
        if (state.inventory.length > prev.inventory.length) {
            // 检查红牛购买次数
            const redbullCount = parseInt(localStorage.getItem('archsim_redbull_count') || '0', 10);
            const newItems = state.inventory.slice(prev.inventory.length);
            const newRedbulls = newItems.filter(id => id === 'redbull').length;
            if (newRedbulls > 0) {
                const updatedCount = redbullCount + newRedbulls;
                localStorage.setItem('archsim_redbull_count', String(updatedCount));
                checkShopAchievements(state.inventory, updatedCount);
            } else {
                checkShopAchievements(state.inventory, redbullCount);
            }
        }

        // 8. 压力管理大师 - 追踪压力是否超过90
        if (state.attributes.stress >= 90) {
            localStorage.setItem('archsim_stress_exceeded_90', 'true');
        }
    }, [state]);
}
