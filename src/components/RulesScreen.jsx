// 游戏规则说明界面

import React from 'react';
import { useGame } from '../logic/gameState';

export default function RulesScreen() {
    const { dispatch, ActionTypes } = useGame();

    const handleStartGame = () => {
        dispatch({ type: ActionTypes.INIT_GAME });
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                maxWidth: '640px',
                width: '100%',
                overflowY: 'auto',
                maxHeight: '90vh',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
            }}>
                <h1 style={{
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1E293B',
                    marginBottom: '24px',
                    textAlign: 'center'
                }}>
                    游戏规则
                </h1>

                <div style={{ fontSize: '16px', lineHeight: '1.8', color: '#475569' }}>
                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                            🎯 胜利条件
                        </h3>
                        <p>顺利完成5年建筑学学业,获得毕业证书。在此期间,你需要:</p>
                        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                            <li>每学期完成设计课题(progress ≥ 100%)</li>
                            <li>通过期中和期末评图(quality达到标准)</li>
                            <li>避免过度压力导致burnout</li>
                            <li>避免连续2次评图警告被劝退</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                            📊 核心数值
                        </h3>
                        <ul style={{ marginLeft: '20px' }}>
                            <li><strong>设计 Design</strong>: 影响质量提升速度</li>
                            <li><strong>软件 Software</strong>: 影响进度完成速度</li>
                            <li><strong>压力 Stress</strong>: 0-100,达到100会停摆</li>
                            <li><strong>金钱 Money</strong>: 用于缓解压力、购买道具等</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                            ⚙️ 游戏机制
                        </h3>
                        <ul style={{ marginLeft: '20px' }}>
                            <li>每周可执行2次行动：通宵画图(受软件能力加成)、方案推敲(受设计能力加成)、学习等</li>
                            <li>点击"下一周"推进游戏,可能触发随机事件</li>
                            <li>第6周期中评图,第12周期末评图</li>
                            <li>第10-11周需要制作模型(影响最终质量)</li>
                        </ul>
                    </section>

                    <section style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                            💡 提示
                        </h3>
                        <p style={{ color: '#64748B', fontStyle: 'italic' }}>
                            合理平衡进度与质量,注意压力管理。不同身份有不同的初始优势和劣势,善用家庭生活费和技能!
                        </p>
                    </section>

                    <section>
                        <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                            ⚙️ 游戏设置
                        </h3>
                        <p>右上角的 ⚙️ 齿轮按钮是你的游戏设置入口，包含以下功能：</p>
                        <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                            <li><strong>游戏说明</strong>：随时查阅完整的游戏规则与机制说明</li>
                            <li><strong>再次查看新手指引</strong>：可以重新开启新手教程，随时复习</li>
                            <li><strong>档案馆</strong>：查看你历史游戏中的结局记录</li>
                            <li><strong>重新开始</strong>：放弃当前进度，开启全新的建筑生涯</li>
                        </ul>
                    </section>
                </div>

                <button
                    onClick={handleStartGame}
                    style={{
                        width: '100%',
                        padding: '16px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '12px',
                        fontSize: '18px',
                        fontWeight: '700',
                        cursor: 'pointer',
                        marginTop: '32px',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#2563EB'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#3B82F6'}
                >
                    开始抽身份
                </button>
            </div>
        </div>
    );
}
