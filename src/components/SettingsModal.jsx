import React, { useState } from 'react';
import { useGame } from '../logic/gameState';
import ArchivesModal from './ArchivesModal';
import { tutorialData } from '../data/tutorialData';
import ReactMarkdown from 'react-markdown';

export default function SettingsModal({ onClose }) {
    const { dispatch } = useGame();
    // panel 类型: 'menu' | 'desc' | 'about' | 'archives' | 'restart'
    const [panel, setPanel] = useState('menu');

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
        </div>
    );

    const AboutContent = () => (
        <div style={{ textAlign: 'left', lineHeight: '1.8', fontSize: '15px', color: '#334155' }}>
            <h3 style={{ margin: '0 0 16px', color: '#1E293B', fontWeight: '800' }}>ℹ️ 作者的话</h3>
            <p style={{ fontStyle: 'italic', marginBottom: '24px' }}>
                "这是一部由您与您的专属AI架构师共同倾注心血熔铸而成的生存模拟器。它献给所有在图纸、参数化与无尽熬夜中挣扎跋涉的建筑学子们。"
            </p>
            <p>
                <strong>协同开发：</strong>玩家总监 与 Antigravity 系统终端<br />
                <strong>致谢：</strong>感谢建筑学教会了我们在极限压榨中如何做一名无休无眠的工程师。<br />
                <strong>版本：</strong>v1.2 (视觉重构版)
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
                background: 'white', borderRadius: '24px', width: '480px',
                minHeight: '400px', padding: '32px', position: 'relative',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', display: 'flex', flexDirection: 'column'
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
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                                <button onClick={() => setPanel('desc')} style={{ padding: '20px 8px', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', color: '#334155', fontWeight: '800', cursor: 'pointer', fontSize: '16px', whiteSpace: 'nowrap', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}>📝 游戏说明</button>
                                <button onClick={handleReTutorial} style={{ padding: '20px 8px', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', color: '#334155', fontWeight: '800', cursor: 'pointer', fontSize: '16px', whiteSpace: 'nowrap', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}>🎓 新手指引</button>
                                <button onClick={() => setPanel('about')} style={{ padding: '20px 8px', background: '#F8FAFC', border: '2px solid #E2E8F0', borderRadius: '16px', color: '#334155', fontWeight: '800', cursor: 'pointer', fontSize: '16px', whiteSpace: 'nowrap', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#F1F5F9'} onMouseOut={e => e.currentTarget.style.background = '#F8FAFC'}>ℹ️ 作者的话</button>
                            </div>

                            <button onClick={() => setPanel('archives')} style={{ padding: '20px', background: '#F0FDF4', border: '2px solid #BBF7D0', borderRadius: '16px', color: '#166534', fontWeight: '800', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#DCFCE7'} onMouseOut={e => e.currentTarget.style.background = '#F0FDF4'}>
                                🏛️ 档案馆：我的一百种人生
                            </button>

                            <button onClick={() => setPanel('restart')} style={{ padding: '20px', background: '#FEF2F2', border: '2px solid #FECACA', borderRadius: '16px', color: '#DC2626', fontWeight: '800', cursor: 'pointer', fontSize: '18px', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.background = '#FEE2E2'} onMouseOut={e => e.currentTarget.style.background = '#FEF2F2'}>
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
        </div>
    );
}
