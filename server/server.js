/**
 * ====================================================
 * 🏗️ 建筑系模拟器 - 后端服务
 * ====================================================
 * 技术栈：Node.js + Express + better-sqlite3
 * 功能：游戏存档保存/读取 + 积分排行榜
 * 端口：3000
 * 
 * ====================================================
 * 📌 前端调用示例（fetch）
 * ====================================================
 * 
 * // ---- 保存存档 ----
 * async function saveGame(playerName, gameState, score = 0) {
 *     const res = await fetch('http://api.arc-student-simulator.com:3000/save', {
 *         method: 'POST',
 *         headers: { 'Content-Type': 'application/json' },
 *         body: JSON.stringify({
 *             playerName: playerName,
 *             saveData: gameState,   // 完整的 gameState 对象
 *             score: score           // 积分（预留，后续补充）
 *         })
 *     });
 *     const data = await res.json();
 *     console.log(data); // { success: true, message: "存档保存成功" }
 * }
 * 
 * // ---- 读取存档 ----
 * async function loadGame(playerName) {
 *     const res = await fetch(`http://api.arc-student-simulator.com:3000/load?playerName=${encodeURIComponent(playerName)}`);
 *     const data = await res.json();
 *     if (data.success) {
 *         console.log('存档数据:', data.data.saveData);
 *         console.log('积分:', data.data.score);
 *     } else {
 *         console.log('未找到存档');
 *     }
 * }
 * 
 * // ---- 获取排行榜 ----
 * async function getLeaderboard() {
 *     const res = await fetch('http://api.arc-student-simulator.com:3000/leaderboard');
 *     const data = await res.json();
 *     console.log('排行榜:', data.data);
 *     // [{ rank: 1, playerName: "王五", score: 9800 }, ...]
 * }
 * 
 * ====================================================
 */

const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');
const path = require('path');

// ==========================================
// 1. 初始化 Express 应用
// ==========================================
const app = express();
const PORT = 3000;

// 解析 JSON 请求体（限制 10MB，因为存档数据可能较大）
app.use(express.json({ limit: '10mb' }));

// 允许所有跨域请求（前端部署在 EdgeOne，后端在腾讯云，域不同必须开启 CORS）
app.use(cors());

// ==========================================
// 2. 初始化 SQLite 数据库
// ==========================================
// 数据库文件会自动创建在 server/ 目录下
const dbPath = path.join(__dirname, 'game.db');
const db = new Database(dbPath);

// 开启 WAL 模式，提升并发读写性能
db.pragma('journal_mode = WAL');

// 自动创建 players 表（如果不存在）
db.exec(`
    CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerName TEXT UNIQUE NOT NULL,
        saveData TEXT,
        score INTEGER DEFAULT 0,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`);

console.log('✅ 数据库初始化完成，players 表已就绪');

// ==========================================
// 3. API 接口
// ==========================================

/**
 * POST /save — 保存/更新玩家存档
 * 
 * 请求体：
 * {
 *   "playerName": "张三",
 *   "saveData": { ...gameState },
 *   "score": 0
 * }
 */
app.post('/save', (req, res) => {
    try {
        const { playerName, saveData, score } = req.body;

        // 参数校验
        if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '玩家名称不能为空'
            });
        }

        // 将 saveData 对象转为 JSON 字符串存入数据库
        const saveDataStr = JSON.stringify(saveData || {});
        const scoreVal = typeof score === 'number' ? score : 0;

        // 使用 INSERT OR REPLACE：玩家名存在则更新，不存在则新建
        const stmt = db.prepare(`
            INSERT INTO players (playerName, saveData, score, updatedAt)
            VALUES (?, ?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(playerName) DO UPDATE SET
                saveData = excluded.saveData,
                score = excluded.score,
                updatedAt = CURRENT_TIMESTAMP
        `);

        stmt.run(playerName.trim(), saveDataStr, scoreVal);

        res.json({
            success: true,
            message: '存档保存成功'
        });

    } catch (error) {
        console.error('❌ 保存存档失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误，保存失败'
        });
    }
});

/**
 * GET /load — 读取玩家存档
 * 
 * 查询参数：?playerName=张三
 */
app.get('/load', (req, res) => {
    try {
        const { playerName } = req.query;

        // 参数校验
        if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '请提供玩家名称'
            });
        }

        // 查询该玩家的存档
        const stmt = db.prepare('SELECT playerName, saveData, score FROM players WHERE playerName = ?');
        const row = stmt.get(playerName.trim());

        if (!row) {
            return res.json({
                success: false,
                message: '未找到该玩家的存档'
            });
        }

        // 将 JSON 字符串解析回对象
        let parsedSaveData = {};
        try {
            parsedSaveData = JSON.parse(row.saveData || '{}');
        } catch (e) {
            parsedSaveData = {};
        }

        res.json({
            success: true,
            data: {
                playerName: row.playerName,
                saveData: parsedSaveData,
                score: row.score
            }
        });

    } catch (error) {
        console.error('❌ 读取存档失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误，读取失败'
        });
    }
});

/**
 * GET /leaderboard — 积分排行榜（前100名）
 */
app.get('/leaderboard', (req, res) => {
    try {
        // 按积分降序排列，取前100名
        const stmt = db.prepare(`
            SELECT playerName, score
            FROM players
            WHERE score > 0
            ORDER BY score DESC
            LIMIT 100
        `);
        const rows = stmt.all();

        // 添加排名序号
        const leaderboard = rows.map((row, index) => ({
            rank: index + 1,
            playerName: row.playerName,
            score: row.score
        }));

        res.json({
            success: true,
            data: leaderboard
        });

    } catch (error) {
        console.error('❌ 获取排行榜失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误，获取排行榜失败'
        });
    }
});

/**
 * GET /rank — 获取指定玩家的全服排名
 * 
 * 查询参数：?playerName=张三
 * 返回：{ success: true, rank: 121, totalPlayers: 150 }
 */
app.get('/rank', (req, res) => {
    try {
        const { playerName } = req.query;

        if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '请提供玩家名称'
            });
        }

        // 获取该玩家的积分
        const playerStmt = db.prepare('SELECT score FROM players WHERE playerName = ?');
        const player = playerStmt.get(playerName.trim());

        if (!player) {
            return res.json({
                success: false,
                message: '该玩家不存在'
            });
        }

        // 统计比该玩家积分高的人数 + 1 = 排名
        const rankStmt = db.prepare('SELECT COUNT(*) as cnt FROM players WHERE score > ? AND score > 0');
        const rankRow = rankStmt.get(player.score);
        const rank = player.score > 0 ? rankRow.cnt + 1 : null;

        // 统计有积分的总玩家数
        const totalStmt = db.prepare('SELECT COUNT(*) as cnt FROM players WHERE score > 0');
        const totalRow = totalStmt.get();

        res.json({
            success: true,
            rank: rank,
            totalPlayers: totalRow.cnt
        });

    } catch (error) {
        console.error('❌ 获取排名失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
});

/**
 * POST /update-score — 仅更新玩家积分（不影响 saveData）
 * 
 * 请求体：{ "playerName": "张三", "score": 1200 }
 */
app.post('/update-score', (req, res) => {
    try {
        const { playerName, score } = req.body;

        if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '玩家名称不能为空'
            });
        }

        const scoreVal = typeof score === 'number' ? score : 0;

        // 仅更新 score 字段，绝不覆盖 saveData
        const stmt = db.prepare(`
            UPDATE players SET score = ?, updatedAt = CURRENT_TIMESTAMP
            WHERE playerName = ?
        `);
        const result = stmt.run(scoreVal, playerName.trim());

        if (result.changes === 0) {
            return res.json({
                success: false,
                message: '该玩家不存在'
            });
        }

        res.json({
            success: true,
            message: '积分更新成功'
        });

    } catch (error) {
        console.error('❌ 更新积分失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
});

/**
 * POST /clear-save — 清空玩家的游戏进程存档（仅清 saveData，保留玩家名和积分）
 * 
 * 请求体：{ "playerName": "张三" }
 */
app.post('/clear-save', (req, res) => {
    try {
        const { playerName } = req.body;

        if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '玩家名称不能为空'
            });
        }

        // 仅将 saveData 清空为 {}，保留 playerName 和 score 不变
        const stmt = db.prepare(`
            UPDATE players
            SET saveData = '{}', updatedAt = CURRENT_TIMESTAMP
            WHERE playerName = ?
        `);
        stmt.run(playerName.trim());

        res.json({
            success: true,
            message: '游戏进程存档已清空（玩家名与积分已保留）'
        });

    } catch (error) {
        console.error('❌ 清空存档失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
});

/**
 * GET /check-name — 检查玩家名是否已被使用
 * 
 * 查询参数：?playerName=张三
 */
app.get('/check-name', (req, res) => {
    try {
        const { playerName } = req.query;

        if (!playerName || typeof playerName !== 'string' || playerName.trim() === '') {
            return res.status(400).json({
                success: false,
                message: '请提供玩家名称'
            });
        }

        const stmt = db.prepare('SELECT COUNT(*) as count FROM players WHERE playerName = ?');
        const row = stmt.get(playerName.trim());

        res.json({
            success: true,
            exists: row.count > 0
        });

    } catch (error) {
        console.error('❌ 检查玩家名失败:', error);
        res.status(500).json({
            success: false,
            message: '服务器内部错误'
        });
    }
});

// ==========================================
// 4. 健康检查接口（用于验证服务是否正常运行）
// ==========================================
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: '🏗️ 建筑系模拟器后端服务运行中',
        version: '1.0.0',
        endpoints: [
            'POST /save    - 保存存档',
            'GET  /load    - 读取存档',
            'GET  /leaderboard - 排行榜',
            'GET  /check-name - 检查玩家名'
        ]
    });
});

// ==========================================
// 5. 启动服务器
// ==========================================
app.listen(PORT, '0.0.0.0', () => {
    console.log('');
    console.log('====================================================');
    console.log('🏗️  建筑系模拟器 - 后端服务已启动');
    console.log(`📡  监听地址: http://0.0.0.0:${PORT}`);
    console.log(`🌐  正式域名: http://api.arc-student-simulator.com:${PORT}`);
    console.log('====================================================');
    console.log('');
    console.log('可用接口:');
    console.log(`  POST  http://localhost:${PORT}/save`);
    console.log(`  GET   http://localhost:${PORT}/load?playerName=xxx`);
    console.log(`  GET   http://localhost:${PORT}/leaderboard`);
    console.log('');
});

// 优雅关闭：进程退出时关闭数据库连接
process.on('SIGINT', () => {
    console.log('\n正在关闭数据库连接...');
    db.close();
    console.log('👋 服务已安全关闭');
    process.exit(0);
});

process.on('SIGTERM', () => {
    db.close();
    process.exit(0);
});
