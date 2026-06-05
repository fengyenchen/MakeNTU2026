import { useRef, useState, useEffect } from 'react';
import './App.css';

export default function Joystick({ onMove = () => { }, onEnd = () => { } }) {
    const baseRef = useRef(null);
    const knobRef = useRef(null);
    const dragging = useRef(false);
    const [pos, setPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const onPointerMove = (e) => {
            if (!dragging.current) return;
            const base = baseRef.current.getBoundingClientRect();
            const centerX = base.left + base.width / 2;
            const centerY = base.top + base.height / 2;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const dx = clientX - centerX;
            const dy = clientY - centerY;
            const max = Math.min(base.width, base.height) / 2;
            const clampedX = Math.max(-max, Math.min(max, dx));
            const clampedY = Math.max(-max, Math.min(max, dy));
            const nx = clampedX / max; // -1..1
            const ny = clampedY / max; // -1..1
            setPos({ x: nx, y: ny });
            onMove(nx, ny);
        };

        const onPointerUp = () => {
            if (!dragging.current) return;
            dragging.current = false;
            setPos({ x: 0, y: 0 });
            onEnd();
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('touchmove', onPointerMove);
            window.removeEventListener('touchend', onPointerUp);
        };

        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('touchmove', onPointerMove, { passive: false });
        window.addEventListener('touchend', onPointerUp);

        return () => {
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('touchmove', onPointerMove);
            window.removeEventListener('touchend', onPointerUp);
        };
    }, [onMove, onEnd]);

    const handleDown = (e) => {
        e.preventDefault();
        dragging.current = true;
    };

    const knobStyle = {
        transform: `translate(${pos.x * 40}px, ${pos.y * 40}px)`
    };

    return (
        <div className="joystick-wrapper">
            <div className="joystick-base" ref={baseRef} onPointerDown={handleDown} onTouchStart={handleDown}>
                <div className="joystick-knob" ref={knobRef} style={knobStyle}></div>
            </div>
            <div className="joystick-hint">拖曳控制方向，放開即停止</div>
        </div>
    );
}
