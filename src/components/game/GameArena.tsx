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

      {/* Character */}
      <div
        className="absolute transition-all duration-75 ease-out"
        style={{
          left: `${character.x}%`,
          top: `${character.y}%`,
          width: `${characterWidth}%`,
          height: `${characterHeight}%`,
          transform: `scaleX(${character.facingRight ? 1 : -1})`,
        }}
      >
        {/* Character body */}
        <div className={`
          w-full h-full rounded-lg 
          ${isConnected 
            ? 'bg-gradient-to-b from-primary via-neon-cyan to-primary box-glow-strong' 
            : 'bg-muted-foreground/50'
          }
          ${character.isJumping ? 'animate-pulse' : ''}
          transition-colors duration-300
        `}>
          {/* Face */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-1/4 flex justify-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
            <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
          </div>
          {/* Body shine */}
          <div className="absolute inset-1 rounded-md bg-gradient-to-br from-white/30 to-transparent" />
        </div>
        
        {/* Jump trail effect */}
        {character.isJumping && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary/50 rounded-full blur-sm animate-ping" />
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
