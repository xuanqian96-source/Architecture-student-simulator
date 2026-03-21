/**
 * SaveManager — 后端 API 封装模块
 * 服务端地址: https://api.arc-student-simulator.com
 */

const API_BASE = 'https://api.arc-student-simulator.com';

const SaveManager = {
    /**
     * 保存/更新玩家存档
     * @param {string} playerName 玩家名称
     * @param {object} saveData   完整的 gameState 对象
     * @param {number} score      积分
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async save(playerName, saveData, score = 0) {
        try {
            const res = await fetch(`${API_BASE}/save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName, saveData, score })
            });
            return await res.json();
        } catch (error) {
            console.error('❌ 存档保存失败:', error);
            return { success: false, message: '网络错误，无法连接服务器' };
        }
    },

    /**
     * 读取玩家存档
     * @param {string} playerName 玩家名称
     * @returns {Promise<{success: boolean, data?: {playerName, saveData, score}}>}
     */
    async load(playerName) {
        try {
            const res = await fetch(`${API_BASE}/load?playerName=${encodeURIComponent(playerName)}`);
            return await res.json();
        } catch (error) {
            console.error('❌ 存档读取失败:', error);
            return { success: false, message: '网络错误，无法连接服务器' };
        }
    },

    /**
     * 获取排行榜（前100名）
     * @returns {Promise<{success: boolean, data?: Array}>}
     */
    async getLeaderboard() {
        try {
            const res = await fetch(`${API_BASE}/leaderboard`);
            return await res.json();
        } catch (error) {
            console.error('❌ 排行榜获取失败:', error);
            return { success: false, message: '网络错误，无法连接服务器' };
        }
    },

    /**
     * 仅更新玩家积分（不影响 saveData）
     * @param {string} playerName 玩家名称
     * @param {number} score      最新总积分
     * @returns {Promise<{success: boolean, message: string}>}
     */
    async updateScore(playerName, score) {
        try {
            const res = await fetch(`${API_BASE}/update-score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName, score })
            });
            return await res.json();
        } catch (error) {
            console.error('❌ 积分更新失败:', error);
            return { success: false, message: '网络错误' };
        }
    },

    /**
     * 检查玩家名是否已被占用
     * @param {string} playerName 玩家名称
     * @returns {Promise<{success: boolean, exists: boolean}>}
     */
    async checkName(playerName) {
        try {
            const res = await fetch(`${API_BASE}/check-name?playerName=${encodeURIComponent(playerName)}`);
            return await res.json();
        } catch (error) {
            console.error('❌ 检查玩家名失败:', error);
            return { success: false, exists: false, message: '网络错误，无法连接服务器' };
        }
    },

    /**
     * 清空玩家游戏进程存档（保留玩家名和积分）
     * @param {string} playerName 玩家名称
     */
    async clearSave(playerName) {
        // 先同步清除本地标记，确保刷新后不会再显示继续游戏
        this.clearCloudSave();
        try {
            const res = await fetch(`${API_BASE}/clear-save`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ playerName })
            });
            return await res.json();
        } catch (error) {
            console.error('❌ 清空存档失败:', error);
            return { success: false, message: '网络错误' };
        }
    },

    // ──── localStorage 玩家名工具 ────

    /** 获取本地存储的玩家名 */
    getPlayerName() {
        return localStorage.getItem('playerName') || '';
    },

    /** 保存玩家名到本地 */
    setPlayerName(name) {
        localStorage.setItem('playerName', name);
    },

    /** 是否已设置过玩家名 */
    hasPlayerName() {
        return !!localStorage.getItem('playerName');
    },

    /** 标记本地存在云端存档 */
    markCloudSave() {
        localStorage.setItem('hasCloudSave', 'true');
    },

    /** 是否存在云端存档标记 */
    hasCloudSave() {
        return localStorage.getItem('hasCloudSave') === 'true';
    },

    /** 清除云端存档标记 */
    clearCloudSave() {
        localStorage.removeItem('hasCloudSave');
    }
};

export default SaveManager;
