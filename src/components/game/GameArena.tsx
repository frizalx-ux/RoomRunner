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

      {/* Character - Cute Yoshi */}
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
        {/* Main Yoshi body - no background box */}
        <svg
          viewBox="0 0 40 50"
          className={`w-full h-full drop-shadow-lg ${character.isJumping ? 'animate-pulse' : ''}`}
          style={{ filter: isConnected ? 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' : 'none' }}
        >
          {/* Body - round green belly */}
          <ellipse cx="20" cy="32" rx="12" ry="10" fill="#4ADE80" />
          <ellipse cx="20" cy="32" rx="10" ry="8" fill="#22C55E" />
          {/* White belly patch */}
          <ellipse cx="20" cy="34" rx="7" ry="5" fill="#F0FDF4" />
          
          {/* Head - round cute shape */}
          <ellipse cx="20" cy="16" rx="11" ry="10" fill="#4ADE80" />
          <ellipse cx="20" cy="16" rx="9" ry="8" fill="#22C55E" />
          
          {/* Big cute eyes */}
          <ellipse cx="15" cy="13" rx="5" ry="6" fill="white" />
          <ellipse cx="25" cy="13" rx="5" ry="6" fill="white" />
          {/* Pupils */}
          <circle cx="16" cy="14" r="2.5" fill="#1F2937" />
          <circle cx="26" cy="14" r="2.5" fill="#1F2937" />
          {/* Eye shine */}
          <circle cx="17" cy="12" r="1" fill="white" />
          <circle cx="27" cy="12" r="1" fill="white" />
          
          {/* Cute snout/nose */}
          <ellipse cx="20" cy="20" rx="6" ry="4" fill="#4ADE80" />
          <ellipse cx="20" cy="20" rx="5" ry="3" fill="#22C55E" />
          {/* Nostrils */}
          <circle cx="18" cy="19" r="1" fill="#166534" />
          <circle cx="22" cy="19" r="1" fill="#166534" />
          
          {/* Cute smile */}
          <path d="M 16 22 Q 20 25 24 22" stroke="#166534" strokeWidth="1" fill="none" strokeLinecap="round" />
          
          {/* Red shell/saddle */}
          <ellipse cx="20" cy="30" rx="8" ry="4" fill="#EF4444" />
          <ellipse cx="20" cy="29" rx="6" ry="2.5" fill="#DC2626" />
          {/* Shell shine */}
          <ellipse cx="18" cy="28" rx="2" ry="1" fill="#FCA5A5" opacity="0.6" />
          
          {/* Cute little arms */}
          <ellipse cx="8" cy="30" rx="3" ry="4" fill="#4ADE80" />
          <ellipse cx="32" cy="30" rx="3" ry="4" fill="#4ADE80" />
          
          {/* Feet - orange boots */}
          <ellipse cx="13" cy="44" rx="5" ry="3" fill="#FB923C" />
          <ellipse cx="27" cy="44" rx="5" ry="3" fill="#FB923C" />
          {/* Boot tops */}
          <rect x="9" y="40" width="8" height="4" rx="2" fill="#F97316" />
          <rect x="23" y="40" width="8" height="4" rx="2" fill="#F97316" />
          
          {/* Rosy cheeks */}
          <circle cx="10" cy="18" r="2" fill="#FDA4AF" opacity="0.5" />
          <circle cx="30" cy="18" r="2" fill="#FDA4AF" opacity="0.5" />
        </svg>
        
        {/* Jump sparkles */}
        {character.isJumping && (
          <>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-400/70 rounded-full blur-[2px] animate-ping" />
            <div className="absolute -bottom-2 left-1/3 w-1.5 h-1.5 bg-yellow-300/50 rounded-full blur-[1px]" />
            <div className="absolute -bottom-2 right-1/3 w-1.5 h-1.5 bg-yellow-300/50 rounded-full blur-[1px]" />
          </>
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
