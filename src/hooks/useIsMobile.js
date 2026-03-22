// 设备检测 Hook — 基于 CSS matchMedia 实时响应
import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = '(max-width: 768px)';

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        () => window.matchMedia(MOBILE_BREAKPOINT).matches
    );

    useEffect(() => {
        const mq = window.matchMedia(MOBILE_BREAKPOINT);
        const handler = (e) => setIsMobile(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    return isMobile;
}
