import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import ArchivesModal from './ArchivesModal';
import { tutorialData } from '../data/tutorialData';
import ReactMarkdown from 'react-markdown';
import SaveManager from '../utils/saveManager';
import { calculateTotalScore } from '../utils/scoreCalculator';
import LeaderboardModal from './LeaderboardModal';
import { useIsMobile } from '../hooks/useIsMobile';

export default function SettingsModal({ onClose }) {
    const { dispatch, state } = useGame();
    const isMobile = useIsMobile();
    const [panel, setPanel] = useState('menu');
    const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'success' | 'error'

    // 重新开启指引
    const handleReTutorial = () => {
        dispatch({ type: 'TOGGLE_TUTORIAL', payload: true });
        onClose();
    };

    // 重置游戏
    const handleHardReset = () => {
        dispatch({ type: 'HARD_RESET_GAME' });
        onClose(); // 由于游戏重启可能也会干掉该组件挂载，这里确保UI安全
    };

    // 云端存档
    const handleCloudSave = async () => {
        const playerName = SaveManager.getPlayerName();
        if (!playerName) {
            setSaveStatus('error');
            return;
        }
        setSaveStatus('saving');
        try {
            const { totalScore } = calculateTotalScore();
            const result = await SaveManager.save(playerName, state, totalScore);
            if (result.success) {
                SaveManager.markCloudSave();
                setSaveStatus('success');
            } else {
                setSaveStatus('error');
            }
        } catch (e) {
            setSaveStatus('error');
        }
        setTimeout(() => setSaveStatus(null), 3000);
    };

    const GameDesc = () => (
        <div style={{ textAlign: 'left', lineHeight: '1.7', fontSize: '15px', color: '#334155', maxHeight: '350px', overflowY: 'auto', paddingRight: '12px' }}>
            <h3 style={{ margin: '0 0 16px', color: '#1E293B', fontWeight: '800', position: 'sticky', top: 0, backgroundColor: 'white', paddingBottom: '8px' }}>📖 游戏说明</h3>
            {tutorialData.map(step => (
                <div key={step.id} style={{ marginBottom: '20px' }}>
                    <h4 style={{ color: '#0F172A', fontWeight: '800', marginBottom: '8px', fontSize: '16px' }}>{step.title}</h4>
                    <ReactMarkdown components={{
                        p: ({ node, ...props }) => <p style={{ margin: '0 0 8px' }} {...props} />,
                        strong: ({ node, ...props }) => <strong style={{ color: '#2563EB', fontWeight: '800' }} {...props} />,
                        ul: ({ node, ...props }) => <ul style={{ paddingLeft: '20px', margin: '0 0 8px' }} {...props} />
                    }}>
                        {step.content}
                    </ReactMarkdown>
                </div>
            ))}
            <h4 style={{ color: '#475569', margin: '16px 0 8px' }}>🎯 结局与设置</h4>
            <ul style={{ paddingLeft: '20px', margin: 0 }}>
                <li>通过你在 60 周内的决定与属性，达成多种不同结局。</li>
                <li>可以在设置里点击**保存进度到云端**，随时上传你的当前进度；或点击**玩家排行榜**查看全服排名。</li>
                <li>每次通关后，结局和成就将被收录在**档案馆**中。</li>
            </ul>
        </div>
    );

    const AboutContent = () => (
        <div style={{ textAlign: 'left', lineHeight: '1.8', fontSize: '15px', color: '#334155' }}>
            <h3 style={{ margin: '0 0 16px', color: '#1E293B', fontWeight: '800' }}>ℹ️ 作者的话</h3>
            <p style={{ fontStyle: 'italic', marginBottom: '16px' }}>
                "献给所有为建筑学熬过夜的建筑学子们。🌙"
            </p>
            <p style={{ marginBottom: '16px' }}>
                我开发这款游戏的初衷其实非常简单：希望能在这枯燥、甚至时不时让人头秃抓狂的学习生活里，给大家提供一点额外的乐趣！💻✨ 如果在游玩的过程中，你能暂时抛开现实中熬夜画图的焦虑，狠狠体验一把“爽文”般的人生，或者只是看着那些熟悉的梗忍不住会心一笑，那我的心血就没有白费。🎉
            </p>
            <p style={{ marginBottom: '24px' }}>
                因为这是我个人的独立开发作品，游戏里难免会有不少不成熟或是考虑不周全的地方，希望大家能多多包涵。🙏 如果你觉得这款小游戏还挺好玩，真心希望你能把它推荐给身边的同学们，或者在互联网上分享给更多的人。🚀
            </p>
            <p>
                <strong>致谢：</strong><br />
                感谢所有在游戏开发过程中给予我支持与肯定的人，包括但不限于我的家人、好朋友和老师们。💕<br />
                没有你们的鼓励与肯定，我一定无法坚持“肝”完这款游戏的开发，你们同样也是这款游戏的重要创作者！<br /><br />
                <strong>版本：</strong> v1.0 正式版
            </p>
        </div>
    );

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0, 0, 0, 0.4)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 99990, padding: '20px'
        }}>
            <div style={{
                background: 'white', borderRadius: isMobile ? '16px' : '24px', width: isMobile ? '100%' : '480px',
                minHeight: isMobile ? 'auto' : '400px', maxHeight: isMobile ? '90vh' : 'none',
                padding: isMobile ? '20px' : '32px', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column',
                overflowY: isMobile ? 'auto' : 'visible'
            }}>
                {/* 关闭或返回按钮 */}
                {panel === 'menu' ? (
                    <button onClick={onClose} style={{
                        position: 'absolute', top: '24px', right: '24px',
                        background: '#F1F5F9', border: 'none', width: '36px', height: '36px',
                        borderRadius: '50%', color: '#64748B', fontWeight: 'bold',
                        cursor: 'pointer', transition: 'all 0.2s'
                    }} onMouseOver={e => e.currentTarget.style.background = '#E2E8F0'} onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}>✕</button>
                ) : (
                    <button onClick={() => setPanel('menu')} style={{
                        position: 'absolute', top: '24px', left: '24px',
                        background: '#F1F5F9', border: 'none', padding: '8px 16px',
                        borderRadius: '8px', color: '#64748B', fontWeight: 'bold',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
                        transition: 'all 0.2s'
                    }} onMouseOver={e => e.currentTarget.style.background = '#E2E8F0'} onMouseOut={e => e.currentTarget.style.background = '#F1F5F9'}>← 返回</button>
                )}

                {/* 标题 */}
                <h2 style={{ textAlign: 'center', fontSize: '24px', fontWeight: '900', margin: '0 0 32px', color: '#0F172A' }}>
                    {panel === 'menu' && '⚙️ 游戏设置'}
                    {panel === 'desc' && '游戏说明'}
                    {panel === 'about' && '关于'}
                    {panel === 'archives' && '档案馆加载中...'}
                    {panel === 'restart' && '系统重置'}
                </h2>

                {/* 子面板路由内容 */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    {panel === 'desc' && <GameDesc />}
                    {panel === 'about' && <AboutContent />}

                    {/* 主菜单 */}
                    {panel === 'menu' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, justifyContent: 'center' }}>
                            {/* 云端存档按钮 */}
                            <button onClick={handleCloudSave} disabled={saveStatus === 'saving'} style={{
                                height: '60px', padding: '0', border: '2px solid #c7d2fe',
                                borderRadius: '16px', fontWeight: '800', cursor: 'pointer',
                                fontSize: '16px', transition: 'all 0.2s', whiteSpace: 'nowrap',
                                background: saveStatus === 'success' ? '#F0FDF4' : saveStatus === 'error' ? '#FEF2F2' : '#EEF2FF',
                                color: saveStatus === 'success' ? '#166534' : saveStatus === 'error' ? '#DC2626' : '#4338CA',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {saveStatus === 'saving' ? '☕ 正在保存...' :
                                 saveStatus === 'success' ? '✅ 存档保存成功！' :
                                 saveStatus === 'error' ? '❌ 保存失败，请重试' :
                                 '☁️ 保存进度到云端'}
                            </button>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: isMobile ? '8px' : '16px' }}>
                                <button onClick={() => setPanel('desc')} style={{ height: '60px', padding: '0', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', color: '#334155', fontWeight: '800', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}>📝 游戏说明</button>
                                <button onClick={handleReTutorial} style={{ height: '60px', padding: '0', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', color: '#334155', fontWeight: '800', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}>🎓 新手指引</button>
                                <button onClick={() => setPanel('about')} style={{ height: '60px', padding: '0', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', color: '#334155', fontWeight: '800', cursor: 'pointer', fontSize: '15px', whiteSpace: 'nowrap', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}>ℹ️ 作者的话</button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '8px' : '16px' }}>
                                <button onClick={() => setPanel('archives')} style={{ height: '60px', padding: '0', background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '16px', color: '#166534', fontWeight: '800', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background = '#DCFCE7'} onMouseOut={e => e.currentTarget.style.background = '#F0FDF4'}>
                                    🏛️ 档案馆
                                </button>
                                
                                <button onClick={() => setPanel('leaderboard')} style={{ height: '60px', padding: '0', background: '#FFF7ED', border: '2px solid #FED7AA', borderRadius: '16px', color: '#C2410C', fontWeight: '800', cursor: 'pointer', fontSize: '15px', transition: 'all 0.2s', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onMouseOver={e => e.currentTarget.style.background = '#FFEDD5'} onMouseOut={e => e.currentTarget.style.background = '#FFF7ED'}>
                                    🏆 玩家排行榜
                                </button>
                            </div>

                            <button onClick={() => setPanel('restart')} style={{ height: '60px', padding: '0', background: '#FEF2F2', border: '2px solid #FECACA', borderRadius: '16px', color: '#DC2626', fontWeight: '800', cursor: 'pointer', fontSize: '16px', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap' }} onMouseOver={e => e.currentTarget.style.background = '#FEE2E2'} onMouseOut={e => e.currentTarget.style.background = '#FEF2F2'}>
                                🚪 放弃学业重新开始
                            </button>
                        </div>
                    )}

                    {/* 重新开始的专属二次确认面板 */}
                    {panel === 'restart' && (
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', alignItems: 'center', gap: '24px', padding: '16px 0' }}>
                            <div style={{ fontSize: '56px', lineHeight: 1 }}>⚠️</div>
                            <h3 style={{ color: '#0F172A', fontWeight: '900', margin: 0, fontSize: '22px' }}>确定要放弃当前的学业吗？</h3>
                            <p style={{ color: '#475569', textAlign: 'center', margin: '0 0 12px 0', lineHeight: 1.6, fontSize: '15px' }}>你当前所有的游戏进度将会重置，且无法保存。</p>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
                                <button onClick={() => setPanel('menu')} style={{ padding: '20px', background: '#F8FAFC', border: 'none', borderRadius: '16px', color: '#64748B', fontWeight: '800', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#E2E8F0'} onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}>考虑一下返回</button>
                                <button onClick={handleHardReset} style={{ padding: '20px', background: '#DC2626', border: 'none', borderRadius: '16px', color: 'white', fontWeight: '900', cursor: 'pointer', boxShadow: '0 8px 16px rgba(220,38,38,0.3)', fontSize: '18px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#B91C1C'} onMouseOut={e => e.currentTarget.style.background = '#DC2626'}>确定彻底重置</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 如果档案馆由于面板挂载也用的是独立视窗，需要在此拦截渲染 */}
            {panel === 'archives' && (
                <ArchivesModal onClose={() => setPanel('menu')} />
            )}
            {panel === 'leaderboard' && (
                <LeaderboardModal onClose={() => setPanel('menu')} />
            )}
        </div>
    );
}
