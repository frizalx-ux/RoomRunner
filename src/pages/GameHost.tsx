import React, { useEffect, useState } from 'react';
import { useGameRoom } from '@/hooks/useGameRoom';
import { useGamePhysics } from '@/hooks/useGamePhysics';
import { GameArena } from '@/components/game/GameArena';
import { ConnectionQR } from '@/components/game/ConnectionQR';
import { RoomEditor } from '@/components/game/RoomEditor';
import { Button } from '@/components/ui/button';
import { Gamepad2, Power, Monitor, RotateCcw, Settings2 } from 'lucide-react';
import type { RoomObject } from '@/hooks/useGameRoom';

const GameHost: React.FC = () => {
  const { roomCode, isConnected, isLoading, controlData, roomObjects, createRoom, disconnect, updateRoomObjects } = useGameRoom();
  const { character, resetCharacter, CHARACTER_WIDTH, CHARACTER_HEIGHT } = useGamePhysics(roomObjects, controlData);
  const [showEditor, setShowEditor] = useState(false);

  useEffect(() => {
    const initRoom = async () => {
      await createRoom();
    };
    initRoom();
    
    return () => {
      disconnect();
    };
  }, []);

  const handleSaveRoom = async (objects: RoomObject[]) => {
    await updateRoomObjects(objects);
  };

  if (showEditor) {
    return (
      <RoomEditor
        roomObjects={roomObjects}
        onSave={handleSaveRoom}
        onClose={() => setShowEditor(false)}
      />
    );
  }

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
              <h1 className="text-xl font-orbitron font-bold gradient-text">RoomRunner</h1>
              <p className="text-xs text-muted-foreground">Real Object Platformer</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditor(true)}
              className="gap-2"
            >
              <Settings2 className="w-4 h-4" />
              Edit Room
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetCharacter}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border">
              <Monitor className="w-4 h-4 text-primary" />
              <span className="text-sm font-orbitron">Projector View</span>
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
      <main className="flex-1 container mx-auto py-6 px-4">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Game Arena - takes 2 columns */}
          <div className="lg:col-span-2">
            <GameArena
              roomObjects={roomObjects}
              character={character}
              characterWidth={CHARACTER_WIDTH}
              characterHeight={CHARACTER_HEIGHT}
              isConnected={isConnected}
            />
            
            {/* Control hints */}
            <div className="mt-4 flex justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-card rounded border border-border font-mono">←</span>
                <span>Move Left</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-card rounded border border-border font-mono">→</span>
                <span>Move Right</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-card rounded border border-border font-mono">↑</span>
                <span>Jump</span>
              </div>
            </div>
          </div>

          {/* Connection Panel */}
          <div className="flex flex-col">
            <div className="bg-card/50 rounded-2xl border border-border p-6 backdrop-blur-sm">
              <div className="text-center mb-4">
                <h2 className="text-xl font-orbitron font-bold mb-1">
                  {isConnected ? (
                    <span className="text-glow">Player Ready!</span>
                  ) : (
                    'Connect Phone'
                  )}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isConnected
                    ? 'Use buttons to control character'
                    : 'Scan to play'
                  }
                </p>
              </div>

              {roomCode && !isConnected && (
                <ConnectionQR roomCode={roomCode} />
              )}

              {isLoading && !roomCode && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-muted-foreground">Creating room...</p>
                </div>
              )}

              {isConnected && (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center animate-pulse-glow">
                    <Gamepad2 className="w-10 h-10 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground font-mono">
                      Position: ({character.x.toFixed(0)}, {character.y.toFixed(0)})
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {character.isGrounded ? '🟢 Grounded' : '🔵 In Air'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Room objects list */}
            <div className="mt-4 bg-card/30 rounded-xl border border-border/50 p-4">
              <h3 className="text-sm font-orbitron text-muted-foreground mb-3">Room Objects</h3>
              <div className="space-y-2">
                {roomObjects.filter(o => o.name !== 'Floor').map(obj => (
                  <div key={obj.id} className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{obj.name}</span>
                    <span className="text-muted-foreground font-mono">
                      ({obj.x}, {obj.y})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border/50">
        <div className="container mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            Project this to your wall • Jump between real furniture!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default GameHost;
