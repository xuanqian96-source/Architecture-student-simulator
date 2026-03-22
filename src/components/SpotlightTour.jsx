import React, { useState, useEffect, useRef } from 'react';
import { tutorialData, mobileTutorialData } from '../data/tutorialData';
import { useIsMobile } from '../hooks/useIsMobile';

// 简化的全屏高亮遮罩引导组件 (Spotlight Tour)
export default function SpotlightTour({ onComplete }) {
    const isMobile = useIsMobile();
    const steps = isMobile ? mobileTutorialData : tutorialData;
    const [stepIndex, setStepIndex] = useState(0);
    const [targetRect, setTargetRect] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const step = steps[stepIndex];
    const tooltipRef = useRef(null);
    const [tooltipPos, setTooltipPos] = useState({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 0 });

    // 监听靶向元素的位置（仅桌面端）
    useEffect(() => {
        // 移动端：直接居中展示，不定位元素
        if (isMobile) {
            setTargetRect(null);
            setTooltipPos({
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: `${Math.min(340, window.innerWidth - 32)}px`,
                opacity: 1
            });
            setIsTransitioning(false);
            return;
        }

        // 桌面端：原有定位逻辑
        const updateRect = () => {
            if (!step.target) {
                setTargetRect(null);
                setTooltipPos({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)', opacity: 1 });
                return;
            }

            const el = document.querySelector(step.target);
            if (el) {
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

                    if (rect.width > window.innerWidth * 0.5 || rect.bottom > window.innerHeight - 100) {
                        tLeft = rect.left + rect.width / 2;
                        tTransform = 'translateX(-50%)';
                        if (tLeft - tWidth / 2 < 20) tLeft = 20 + tWidth / 2;
                        if (tLeft + tWidth / 2 > window.innerWidth - 20) tLeft = window.innerWidth - 20 - tWidth / 2;
                        tTop = Math.max(20, rect.top - 24);
                        tTransform += ' translateY(-100%)';
                    } else if (rect.right + 24 + tWidth <= window.innerWidth) {
                        tLeft = rect.right + 24;
                        tTop = rect.top + rect.height / 2;
                        tTransform = 'translateY(-50%)';
                        if (tTop - 150 < 20) tTop = Math.max(tTop, 150);
                    } else if (rect.left - 24 - tWidth >= 0) {
                        tLeft = rect.left - 24;
                        if (step.tooltipAlign === 'top') {
                            tTop = rect.top - 8;
                            tTransform = 'translateX(-100%)';
                        } else {
                            tTop = rect.top + rect.height / 2;
                            tTransform = 'translate(-100%, -50%)';
                        }
                    } else {
                        tLeft = rect.left + rect.width / 2;
                        tTransform = 'translateX(-50%)';
                        if (tLeft - tWidth / 2 < 20) tLeft = 20 + tWidth / 2;
                        if (tLeft + tWidth / 2 > window.innerWidth - 20) tLeft = window.innerWidth - 20 - tWidth / 2;
                        if (rect.top > window.innerHeight / 2) {
                            tTop = Math.max(20, rect.top - 24);
                            tTransform += ' translateY(-100%)';
                        } else {
                            tTop = rect.bottom + 24;
                        }
                    }

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
        const timer = setTimeout(updateRect, 300);
        return () => {
            window.removeEventListener('resize', updateRect);
            clearTimeout(timer);
        };
    }, [step.target, stepIndex, isMobile]);

    const handleNext = () => {
        if (stepIndex < steps.length - 1) {
            setIsTransitioning(true);
            setTooltipPos(prev => ({ ...prev, opacity: 0 }));
            setTimeout(() => {
                setStepIndex(stepIndex + 1);
            }, 100);
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
            }, 100);
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
            zIndex: 9999,
            pointerEvents: 'auto',
            overflow: 'hidden'
        }}>
            {/* 遮罩背景及镂空阴影 */}
            {isMobile ? (
                /* 移动端：纯半透明遮罩，无镂空 */
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    pointerEvents: 'none'
                }} />
            ) : (
                /* 桌面端：原有镂空高亮 */
                <div style={{
                    position: 'absolute',
                    top: targetRect ? targetRect.top - 8 : 0,
                    left: targetRect ? targetRect.left - 8 : 0,
                    width: targetRect ? targetRect.width + 16 : '100%',
                    height: targetRect ? targetRect.height + 16 : '100%',
                    borderRadius: targetRect ? '12px' : '0',
                    boxShadow: targetRect ? '0 0 0 9999px rgba(0, 0, 0, 0.6)' : 'none',
                    background: targetRect ? 'transparent' : 'rgba(0, 0, 0, 0.6)',
                    transition: 'all 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                    pointerEvents: 'none'
                }} />
            )}

            {/* 提示气泡框 */}
            <div
                ref={tooltipRef}
                style={{
                    position: 'absolute',
                    top: tooltipPos.top,
                    left: tooltipPos.left,
                    transform: tooltipPos.transform,
                    opacity: tooltipPos.opacity,
                    background: 'white',
                    borderRadius: isMobile ? '20px' : '16px',
                    padding: isMobile ? '20px 18px' : '24px',
                    width: tooltipPos.width || '340px',
                    maxWidth: isMobile ? 'calc(100vw - 32px)' : '480px',
                    maxHeight: isMobile ? '70vh' : 'none',
                    overflowY: isMobile ? 'auto' : 'visible',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                    transition: 'opacity 0.2s ease-out',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                }}
            >
                {/* 标题 */}
                <h3 style={{
                    margin: '0 0 12px 0',
                    fontSize: isMobile ? '16px' : '18px',
                    fontWeight: '800',
                    color: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <span>{step.title}</span>
                    <button
                        onClick={onComplete}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '20px',
                            color: '#94A3B8',
                            cursor: 'pointer',
                            lineHeight: 1,
                            padding: '4px',
                            flexShrink: 0,
                        }}
                    >
                        ×
                    </button>
                </h3>

                {/* 内容 */}
                <div style={{
                    fontSize: isMobile ? '13px' : '14px',
                    color: '#475569',
                    lineHeight: '1.6',
                    marginBottom: isMobile ? '16px' : '28px',
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
                    marginTop: 'auto',
                    flexWrap: isMobile ? 'wrap' : 'nowrap',
                    gap: isMobile ? '8px' : '0',
                }}>
                    <span style={{ fontSize: '13px', color: '#94A3B8', fontWeight: '600' }}>
                        第 {stepIndex + 1} / {steps.length} 步
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        {step.skipText && (
                            <button
                                onClick={onComplete}
                                style={{
                                    padding: isMobile ? '8px 12px' : '8px 16px',
                                    borderRadius: '8px',
                                    border: '1px solid #E2E8F0',
                                    background: 'white',
                                    color: '#64748B',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '13px' : '14px',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {step.skipText}
                            </button>
                        )}
                        {!isFirst && (
                            <button
                                onClick={handlePrev}
                                style={{
                                    padding: isMobile ? '8px 12px' : '8px 16px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: '#F1F5F9',
                                    color: '#475569',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '13px' : '14px',
                                    transition: 'background 0.2s'
                                }}
                            >
                                上一步
                            </button>
                        )}
                        <button
                            onClick={handleNext}
                            style={{
                                padding: isMobile ? '8px 12px' : '8px 16px',
                                borderRadius: '8px',
                                border: 'none',
                                background: '#3B82F6',
                                color: 'white',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: isMobile ? '13px' : '14px',
                                boxShadow: '0 4px 6px rgba(59, 130, 246, 0.3)',
                                transition: 'all 0.2s'
                            }}
                        >
                            {step.buttonText || '下一步'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
