/** @jsxImportSource react */
import React from 'react';
import Spline from '@splinetool/react-spline';

interface SplineIslandProps {
    scene: string;
    height?: string;
    badgeText?: string;
}

export default function SplineIsland({
    scene,
    height = 'h-[600px] md:h-[800px]',
    badgeText = '3D Interactive Experience'
}: SplineIslandProps) {
    const [isLoaded, setIsLoaded] = React.useState(false);

    return (
        <div className={`
      relative w-full ${height}
      bg-slate-950/20 backdrop-blur-sm
      rounded-[2.5rem] overflow-hidden 
      border border-white/5 
      shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]
      transition-all duration-1000 ease-in-out
      ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.98]'}
    `}>
            {/* Overlay de profundidad */}
            <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

            <Spline
                scene={scene}
                onLoad={() => setIsLoaded(true)}
            />

            {/* Etiqueta interactiva */}
            <div className="absolute top-8 right-8 z-20 flex items-center gap-3 px-5 py-2.5 bg-black/40 backdrop-blur-xl rounded-full border border-white/10">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-[10px] font-bold text-white/70 tracking-[0.2em] uppercase">
                    {badgeText}
                </span>
            </div>
        </div>
    );
}
