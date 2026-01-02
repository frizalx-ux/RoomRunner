import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameRoom } from '@/hooks/useGameRoom';
import { ControllerPad } from '@/components/game/ControllerPad';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gamepad2, ArrowLeft, Smartphone } from 'lucide-react';

const Controller: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { roomCode, isConnected, joinRoom, sendControl, disconnect } = useGameRoom();
  const [inputCode, setInputCode] = useState(searchParams.get('room') || '');
  const [error, setError] = useState('');

  const handleJoin = useCallback(() => {
    if (inputCode.length !== 4) {
      setError('Please enter a 4-character room code');
      return;
    }
    
    const success = joinRoom(inputCode);
    if (!success) {
      setError('Room not found. Make sure the game is running on your desktop.');
    } else {
      setError('');
    }
  }, [inputCode, joinRoom]);

  const handleControl = useCallback((x: number, y: number) => {
    sendControl(x, y);
  }, [sendControl]);

  const handleDisconnect = () => {
    disconnect();
    navigate('/controller');
  };

  // Auto-join if room code is in URL
  React.useEffect(() => {
    const roomFromUrl = searchParams.get('room');
    if (roomFromUrl && roomFromUrl.length === 4 && !roomCode) {
      setInputCode(roomFromUrl);
      setTimeout(() => {
        joinRoom(roomFromUrl);
      }, 500);
    }
  }, [searchParams, joinRoom, roomCode]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="p-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center box-glow">
              <Smartphone className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-orbitron font-bold gradient-text">GyroGame</h1>
              <p className="text-xs text-muted-foreground">Controller Mode</p>
            </div>
          </div>
          
          {roomCode && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDisconnect}
              className="text-muted-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Leave
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {!roomCode ? (
          <div className="w-full max-w-sm space-y-8">
            {/* Icon */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full bg-card border-2 border-primary/30 flex items-center justify-center box-glow animate-pulse-glow">
                <Gamepad2 className="w-12 h-12 text-primary" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-orbitron font-bold">Enter Room Code</h2>
              <p className="text-muted-foreground text-sm">
                Enter the 4-character code shown on your desktop
              </p>
            </div>

            {/* Input */}
            <div className="space-y-4">
              <Input
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value.toUpperCase().slice(0, 4));
                  setError('');
                }}
                placeholder="XXXX"
                className="text-center text-2xl font-orbitron tracking-widest h-14"
                maxLength={4}
              />
              
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}

              <Button
                onClick={handleJoin}
                className="w-full h-12 font-orbitron"
                disabled={inputCode.length !== 4}
              >
                Connect
              </Button>
            </div>

            {/* Instructions */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                Don't have a code? Open{' '}
                <button
                  onClick={() => navigate('/')}
                  className="text-primary hover:underline"
                >
                  the game
                </button>
                {' '}on your desktop first
              </p>
            </div>
          </div>
        ) : (
          <ControllerPad onControl={handleControl} isConnected={isConnected} />
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Hold your phone flat • Tilt to control
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Controller;
