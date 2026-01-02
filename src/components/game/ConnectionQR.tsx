import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ConnectionQRProps {
  roomCode: string;
}

export const ConnectionQR: React.FC<ConnectionQRProps> = ({ roomCode }) => {
  // Generate URL for the controller page
  const controllerUrl = `${window.location.origin}/controller?room=${roomCode}`;

  return (
    <div className="flex flex-col items-center gap-6">
      {/* QR Code container */}
      <div className="relative p-4 bg-card rounded-xl border border-primary/30 box-glow">
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-primary rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-primary rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary rounded-br-lg" />
        
        <QRCodeSVG
          value={controllerUrl}
          size={180}
          bgColor="transparent"
          fgColor="hsl(180, 100%, 50%)"
          level="M"
          className="rounded-lg"
        />
      </div>

      {/* Room code display */}
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground font-rajdhani">
          Or enter code manually
        </p>
        <div className="flex gap-2 justify-center">
          {roomCode.split('').map((char, i) => (
            <div
              key={i}
              className="w-12 h-14 flex items-center justify-center bg-card border border-primary/50 rounded-lg text-2xl font-orbitron font-bold text-primary box-glow"
            >
              {char}
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center space-y-1">
        <p className="text-muted-foreground text-sm">
          Scan with your phone camera
        </p>
        <p className="text-muted-foreground/60 text-xs">
          or visit <span className="text-primary">{window.location.origin}/controller</span>
        </p>
      </div>
    </div>
  );
};
