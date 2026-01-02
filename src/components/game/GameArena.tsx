import React from 'react';

interface GameArenaProps {
  ballPosition: { x: number; y: number };
  isConnected: boolean;
}

export const GameArena: React.FC<GameArenaProps> = ({ ballPosition, isConnected }) => {
  // Map control values (-45 to 45 degrees) to position (0% to 100%)
  const normalizePosition = (value: number, isGamma: boolean = false) => {
    const maxAngle = isGamma ? 45 : 45;
    const clamped = Math.max(-maxAngle, Math.min(maxAngle, value));
    return ((clamped + maxAngle) / (maxAngle * 2)) * 100;
  };

  const xPos = normalizePosition(ballPosition.x, true);
  const yPos = normalizePosition(ballPosition.y, false);

  return (
    <div className="relative w-full max-w-2xl aspect-square mx-auto">
      {/* Outer glow ring */}
      <div className="absolute inset-0 rounded-2xl border-2 border-primary/30 box-glow animate-pulse-glow" />
      
      {/* Grid background */}
      <div className="absolute inset-2 rounded-xl bg-card/50 grid-pattern overflow-hidden">
        {/* Scanline effect */}
        <div className="absolute inset-0 scanline pointer-events-none" />
        
        {/* Center crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-primary/30 to-transparent" />
        </div>

        {/* Corner decorations */}
        {[
          'top-4 left-4',
          'top-4 right-4 rotate-90',
          'bottom-4 right-4 rotate-180',
          'bottom-4 left-4 -rotate-90',
        ].map((position, i) => (
          <div
            key={i}
            className={`absolute ${position} w-8 h-8 border-l-2 border-t-2 border-primary/50`}
          />
        ))}

        {/* The controllable ball */}
        <div
          className="absolute w-12 h-12 -translate-x-1/2 -translate-y-1/2 transition-all duration-75 ease-out"
          style={{
            left: `${xPos}%`,
            top: `${yPos}%`,
          }}
        >
          {/* Ball core */}
          <div className={`
            w-full h-full rounded-full 
            ${isConnected 
              ? 'bg-gradient-to-br from-primary via-neon-cyan to-neon-purple box-glow-strong' 
              : 'bg-muted-foreground/50'
            }
            transition-all duration-300
          `}>
            {/* Inner glow */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
          </div>
          
          {/* Orbit ring when connected */}
          {isConnected && (
            <div className="absolute inset-[-8px] rounded-full border border-primary/30 animate-glow-ring" />
          )}
        </div>

        {/* Status indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
          <span className="text-xs text-muted-foreground font-orbitron tracking-wider uppercase">
            {isConnected ? 'Controller Active' : 'Waiting for Controller'}
          </span>
        </div>
      </div>
    </div>
  );
};
