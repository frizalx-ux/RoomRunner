import React from 'react';
import type { RoomObject } from '@/hooks/useGameRoom';

interface GameArenaProps {
  roomObjects: RoomObject[];
  character: {
    x: number;
    y: number;
    facingRight: boolean;
    isJumping: boolean;
    isGrounded: boolean;
  };
  characterWidth: number;
  characterHeight: number;
  isConnected: boolean;
}

export const GameArena: React.FC<GameArenaProps> = ({ 
  roomObjects, 
  character, 
  characterWidth, 
  characterHeight,
  isConnected 
}) => {
  return (
    <div className="relative w-full aspect-video mx-auto bg-gradient-to-b from-card/80 to-background rounded-2xl overflow-hidden border-2 border-primary/30 box-glow">
      {/* Grid overlay */}
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      {/* Scanline effect */}
      <div className="absolute inset-0 scanline pointer-events-none opacity-30" />

      {/* Room objects / Platforms */}
      {roomObjects.map((obj) => (
        <div
          key={obj.id}
          className="absolute transition-all duration-200"
          style={{
            left: `${obj.x}%`,
            top: `${obj.y}%`,
            width: `${obj.width}%`,
            height: `${obj.height}%`,
          }}
        >
          {/* Platform visual */}
          <div className={`
            w-full h-full rounded-lg border-2 
            ${obj.name === 'Floor' 
              ? 'bg-gradient-to-t from-primary/40 to-primary/20 border-primary/50' 
              : 'bg-gradient-to-t from-secondary/40 to-secondary/20 border-secondary/50 box-glow-purple'
            }
          `}>
            {/* Platform label */}
            {obj.name !== 'Floor' && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-orbitron text-muted-foreground whitespace-nowrap">
                {obj.name}
              </div>
            )}
            {/* Surface highlight */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
        </div>
      ))}

      {/* Character - 3D Side-View Yoshi */}
      <div
        className="absolute transition-all duration-75 ease-out pointer-events-none"
        style={{
          left: `${character.x}%`,
          top: `${character.y}%`,
          width: `${characterWidth}%`,
          height: `${characterHeight}%`,
          transform: `scaleX(${character.facingRight ? 1 : -1})`,
        }}
      >
        <svg
          viewBox="0 0 50 60"
          className="w-full h-full"
          style={{ 
            filter: isConnected ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3)) drop-shadow(0 0 12px rgba(34, 197, 94, 0.4))' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          }}
        >
          <defs>
            {/* 3D body gradient */}
            <radialGradient id="bodyGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#6EE7B7" />
              <stop offset="50%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#15803D" />
            </radialGradient>
            {/* Shell gradient */}
            <radialGradient id="shellGrad" cx="40%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#FCA5A5" />
              <stop offset="50%" stopColor="#EF4444" />
              <stop offset="100%" stopColor="#B91C1C" />
            </radialGradient>
            {/* Boot gradient */}
            <radialGradient id="bootGrad" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FDBA74" />
              <stop offset="60%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#C2410C" />
            </radialGradient>
            {/* Belly gradient */}
            <radialGradient id="bellyGrad" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#D1FAE5" />
            </radialGradient>
          </defs>

          {/* Tail */}
          <ellipse 
            cx="8" cy="38" rx="6" ry="4" 
            fill="url(#bodyGrad)"
            className={!character.isGrounded ? '' : character.isJumping ? '' : 'animate-[wiggle_0.3s_ease-in-out_infinite]'}
          />

          {/* Back leg (behind body) */}
          <g className={!character.isGrounded ? '' : 'animate-[walk_0.25s_ease-in-out_infinite]'}>
            <ellipse cx="22" cy="52" rx="6" ry="4" fill="url(#bootGrad)" />
            <rect x="18" y="44" width="8" height="8" rx="3" fill="url(#bodyGrad)" />
          </g>

          {/* Body - side profile oval */}
          <ellipse cx="24" cy="36" rx="14" ry="12" fill="url(#bodyGrad)" />
          
          {/* Belly - lighter patch */}
          <ellipse cx="28" cy="38" rx="8" ry="7" fill="url(#bellyGrad)" />

          {/* Shell/Saddle on back */}
          <ellipse cx="18" cy="30" rx="8" ry="6" fill="url(#shellGrad)" />
          <ellipse cx="18" cy="28" rx="5" ry="3" fill="#FCA5A5" opacity="0.5" />

          {/* Front leg */}
          <g className={!character.isGrounded ? '' : 'animate-[walkAlt_0.25s_ease-in-out_infinite]'}>
            <ellipse cx="32" cy="52" rx="6" ry="4" fill="url(#bootGrad)" />
            <rect x="28" y="44" width="8" height="8" rx="3" fill="url(#bodyGrad)" />
          </g>

          {/* Arm */}
          <ellipse 
            cx="34" cy="34" rx="4" ry="6" 
            fill="url(#bodyGrad)"
            className={character.isJumping ? 'origin-center -rotate-45' : ''}
            style={{ transformOrigin: '34px 30px', transform: character.isJumping ? 'rotate(-30deg)' : 'rotate(10deg)' }}
          />

          {/* Neck */}
          <ellipse cx="34" cy="24" rx="6" ry="8" fill="url(#bodyGrad)" />

          {/* Head - elongated snout facing right */}
          <ellipse cx="40" cy="16" rx="8" ry="9" fill="url(#bodyGrad)" />
          
          {/* Snout/Nose - extending forward */}
          <ellipse cx="48" cy="18" rx="6" ry="5" fill="url(#bodyGrad)" />
          <ellipse cx="50" cy="17" rx="3" ry="2.5" fill="#15803D" />
          {/* Nostril */}
          <circle cx="52" cy="16" r="1.2" fill="#064E3B" />

          {/* Cheek */}
          <ellipse cx="42" cy="20" rx="4" ry="3" fill="#BBF7D0" opacity="0.6" />
          
          {/* Eye - side view, one visible */}
          <ellipse cx="38" cy="12" rx="5" ry="6" fill="white" />
          <ellipse cx="40" cy="13" rx="3" ry="4" fill="#1F2937" />
          <circle cx="41" cy="11" r="1.5" fill="white" />
          
          {/* Eyelid hint for expression */}
          <path d="M 33 10 Q 38 8 43 10" stroke="#15803D" strokeWidth="1.5" fill="none" />

          {/* Head crest/spikes */}
          <ellipse cx="32" cy="8" rx="3" ry="4" fill="#EF4444" />
          <ellipse cx="28" cy="10" rx="2.5" ry="3" fill="#EF4444" />
          <ellipse cx="25" cy="12" rx="2" ry="2.5" fill="#EF4444" />

          {/* Mouth line */}
          <path d="M 46 20 Q 50 22 52 20" stroke="#064E3B" strokeWidth="0.8" fill="none" />
        </svg>
        
        {/* Jump dust/sparkle */}
        {character.isJumping && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
            <div className="w-1.5 h-1.5 bg-green-300/70 rounded-full blur-[1px] animate-ping" />
            <div className="w-1 h-1 bg-yellow-200/60 rounded-full blur-[1px]" style={{ animationDelay: '0.1s' }} />
          </div>
        )}
      </div>

      {/* Status overlay */}
      <div className="absolute top-4 left-4 flex items-center gap-2 bg-card/80 px-3 py-1.5 rounded-full border border-border">
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse' : 'bg-muted-foreground'}`} />
        <span className="text-xs font-orbitron text-muted-foreground uppercase tracking-wider">
          {isConnected ? 'Controller Connected' : 'Waiting for Player'}
        </span>
      </div>

      {/* Instructions overlay when not connected */}
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="text-center space-y-2">
            <p className="text-2xl font-orbitron text-glow">Scan QR Code</p>
            <p className="text-muted-foreground">to start playing</p>
          </div>
        </div>
      )}
    </div>
  );
};
