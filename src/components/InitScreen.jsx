// 初始化界面 - 含身份抽取系统

import React, { useState, useEffect } from 'react';
import { useGame } from '../logic/gameState';
import { generateIdentity } from '../data/identities';
import ArchivesModal from './ArchivesModal';
import LeaderboardModal from './LeaderboardModal';
import { checkIdentityAchievements } from '../data/achievements';
import { calculateTotalScore } from '../utils/scoreCalculator';
import SaveManager from '../utils/saveManager';

// ── 稀有度工具函数 ──────────────────────────────────────────────────────────
// 概率 = school.probability × family.probability
// < 0.008  → 传说  (≈5种组合，如老八校×院士)
// < 0.025  → 史诗  (≈更多精英组合)
// < 0.09   → 稀有
// else     → 普通
export function getRarity(school, family) {
    const p = (school?.probability ?? 0.45) * (family?.probability ?? 0.6);
    if (p < 0.025) return 'legendary';  // ≈ 1种组合（建筑皇族 2.25%）
    if (p < 0.05) return 'epic';        // ≈ 5种组合
    if (p < 0.10) return 'rare';        // ≈ 8种组合
    return 'normal';                    // ≈ 2种组合
}

const RARITY = {
    legendary: {
        label: '✦ S · 传说',
        gradient: 'linear-gradient(135deg, #f7971e 0%, #ffd200 40%, #ff6b6b 100%)',
        glow: '0 0 32px 8px rgba(255,200,0,0.45), 0 8px 32px rgba(255,107,107,0.3)',
        badge: '#d97706',
        shimmer: true,
    },
    epic: {
        label: '◈ A · 史诗',
        gradient: 'linear-gradient(135deg, #7b2ff7 0%, #f107a3 100%)',
        glow: '0 0 28px 6px rgba(123,47,247,0.4), 0 8px 28px rgba(241,7,163,0.25)',
        badge: '#7c3aed',
        shimmer: false,
    },
    rare: {
        label: '◆ B · 稀有',
        gradient: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
        glow: '0 8px 28px rgba(37,99,235,0.35)',
        badge: '#2563eb',
        shimmer: false,
    },
    normal: {
        label: '◇ C · 普通',
        gradient: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        glow: '0 8px 20px rgba(5,150,105,0.25)',
        badge: '#059669',
        shimmer: false,
    },
};

// ── 技能效果人话翻译 ─────────────────────────────────────────────────────────
function formatEffect(effect, cooldown) {
    if (!effect || Object.keys(effect).length === 0) return '无实际加成（精神支持）';
    const parts = [];
    if (effect.quality) parts.push(`作品质量 +${effect.quality}`);
    if (effect.progress) parts.push(`课题进度 +${effect.progress}%`);
    if (effect.stress) parts.push(`压力 +${effect.stress}`);
    if (effect.moneyCost) parts.push(`花费 ¥${effect.moneyCost.toLocaleString()}`);
    const cdText = cooldown >= 100 ? '仅限1次' : `冷却${cooldown}周`;
    return `${parts.join('，')}（${cdText}）`;
}

export default function InitScreen() {
    const gameContext = useGame();
    const [phase, setPhase] = useState('intro');
    const [identity, setIdentity] = useState(null);
    const [cardFlipped, setCardFlipped] = useState(false);
    const [rarity, setRarity] = useState(null);
    const [drawCount, setDrawCount] = useState(0); // 抽取次数记录
    const [drawnKeys, setDrawnKeys] = useState([]); // 已抽到的身份组合key，用于排除重复
    const [showArchives, setShowArchives] = useState(false);
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    // 玩家名相关
    const [nameInput, setNameInput] = useState('');
    const [hasName, setHasName] = useState(SaveManager.hasPlayerName());
    const [playerName, setPlayerName] = useState(SaveManager.getPlayerName());
    // 云端存档相关
    const [hasCloudSave, setHasCloudSave] = useState(false);
    const [loadingSave, setLoadingSave] = useState(false);
    const MAX_DRAWS = 3;

    if (!gameContext) {
        return <div style={{ color: 'red', padding: '20px' }}>错误: GameContext未初始化</div>;
    }
    const { dispatch, ActionTypes } = gameContext;

    // 已有玩家名时，检查是否有云端存档
    useEffect(() => {
        if (hasName && playerName) {
            // 如果本地标记已被清除（玩家主动开启了新游戏），则不再查询服务器
            if (!SaveManager.hasCloudSave()) return;
            SaveManager.load(playerName).then(result => {
                if (result.success && result.data?.saveData && Object.keys(result.data.saveData).length > 0) {
                    setHasCloudSave(true);
                }
            }).catch(() => {});
        }
    }, [hasName, playerName]);

    // 老玩家积分自动同步：进入主页时静默上传积分到排行榜
    useEffect(() => {
        if (hasName && playerName) {
            const { totalScore } = calculateTotalScore();
            if (totalScore > 0) {
                SaveManager.updateScore(playerName, totalScore).catch(() => {});
            }
        }
    }, [hasName, playerName]);

    // 名称重复检查状态
    const [nameError, setNameError] = useState('');
    const [checkingName, setCheckingName] = useState(false);

    // 确认玩家名（含重复检测）
    const handleConfirmName = async () => {
        const name = nameInput.trim();
        if (name.length < 2 || name.length > 12) return;
        setNameError('');
        setCheckingName(true);
        try {
            const result = await SaveManager.checkName(name);
            if (result.success && result.exists) {
                setNameError('该玩家名称已被使用，请重新更改');
                setCheckingName(false);
                return;
            }
        } catch (e) {
            // 网络错误时仍允许注册（容错）
        }
        setCheckingName(false);
        SaveManager.setPlayerName(name);
        setPlayerName(name);
        setHasName(true);
        // 在后端创建空记录
        SaveManager.save(name, {}, 0).catch(() => {});
    };

    // 加载云端存档
    const handleLoadSave = async () => {
        setLoadingSave(true);
        try {
            const result = await SaveManager.load(playerName);
            if (result.success && result.data?.saveData) {
                dispatch({ type: 'LOAD_CLOUD_SAVE', payload: { saveData: result.data.saveData } });
            }
        } catch (e) {
            console.error('加载存档失败:', e);
        }
        setLoadingSave(false);
    };

    const handleDraw = () => {
        // 开局首次抽卡 = 开启新游戏，清除旧存档（保留玩家名和积分）
        if (phase === 'intro' && hasCloudSave) {
            const pn = SaveManager.getPlayerName();
            if (pn) SaveManager.clearSave(pn);
            setHasCloudSave(false);
        }

        // 第一抽不计入3次重抽次数；如果是由于重抽按钮点击，则增加次数
        if (phase === 'result' && drawCount < MAX_DRAWS) {
            setDrawCount(prev => prev + 1);
        }

        // 重抽时排除所有已抽过的身份，保证每次抽到新组合
        const drawn = generateIdentity(drawnKeys);
        setDrawnKeys(prev => [...prev, drawn.identityKey]);
        const r = getRarity(drawn.school, drawn.family);
        setIdentity(drawn);
        setRarity(r);
        setPhase('drawing');
        setCardFlipped(false);
        setTimeout(() => setCardFlipped(true), 1200);
        setTimeout(() => setPhase('result'), 2200);
    };

    const handleStartGame = () => {
        // 身份抽卡成就检测
        checkIdentityAchievements(rarity, drawCount);
        dispatch({ type: ActionTypes.INIT_GAME, payload: { identity } });
    };

    const ri = RARITY[rarity] || RARITY.normal;

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <style>{`
                @keyframes spin3d {
                    0%   { transform: rotateY(0deg) scale(1); }
                    50%  { transform: rotateY(180deg) scale(1.1); }
                    100% { transform: rotateY(360deg) scale(1); }
                }
                @keyframes flipIn {
                    from { transform: rotateY(90deg); opacity:0; }
                    to   { transform: rotateY(0deg);  opacity:1; }
                }
                @keyframes fadeUp {
                    from { opacity:0; transform:translateY(20px); }
                    to   { opacity:1; transform:translateY(0); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes pulse {
                    0%,100% { box-shadow:0 0 0 0 rgba(102,126,234,0.5); }
                    50%     { box-shadow:0 0 0 16px rgba(102,126,234,0); }
                }
                .draw-btn { transition: all 0.2s ease; }
                .draw-btn:hover { opacity:0.9; transform:translateY(-2px); }
                .draw-btn:active { transform:translateY(0); }
                .result-card { animation: fadeUp 0.5s ease forwards; }
                .shimmer-text {
                    background: linear-gradient(90deg,#fff 0%,#ffe066 40%,#fff 60%,#ffe066 100%);
                    background-size:200% auto;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    animation: shimmer 2s linear infinite;
                }
            `}</style>

            <div style={{
                maxWidth: '580px', width: '100%',
                background: 'white', borderRadius: '24px',
                padding: '44px 44px 36px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                textAlign: 'center',
            }}>

                {/* ── 阶段 0：玩家名称设置 ── */}
                {!hasName && phase === 'intro' && (
                    <div style={{
                        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
                        backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        zIndex: 10000
                    }}>
                        <div style={{
                            background: 'white', borderRadius: '24px', padding: '36px',
                            maxWidth: '420px', width: '90%',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✏️</div>
                            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#1E293B', margin: '0 0 8px' }}>
                                给自己起个名字吧
                            </h2>
                            <p style={{ fontSize: '14px', color: '#64748B', margin: '0 0 24px' }}>
                                这个名字将伴随你的建筑学生涯
                            </p>
                            <input
                                type="text"
                                value={nameInput}
                                onChange={e => { setNameInput(e.target.value); setNameError(''); }}
                                onKeyDown={e => e.key === 'Enter' && handleConfirmName()}
                                placeholder="请输入你的游戏昵称"
                                maxLength={12}
                                style={{
                                    width: '100%', padding: '14px 16px',
                                    border: '2px solid #E2E8F0', borderRadius: '12px',
                                    fontSize: '16px', fontWeight: '600',
                                    textAlign: 'center', outline: 'none',
                                    transition: 'border-color 0.2s',
                                    boxSizing: 'border-box'
                                }}
                                onFocus={e => e.target.style.borderColor = '#667eea'}
                                onBlur={e => e.target.style.borderColor = '#E2E8F0'}
                            />
                            <p style={{ fontSize: '12px', color: '#94A3B8', margin: '8px 0 4px' }}>
                                2-12 个字符
                            </p>
                            {nameError && (
                                <p style={{ fontSize: '13px', color: '#EF4444', margin: '4px 0 12px', fontWeight: '700' }}>
                                    ⚠️ {nameError}
                                </p>
                            )}
                            <button
                                onClick={handleConfirmName}
                                disabled={nameInput.trim().length < 2 || checkingName}
                                style={{
                                    width: '100%', padding: '14px',
                                    background: nameInput.trim().length >= 2 && !checkingName
                                        ? 'linear-gradient(135deg, #667eea, #764ba2)' : '#E2E8F0',
                                    color: nameInput.trim().length >= 2 && !checkingName ? 'white' : '#94A3B8',
                                    border: 'none', borderRadius: '12px',
                                    fontSize: '16px', fontWeight: '700',
                                    cursor: nameInput.trim().length >= 2 && !checkingName ? 'pointer' : 'not-allowed',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {checkingName ? '检查中...' : '确认并开始'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── 阶段 1：简介 ── */}
                {phase === 'intro' && <>
                    <h1 style={{ fontSize: '46px', fontWeight: '900', color: '#667eea', marginBottom: '8px', textAlign: 'center' }}>
                        建筑生模拟器
                    </h1>
                    <p style={{ fontSize: '17px', color: '#64748B', marginBottom: '28px', textAlign: 'center' }}>重生之我这一世绝不熬夜</p>

                    <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '24px', marginBottom: '24px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#475569', lineHeight: '1.6', margin: 0 }}>
                            <p style={{ marginBottom: '12px', fontSize: '15px' }}><strong>嘿，{playerName || '准建筑师'}，准建筑师。</strong></p>
                            <p style={{ marginBottom: '16px' }}>这里没有普利兹克奖的红地毯，只有拉不完的线条和喝不完的红牛。<br />在《建筑生模拟器》中，你将开启一段为期五年的“非人”生活：</p>

                            <div style={{ display: 'inline-block', textAlign: 'left', margin: '0 auto' }}>
                                <ul style={{ paddingLeft: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <li><strong>博弈导师</strong>：在 7 位性格迥异（且可能都有点心理变态）的导师手下死里逃生。</li>
                                    <li><strong>经营作品集</strong>：每一张图纸都是你的职业命脉，是入职名企还是转行送外卖？全看这 60 周的选择与造化。</li>
                                    <li><strong>临场评图</strong>：面对导师的毒舌，你是选择“逻辑轰炸”强行圆场，还是“情感共鸣”卖惨求生？</li>
                                    <li><strong>终极抉择</strong>：保研、出国、考公、转行…… 建筑学教给你的逻辑，将是你对这个世界进行“降维打击”的唯一武器。</li>
                                </ul>
                            </div>

                            <div style={{
                                marginTop: '16px', padding: '12px', background: 'rgba(239, 68, 68, 0.1)',
                                borderLeft: '4px solid #EF4444', color: '#B91C1C', fontSize: '13px', fontWeight: 'bold',
                                textAlign: 'center'
                            }}>
                                ⚠️ 警告：本游戏不包含睡眠补给。如果你在工作室看到日出，那是再正常不过的“建筑学浪漫”。
                            </div>
                        </div>
                    </div>

                    <div style={{
                        background: 'linear-gradient(135deg,#eef2ff,#f5f3ff)',
                        borderRadius: '12px', padding: '14px', marginBottom: '24px',
                        border: '1px solid #c7d2fe', textAlign: 'center'
                    }}>
                        <p style={{ fontSize: '13px', color: '#5b21b6', margin: 0, lineHeight: '1.7' }}>
                            🎲 <strong>身份抽取</strong>：你的学校背景与家庭背景将随机抽取，<br />
                            决定初始属性与专属技能。命运的骰子即将掷下……
                        </p>
                    </div>

                    {/* 继续游戏按钮（仅有云端存档时显示） */}
                    {hasCloudSave && (
                        <button onClick={handleLoadSave} disabled={loadingSave} className="draw-btn" style={{
                            width: '100%', padding: '17px', marginBottom: '12px',
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            color: 'white', border: 'none', borderRadius: '12px',
                            fontSize: '19px', fontWeight: '700', cursor: loadingSave ? 'wait' : 'pointer',
                        }}>
                            {loadingSave ? '☕ 正在加载存档...' : '☁️ 继续游戏'}
                        </button>
                    )}

                    <button onClick={handleDraw} className="draw-btn" style={{
                        width: '100%', padding: '17px',
                        background: 'linear-gradient(135deg,#667eea,#764ba2)',
                        color: 'white', border: 'none', borderRadius: '12px',
                        fontSize: '19px', fontWeight: '700', cursor: 'pointer',
                        animation: hasCloudSave ? 'none' : 'pulse 2s infinite'
                    }}>
                        🎲 {hasCloudSave ? '开启新游戏' : '开始游戏'}
                    </button>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '18px', textAlign: 'center' }}>
                        v1.0 Final Edition | Made with ❤️ for Architecture Students
                    </p>
                    <p style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px', textAlign: 'center' }}>
                        粤公网安备44010602015390号
                    </p>
                </>}

                {/* ── 阶段 2：抽取动画 ── */}
                {phase === 'drawing' && (
                    <div style={{ padding: '20px 0' }}>
                        <p style={{ fontSize: '18px', color: '#667eea', fontWeight: '700', marginBottom: '36px' }}>
                            命运的骰子正在滚动……
                        </p>
                        <div style={{ perspective: '800px', marginBottom: '36px' }}>
                            <div style={{
                                width: '160px', height: '220px', margin: '0 auto',
                                background: cardFlipped ? ri.gradient : 'linear-gradient(135deg,#1e3a5f,#0f2040)',
                                borderRadius: '18px',
                                boxShadow: cardFlipped ? ri.glow : '0 12px 40px rgba(0,0,0,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                animation: cardFlipped ? 'flipIn 0.6s ease forwards' : 'spin3d 0.8s ease-in-out infinite',
                                transition: 'background 0.3s, box-shadow 0.6s',
                            }}>
                                {!cardFlipped
                                    ? <span style={{ fontSize: '48px', opacity: 0.7 }}>🏗️</span>
                                    : <div style={{ color: 'white', textAlign: 'center', padding: '16px' }}>
                                        <div style={{ fontSize: '28px', marginBottom: '8px' }}>✨</div>
                                        <div style={{ fontSize: '13px', fontWeight: '800' }}>
                                            {identity?.narrative?.title}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                        <p style={{ fontSize: '14px', color: '#94A3B8' }}>正在确认你的命运……</p>
                    </div>
                )}

                {/* ── 阶段 3：结果 ── */}
                {phase === 'result' && identity && (
                    <div className="result-card">
                        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '14px' }}>🎉 身份已确认</p>

                        {/* 身份大卡 */}
                        <div style={{
                            background: ri.gradient,
                            borderRadius: '20px', padding: '28px 24px 24px',
                            marginBottom: '16px', color: 'white', textAlign: 'left',
                            boxShadow: ri.glow, position: 'relative', overflow: 'hidden',
                        }}>
                            {/* 稀有度角标 */}
                            <span style={{
                                position: 'absolute', top: '14px', right: '14px',
                                fontSize: '11px', fontWeight: '800',
                                background: 'rgba(255,255,255,0.22)',
                                padding: '3px 10px', borderRadius: '20px',
                            }}>
                                {ri.label}
                            </span>

                            {/* 标题 */}
                            <h2 className={ri.shimmer ? 'shimmer-text' : ''} style={{
                                fontSize: '28px', fontWeight: '900', margin: '0 0 10px',
                                ...(ri.shimmer ? {} : { color: 'white' })
                            }}>
                                {identity.narrative?.title}
                            </h2>

                            {/* 标签 */}
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '600' }}>
                                    🏫 {identity.school?.name}
                                </span>
                                <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '20px', padding: '3px 12px', fontSize: '12px', fontWeight: '600' }}>
                                    👨‍👩‍👧 {identity.family?.name}
                                </span>
                            </div>

                            {/* 介绍词 */}
                            <p style={{
                                fontSize: '13px', lineHeight: '1.8', fontStyle: 'italic',
                                opacity: 0.92, margin: '0 0 18px',
                                borderLeft: '3px solid rgba(255,255,255,0.45)', paddingLeft: '12px'
                            }}>
                                "{identity.narrative?.description}"
                            </p>

                            {/* 专属技能 */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.3)', paddingTop: '14px' }}>
                                <p style={{ fontSize: '11px', opacity: 0.75, margin: '0 0 4px', fontWeight: '700', letterSpacing: '0.05em' }}>
                                    ⚡ 专属技能
                                </p>
                                <p style={{ fontSize: '16px', fontWeight: '900', margin: '0 0 4px' }}>
                                    {identity.family?.skill?.name}
                                </p>
                                <p style={{ fontSize: '12px', opacity: 0.88, margin: '0 0 6px' }}>
                                    {identity.family?.skill?.description}
                                </p>
                                {/* 技能效果数值 */}
                                <p style={{
                                    fontSize: '12px', fontWeight: '700',
                                    background: 'rgba(0,0,0,0.18)', borderRadius: '8px',
                                    padding: '6px 10px', margin: 0, display: 'inline-block'
                                }}>
                                    📊 {formatEffect(identity.family?.skill?.effect, identity.family?.skill?.cooldown)}
                                </p>
                            </div>
                        </div>

                        {/* 初始属性预览 */}
                        <div style={{
                            background: '#F8FAFC', borderRadius: '12px', padding: '14px 16px',
                            marginBottom: '20px', display: 'grid',
                            gridTemplateColumns: '1fr 1fr', gap: '8px', textAlign: 'left'
                        }}>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                🎨 设计：<strong style={{ color: '#3b82f6' }}>{identity.initialAttributes?.design}</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                💻 软件：<strong style={{ color: '#3b82f6' }}>{identity.initialAttributes?.software}</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                😰 压力：<strong style={{ color: '#ef4444' }}>{identity.initialAttributes?.stress}</strong>
                            </p>
                            <p style={{ fontSize: '12px', color: '#64748B', margin: 0 }}>
                                💰 金钱：<strong style={{ color: '#10b981' }}>¥{identity.initialAttributes?.money?.toLocaleString()}</strong>
                            </p>
                        </div>

                        {/* 额外包裹一层用于放置双按钮 */}
                        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                            <button
                                onClick={handleDraw}
                                disabled={drawCount >= MAX_DRAWS}
                                style={{
                                    flex: 1, padding: '17px',
                                    background: drawCount >= MAX_DRAWS ? '#CBD5E1' : 'linear-gradient(135deg, #10B981, #059669)',
                                    color: drawCount >= MAX_DRAWS ? '#94A3B8' : 'white',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontSize: '18px', fontWeight: '800',
                                    cursor: drawCount >= MAX_DRAWS ? 'not-allowed' : 'pointer',
                                    boxShadow: drawCount >= MAX_DRAWS ? 'none' : '0 8px 16px rgba(16, 185, 129, 0.3)',
                                    transition: 'all 0.2s',
                                }}
                                onMouseEnter={e => {
                                    if (drawCount < MAX_DRAWS) {
                                        e.target.style.transform = 'translateY(-2px)';
                                        e.target.style.filter = 'brightness(1.1)';
                                    }
                                }}
                                onMouseLeave={e => {
                                    if (drawCount < MAX_DRAWS) {
                                        e.target.style.transform = 'translateY(0)';
                                        e.target.style.filter = 'none';
                                    }
                                }}
                            >
                                重新抽取 ({MAX_DRAWS - drawCount}/{MAX_DRAWS})
                            </button>

                            <button onClick={handleStartGame} className="draw-btn" style={{
                                flex: 2, padding: '17px',
                                background: 'linear-gradient(135deg,#667eea,#764ba2)',
                                color: 'white', border: 'none', borderRadius: '12px',
                                fontSize: '19px', fontWeight: '800', cursor: 'pointer',
                                boxShadow: '0 8px 16px rgba(102,126,234,0.3)'
                            }}>
                                🎮 开始游戏
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 顶层绝对定位的快捷设置与档案馆入口 */}
            {phase === 'intro' && (<>
                <div style={{ position: 'fixed', bottom: '24px', right: '32px', zIndex: 100 }}>
                    <button
                        onClick={() => setShowArchives(true)}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '12px 20px',
                            borderRadius: '16px',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    >
                        <span style={{ fontSize: '20px' }}>🏛️</span>
                        档案馆：我的一百种人生
                    </button>
                </div>

                {/* 排行榜按钮（左下角） */}
                <div style={{ position: 'fixed', bottom: '24px', left: '32px', zIndex: 100 }}>
                    <button
                        onClick={() => setShowLeaderboard(true)}
                        style={{
                            background: 'rgba(255,255,255,0.15)',
                            backdropFilter: 'blur(8px)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            padding: '12px 20px',
                            borderRadius: '16px',
                            color: 'white',
                            fontWeight: '800',
                            fontSize: '15px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    >
                        <span style={{ fontSize: '20px' }}>🏆</span>
                        玩家排行榜
                    </button>
                </div>
            </>)}

            {/* 档案馆模态窗 */}
            {showArchives && <ArchivesModal onClose={() => setShowArchives(false)} />}
            {showLeaderboard && <LeaderboardModal onClose={() => setShowLeaderboard(false)} />}
        </div>
    );
}
