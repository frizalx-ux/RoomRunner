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

      {/* Character - Mario in Suit */}
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
        <div className={`
          relative w-full h-full
          ${character.isJumping ? 'animate-bounce' : ''}
          transition-all duration-150
        `}>
          {/* Hat - Red cap */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[85%] h-[18%] bg-red-600 rounded-t-full border-b-2 border-red-800">
            {/* Cap brim */}
            <div className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-[110%] h-[40%] bg-red-600 rounded-full" />
            {/* M logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full flex items-center justify-center">
              <span className="text-[4px] font-bold text-red-600">M</span>
            </div>
          </div>

          {/* Face */}
          <div className="absolute top-[16%] left-1/2 -translate-x-1/2 w-[75%] h-[28%] bg-[#FFDAB9] rounded-lg border border-[#DEB887]">
            {/* Eyes */}
            <div className="absolute top-[25%] left-[20%] w-[18%] h-[30%] bg-white rounded-full border border-gray-300">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-600 rounded-full" />
            </div>
            <div className="absolute top-[25%] right-[20%] w-[18%] h-[30%] bg-white rounded-full border border-gray-300">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-blue-600 rounded-full" />
            </div>
            {/* Mustache */}
            <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[80%] h-[25%] bg-[#3D2314] rounded-full" />
            {/* Nose */}
            <div className="absolute top-[50%] left-1/2 -translate-x-1/2 w-[25%] h-[25%] bg-[#FFDAB9] rounded-full border border-[#DEB887] z-10" />
          </div>

          {/* Suit Body */}
          <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-[90%] h-[38%] bg-gray-800 rounded-lg border border-gray-900">
            {/* Tie */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[20%] h-[90%] bg-red-500 rounded-b-sm">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140%] h-[20%] bg-red-500 rounded-sm" />
            </div>
            {/* Suit lapels */}
            <div className="absolute top-0 left-[10%] w-[25%] h-[50%] bg-gray-700 rounded-br-lg origin-top-left -skew-x-6" />
            <div className="absolute top-0 right-[10%] w-[25%] h-[50%] bg-gray-700 rounded-bl-lg origin-top-right skew-x-6" />
            {/* White shirt collar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-[15%] bg-white rounded-b-sm" />
            {/* Buttons */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full" />
            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-400 rounded-full" />
          </div>

          {/* Legs/Pants */}
          <div className="absolute bottom-[8%] left-[15%] w-[30%] h-[22%] bg-gray-700 rounded-b-md" />
          <div className="absolute bottom-[8%] right-[15%] w-[30%] h-[22%] bg-gray-700 rounded-b-md" />

          {/* Shoes */}
          <div className="absolute bottom-0 left-[10%] w-[35%] h-[12%] bg-[#3D2314] rounded-lg" />
          <div className="absolute bottom-0 right-[10%] w-[35%] h-[12%] bg-[#3D2314] rounded-lg" />

          {/* Glowing effect when connected */}
          {isConnected && (
            <div className="absolute inset-0 rounded-lg bg-primary/10 animate-pulse pointer-events-none" />
          )}
        </div>
        
        {/* Jump trail effect */}
        {character.isJumping && (
          <>
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-400/60 rounded-full blur-sm animate-ping" />
            <div className="absolute -bottom-2 left-1/4 w-2 h-2 bg-yellow-300/40 rounded-full blur-sm" />
            <div className="absolute -bottom-2 right-1/4 w-2 h-2 bg-yellow-300/40 rounded-full blur-sm" />
          </>
        )}

        {/* Grounded dust particles */}
        {character.isGrounded && !character.isJumping && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-1 bg-muted/30 rounded-full blur-sm" />
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
