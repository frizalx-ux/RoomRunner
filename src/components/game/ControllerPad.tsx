import React, { useEffect, useState } from 'react';
import { useDeviceOrientation } from '@/hooks/useDeviceOrientation';
import { Smartphone, RotateCcw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ControllerPadProps {
  onControl: (x: number, y: number) => void;
  isConnected: boolean;
}

export const ControllerPad: React.FC<ControllerPadProps> = ({ onControl, isConnected }) => {
  const { orientation, isSupported, isPermissionGranted, requestPermission, error } = useDeviceOrientation();
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibration, setCalibration] = useState({ beta: 0, gamma: 0 });

  // Send orientation data when it changes
  useEffect(() => {
    if (isPermissionGranted && orientation.beta !== null && orientation.gamma !== null) {
      const x = (orientation.gamma || 0) - calibration.gamma;
      const y = (orientation.beta || 0) - calibration.beta;
      onControl(x, y);
    }
  }, [orientation, isPermissionGranted, calibration, onControl]);

  const handleCalibrate = () => {
    setIsCalibrating(true);
    setTimeout(() => {
      setCalibration({
        beta: orientation.beta || 0,
        gamma: orientation.gamma || 0,
      });
      setIsCalibrating(false);
    }, 500);
  };

  const handleStart = async () => {
    await requestPermission();
    handleCalibrate();
  };

  // Normalized values for visual feedback
  const normalizedX = Math.max(-1, Math.min(1, ((orientation.gamma || 0) - calibration.gamma) / 45));
  const normalizedY = Math.max(-1, Math.min(1, ((orientation.beta || 0) - calibration.beta) / 45));

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      {/* Connection status */}
      <div className="flex items-center gap-2">
        {isConnected ? (
          <>
            <Wifi className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-orbitron">Connected</span>
          </>
        ) : (
          <>
            <WifiOff className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive font-orbitron">Disconnected</span>
          </>
        )}
      </div>

      {!isSupported ? (
        <div className="text-center space-y-4">
          <Smartphone className="w-16 h-16 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">
            Device orientation is not supported on this device.
            <br />
            Please use a mobile device.
          </p>
        </div>
      ) : !isPermissionGranted ? (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 mx-auto rounded-full bg-card border-2 border-primary/50 flex items-center justify-center box-glow">
            <Smartphone className="w-12 h-12 text-primary" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-orbitron text-glow">Enable Motion Control</h3>
            <p className="text-muted-foreground text-sm max-w-xs">
              Tilt your phone to control the ball. Hold your phone flat to start.
            </p>
          </div>
          <Button onClick={handleStart} className="px-8">
            Start Controller
          </Button>
          {error && (
            <p className="text-destructive text-sm">{error}</p>
          )}
        </div>
      ) : (
        <>
          {/* Visual control feedback */}
          <div className="relative w-64 h-64">
            {/* Outer ring */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/30 box-glow" />
            
            {/* Grid lines */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-px bg-primary/20" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-px h-full bg-primary/20" />
            </div>
            
            {/* Inner circles */}
            <div className="absolute inset-8 rounded-full border border-primary/20" />
            <div className="absolute inset-16 rounded-full border border-primary/20" />

            {/* Control indicator */}
            <div
              className="absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
              style={{
                left: `${50 + normalizedX * 40}%`,
                top: `${50 + normalizedY * 40}%`,
              }}
            >
              <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-secondary box-glow-strong">
                <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
              </div>
            </div>
          </div>

          {/* Debug values */}
          <div className="grid grid-cols-2 gap-4 text-center text-sm font-mono">
            <div>
              <span className="text-muted-foreground">X (Tilt L/R)</span>
              <p className="text-primary font-bold">{normalizedX.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-muted-foreground">Y (Tilt F/B)</span>
              <p className="text-primary font-bold">{normalizedY.toFixed(2)}</p>
            </div>
          </div>

          {/* Calibrate button */}
          <Button
            onClick={handleCalibrate}
            variant="outline"
            disabled={isCalibrating}
            className="gap-2"
          >
            <RotateCcw className={`w-4 h-4 ${isCalibrating ? 'animate-spin' : ''}`} />
            {isCalibrating ? 'Calibrating...' : 'Recalibrate'}
          </Button>

          <p className="text-xs text-muted-foreground text-center max-w-xs">
            Hold your phone flat and tap recalibrate to set the neutral position
          </p>
        </>
      )}
    </div>
  );
};
