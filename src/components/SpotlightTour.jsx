import React, { useState, useEffect, useRef } from 'react';
import { tutorialData } from '../data/tutorialData';

// 简化的全屏高亮遮罩引导组件 (Spotlight Tour)
export default function SpotlightTour({ onComplete }) {
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const step = tutorialData[stepIndex];
    const tooltipRef = useRef(null);
    const [tooltipPos, setTooltipPos] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 });

    // 监听靶向元素的位置
    useEffect(() => {
        const updateRect = () => {
            if (!step.target) {
                setTargetRect(null);
                setTooltipPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 });
                return;
            }

            const el = document.querySelector(step.target);
            if (el) {
                // 确保元素在视口内。如果不完全在，直接闪现滚动，以便高亮光圈可以直接丝滑滑到新视野
                const rectBefore = el.getBoundingClientRect();
                const isFullyVisible = (
                    rectBefore.top >= 0 &&
                    rectBefore.left >= 0 &&
                    rectBefore.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                    rectBefore.right <= (window.innerWidth || document.documentElement.clientWidth)
                );

                if (!isFullyVisible) {
                    el.scrollIntoView({ behavior: 'auto', block: 'center' });
                }

                // 给 DOM reflow 一闪而过的延迟
                setTimeout(() => {
                    const rect = el.getBoundingClientRect();
                    setTargetRect({
                        top: rect.top,
                        left: rect.left,
                        width: rect.width,
                        height: rect.height
                    });

                    let tLeft;
                    let tTop;
                    let tTransform = 'none';
                    let tWidth = Math.min(480, window.innerWidth - 40);

                    // 居中对齐算法 (根据矩形特性与位置决定)
                    // 1. 特别宽的元素（底部栏等），放置在其正上方，并且水平居中对齐
                    if (rect.width > window.innerWidth * 0.5 || rect.bottom > window.innerHeight - 100) {
                        tLeft = rect.left + rect.width / 2;
                        tTransform = 'translateX(-50%)';

                        // 防止左侧溢出屏幕
                        if (tLeft - tWidth / 2 < 20) {
                            tLeft = 20 + tWidth / 2;
                        }
                        // 防止右侧溢出屏幕
                        if (tLeft + tWidth / 2 > window.innerWidth - 20) {
                            tLeft = window.innerWidth - 20 - tWidth / 2;
                        }

                        tTop = Math.max(20, rect.top - 24);
                        tTransform += ' translateY(-100%)';
                    }
                    // 2. 正常右侧放置点（左侧资源栏等），纵向居中对齐（实现左对右居中对齐的美学）
                    else if (rect.right + 24 + tWidth <= window.innerWidth) {
                        tLeft = rect.right + 24;
                        tTop = rect.top + rect.height / 2;
                        tTransform = 'translateY(-50%)';

                        // 防止纵向被切断
                        if (tTop - 150 < 20) tTop = Math.max(tTop, 150);
                    }
                    // 3. 右侧放不下，看看左侧行不行
                    else if (rect.left - 24 - tWidth >= 0) {
                        tLeft = rect.left - 24;
                        if (step.tooltipAlign === 'top') {
                            // 顶部对齐：文字框顶部与框选框顶部平齐（框选框有8px外扩）
                            tTop = rect.top - 8;
                            tTransform = 'translateX(-100%)';
                        } else {
                            // 默认：纵向居中对齐
                            tTop = rect.top + rect.height / 2;
                            tTransform = 'translate(-100%, -50%)';
                        }
                    }
                    // 4. 两端均无净空，尝试中央上方或下方悬停（并且强制与目标区域垂直中轴线对齐）
                    else {
                        tLeft = rect.left + rect.width / 2;
                        tTransform = 'translateX(-50%)';

                        // 防止左边界溢出
                        if (tLeft - tWidth / 2 < 20) {
                            tLeft = 20 + tWidth / 2;
                        }
                        // 防止右边界溢出
                        if (tLeft + tWidth / 2 > window.innerWidth - 20) {
                            tLeft = window.innerWidth - 20 - tWidth / 2;
                        }

                        if (rect.top > window.innerHeight / 2) {
                            tTop = Math.max(20, rect.top - 24);
                            tTransform += ' translateY(-100%)';
                        } else {
                            tTop = rect.bottom + 24;
                        }
                    }

                    // 刷新卡片目标位置并伴随渐显
                    setTooltipPos({
                        top: `${tTop}px`,
                        left: typeof tLeft === 'number' ? `${tLeft}px` : tLeft,
                        transform: tTransform,
                        width: `${tWidth}px`,
                        opacity: 1
                    });
                    setIsTransitioning(false);
                }, 50);
            } else {
                setTargetRect(null);
                setTooltipPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 });
                setIsTransitioning(false);
            }
        };

        updateRect();
        window.addEventListener('resize', updateRect);

        // 双重保险
        const timer = setTimeout(updateRect, 300);
        return () => {
            window.removeEventListener('resize', updateRect);
            clearTimeout(timer);
        };
    }, [step.target, stepIndex]);

    const handleNext = () => {
        if (stepIndex < tutorialData.length - 1) {
            setIsTransitioning(true);
            setTooltipPos(prev => ({ ...prev, opacity: 0 })); // 立即隐身卡片
            setTimeout(() => {
                setStepIndex(stepIndex + 1);
            }, 100); // 加快节奏，从300ms缩短到100ms
        } else {
            onComplete();
        }
    };

    const handlePrev = () => {
        if (stepIndex > 0) {
            setIsTransitioning(true);
            setTooltipPos(prev => ({ ...prev, opacity: 0 }));
            setTimeout(() => {
                setStepIndex(stepIndex - 1);
            }, 100); // 同步缩短
        }
    };

    const isFirst = stepIndex === 0;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999, // 确保在最顶层
            pointerEvents: 'auto',
            overflow: 'hidden'
        }}>
            {/* 遮罩背景及镂空阴影 */}
            <div style={{
                position: 'absolute',
                top: targetRect ? targetRect.top - 8 : 0,
                left: targetRect ? targetRect.left - 8 : 0,
                width: targetRect ? targetRect.width + 16 : '100%',
                height: targetRect ? targetRect.height + 16 : '100%',
                borderRadius: targetRect ? '12px' : '0',
                boxShadow: targetRect ? '0 0 0 9999px rgba(0, 0, 0, 0.6)' : 'none',
                background: targetRect ? 'transparent' : 'rgba(0, 0, 0, 0.6)',
                transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)', // 改为0.3s加速光环移动
                pointerEvents: 'none' // 让点击能够穿透(如果你想点的话，不过教程通常不穿透，所以外层设了auto阻止传播)
            }} />

            {/* 提示气泡框 */}
            <div
                ref={tooltipRef}
                style={{
                    position: 'absolute',
                    top: tooltipPos.top,
                    left: tooltipPos.left,
                    transform: tooltipPos.transform,
                    opacity: tooltipPos.opacity, // 绑定呼吸特效
                    background: 'white',
                    borderRadius: '16px',
                    padding: '24px',
                    width: tooltipPos.width || '340px',
                    maxWidth: '480px', // 宽屏大画幅
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transition: 'opacity 0.2s ease-out', // 加快卡片浮现的速度
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                {/* 标题 */}
                <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: '18px',
                    fontWeight: '800',
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span>{step.title}</span>
                    {/* 关闭按钮 */}
                    <button
                        onClick={onComplete}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            lineHeight: 1,
                            padding: '4px'
                        }}
                    >
                        ×
                    </button>
                </h3>

                {/* 内容 (支持 **粗体** 解析与换行) */}
                <div style={{
                    fontSize: '14px',
                    color: '#475569',
                    lineHeight: '1.6',
                    marginBottom: '28px',
                    whiteSpace: 'pre-wrap'
                }}>
                    {step.content.split(/(\*\*.*?\*\*)/g).map((part, i) => {
                        if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={i} style={{ color: '#3B82F6', fontWeight: '800' }}>{part.slice(2, -2)}</strong>;
                        }
                        return <span key={i}>{part}</span>;
                    })}
                </div>

                {/* 底部导航 */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: 'auto'
                }}>
                    {/* 进度 */}
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                        第 {stepIndex + 1} / {tutorialData.length} 步
                    </span>

                    {/* 按钮区域 */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        {step.skipText && (
                            <button
                                onClick={onComplete}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    background: 'white',
                                    color: '#64748B',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'all 0.2s'
                                }}
                                onMouseOver={(e) => { e.target.style.background = '#F8FAFC'; e.target.style.color = '#334155' }}
                                onMouseOut={(e) => { e.target.style.background = 'white'; e.target.style.color = '#64748B' }}
                            >
                                {step.skipText}
                            </button>
                        )}
                        {!isFirst && (
                            <button
                                onClick={handlePrev}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    transition: 'background 0.2s'
                                }}
                                onMouseOver={(e) => e.target.style.background = '#E2E8F0'}
                                onMouseOut={(e) => e.target.style.background = '#F1F5F9'}
                            >
                                上一步
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#3B82F6',
                                color: 'white',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '14px',
                                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.target.style.transform = 'translateY(-1px)'; e.target.style.boxShadow = '0 6px 10px rgba(59, 130, 246, 0.4)' }}
                            onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 6px rgba(59, 130, 246, 0.3)' }}
                        >
                            {step.buttonText || '下一步'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
