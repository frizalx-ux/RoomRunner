import React, { useEffect } from 'react';
import { useGameRoom } from '@/hooks/useGameRoom';
import { GameArena } from '@/components/game/GameArena';
import { ConnectionQR } from '@/components/game/ConnectionQR';
import { Button } from '@/components/ui/button';
import { Gamepad2, Power, Monitor } from 'lucide-react';

const GameHost: React.FC = () => {
  const { roomCode, isConnected, controlData, createRoom, disconnect } = useGameRoom();

  useEffect(() => {
    // Auto-create room on mount
    createRoom();
    
    return () => {
      disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center box-glow">
              <Gamepad2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-orbitron font-bold gradient-text">GyroGame</h1>
              <p className="text-xs text-muted-foreground">Phone Motion Controller</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border">
              <Monitor className="w-4 h-4 text-primary" />
              <span className="text-sm font-orbitron">Host View</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={disconnect}
              className="text-muted-foreground hover:text-destructive"
            >
              <Power className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Game Arena */}
          <div className="order-2 lg:order-1">
            <GameArena
              ballPosition={{ x: controlData.x, y: controlData.y }}
              isConnected={isConnected}
            />
          </div>

          {/* Connection Panel */}
          <div className="order-1 lg:order-2 flex flex-col items-center">
            <div className="bg-card/50 rounded-2xl border border-border p-8 backdrop-blur-sm">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-orbitron font-bold mb-2">
                  {isConnected ? (
                    <span className="text-glow">Controller Connected!</span>
                  ) : (
                    'Connect Your Phone'
                  )}
                </h2>
                <p className="text-muted-foreground">
                  {isConnected
                    ? 'Tilt your phone to control the ball'
                    : 'Scan the QR code with your phone'
                  }
                </p>
              </div>

              {roomCode && !isConnected && (
                <ConnectionQR roomCode={roomCode} />
              )}

              {isConnected && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse-glow">
                    <Gamepad2 className="w-12 h-12 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Control Input</p>
                    <p className="font-mono text-primary">
                      X: {controlData.x.toFixed(1)}° | Y: {controlData.y.toFixed(1)}°
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border/50">
        <div className="container mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Open this page on your desktop • Use your phone as the controller
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GameHost;
