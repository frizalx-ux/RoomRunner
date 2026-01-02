import { useState, useEffect, useCallback } from 'react';

interface DeviceOrientation {
  alpha: number | null; // Z-axis rotation [0, 360)
  beta: number | null;  // X-axis rotation [-180, 180)
  gamma: number | null; // Y-axis rotation [-90, 90)
}

interface UseDeviceOrientationReturn {
  orientation: DeviceOrientation;
  isSupported: boolean;
  isPermissionGranted: boolean;
  requestPermission: () => Promise<boolean>;
  error: string | null;
}

export const useDeviceOrientation = (): UseDeviceOrientationReturn => {
  const [orientation, setOrientation] = useState<DeviceOrientation>({
    alpha: null,
    beta: null,
    gamma: null,
  });
  const [isSupported, setIsSupported] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsSupported('DeviceOrientationEvent' in window);
  }, []);

  const handleOrientation = useCallback((event: DeviceOrientationEvent) => {
    setOrientation({
      alpha: event.alpha,
      beta: event.beta,
      gamma: event.gamma,
    });
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError('Device orientation is not supported on this device');
      return false;
    }

    try {
      // Check if permission API exists (iOS 13+)
      if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation);
          setIsPermissionGranted(true);
          setError(null);
          return true;
        } else {
          setError('Permission denied for device orientation');
          return false;
        }
      } else {
        // Non-iOS devices don't need permission
        window.addEventListener('deviceorientation', handleOrientation);
        setIsPermissionGranted(true);
        setError(null);
        return true;
      }
    } catch (err) {
      setError('Failed to request device orientation permission');
      return false;
    }
  }, [isSupported, handleOrientation]);

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, [handleOrientation]);

  return {
    orientation,
    isSupported,
    isPermissionGranted,
    requestPermission,
    error,
  };
};
