import React, { useState, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGameRoom } from '@/hooks/useGameRoom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Gamepad2, ArrowLeft, ArrowUp, ChevronLeft, ChevronRight, Smartphone } from 'lucide-react';

const Controller: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { roomCode, isConnected, isLoading, joinRoom, sendControl, disconnect } = useGameRoom();
  const [inputCode, setInputCode] = useState(searchParams.get('room') || '');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const handleJoin = useCallback(async () => {
    if (inputCode.length !== 4) {
      setError('Please enter a 4-character room code');
      return;
    }
    
    setIsJoining(true);
    setError('');
    
    const success = await joinRoom(inputCode);
    setIsJoining(false);
    
    if (!success) {
      setError('Room not found. Make sure the game is running on your desktop.');
    }
  }, [inputCode, joinRoom]);

  const handleDisconnect = () => {
    disconnect();
    navigate('/controller');
  };

  // Control handlers with continuous movement
  const startMove = (direction: 'left' | 'right') => {
    sendControl(direction);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => sendControl(direction), 50);
  };

  const stopMove = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    sendControl('stop');
  };

  const handleJump = () => {
    sendControl('jump');
  };

  // Auto-join if room code is in URL
  React.useEffect(() => {
    const roomFromUrl = searchParams.get('room');
    if (roomFromUrl && roomFromUrl.length === 4 && !roomCode && !isJoining) {
      setInputCode(roomFromUrl);
      const autoJoin = async () => {
        setIsJoining(true);
        const success = await joinRoom(roomFromUrl);
        setIsJoining(false);
        if (!success) {
          setError('Room not found. Make sure the game is running on your desktop.');
        }
      };
      autoJoin();
    }
  }, [searchParams, joinRoom, roomCode, isJoining]);

  // Cleanup interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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
              <h1 className="text-lg font-orbitron font-bold gradient-text">RoomRunner</h1>
              <p className="text-xs text-muted-foreground">Controller</p>
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
                Enter the 4-character code shown on screen
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
                disabled={inputCode.length !== 4 || isJoining}
              >
                {isJoining ? 'Connecting...' : 'Connect'}
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
                {' '}on your screen first
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-md space-y-8">
            {/* Connection status */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-card rounded-full border border-primary/50 box-glow">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-sm font-orbitron text-primary">Connected</span>
              </div>
            </div>

            {/* Jump button */}
            <div className="flex justify-center">
              <button
                onTouchStart={handleJump}
                onClick={handleJump}
                className="w-32 h-32 rounded-full bg-gradient-to-b from-primary to-primary/70 border-4 border-primary/50 flex items-center justify-center box-glow-strong active:scale-95 transition-transform touch-none select-none"
              >
                <ArrowUp className="w-16 h-16 text-primary-foreground" />
              </button>
            </div>
            
            <p className="text-center text-sm text-muted-foreground font-orbitron">JUMP</p>

            {/* Left/Right buttons */}
            <div className="flex justify-center gap-8">
              <button
                onTouchStart={() => startMove('left')}
                onTouchEnd={stopMove}
                onMouseDown={() => startMove('left')}
                onMouseUp={stopMove}
                onMouseLeave={stopMove}
                className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary to-secondary/70 border-2 border-secondary/50 flex items-center justify-center box-glow-purple active:scale-95 transition-transform touch-none select-none"
              >
                <ChevronLeft className="w-12 h-12 text-secondary-foreground" />
              </button>
              
              <button
                onTouchStart={() => startMove('right')}
                onTouchEnd={stopMove}
                onMouseDown={() => startMove('right')}
                onMouseUp={stopMove}
                onMouseLeave={stopMove}
                className="w-24 h-24 rounded-2xl bg-gradient-to-bl from-secondary to-secondary/70 border-2 border-secondary/50 flex items-center justify-center box-glow-purple active:scale-95 transition-transform touch-none select-none"
              >
                <ChevronRight className="w-12 h-12 text-secondary-foreground" />
              </button>
            </div>
            
            <div className="flex justify-center gap-8 text-sm text-muted-foreground font-orbitron">
              <span className="w-24 text-center">LEFT</span>
              <span className="w-24 text-center">RIGHT</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="p-4 border-t border-border/50">
        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Tap & hold direction buttons • Tap jump to leap
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Controller;
