import { useState, useEffect, useCallback, useRef } from 'react';

interface ControlData {
  action: 'jump' | 'left' | 'right' | 'stop' | 'none';
  timestamp: number;
}

interface RoomObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface GameRoomState {
  roomCode: string | null;
  isHost: boolean;
  isConnected: boolean;
  controlData: ControlData;
  roomObjects: RoomObject[];
}

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const useGameRoom = () => {
  const [state, setState] = useState<GameRoomState>({
    roomCode: null,
    isHost: false,
    isConnected: false,
    controlData: { action: 'none', timestamp: Date.now() },
    roomObjects: [],
  });

  const channelRef = useRef<BroadcastChannel | null>(null);
  const storageKeyRef = useRef<string>('');

  const createRoom = useCallback(() => {
    const code = generateRoomCode();
    storageKeyRef.current = `game-room-${code}`;
    
    // Default room objects (furniture)
    const defaultObjects: RoomObject[] = [
      { id: '1', name: 'Floor', x: 0, y: 85, width: 100, height: 15 },
      { id: '2', name: 'Sofa', x: 10, y: 70, width: 20, height: 15 },
      { id: '3', name: 'Table', x: 40, y: 60, width: 15, height: 10 },
      { id: '4', name: 'Desk', x: 65, y: 50, width: 18, height: 8 },
      { id: '5', name: 'Shelf', x: 85, y: 35, width: 12, height: 6 },
    ];
    
    localStorage.setItem(storageKeyRef.current, JSON.stringify({ 
      created: Date.now(),
      host: true,
      objects: defaultObjects,
    }));

    channelRef.current = new BroadcastChannel(`game-${code}`);
    
    channelRef.current.onmessage = (event) => {
      if (event.data.type === 'control') {
        setState(prev => ({
          ...prev,
          controlData: event.data.data,
        }));
      } else if (event.data.type === 'join') {
        setState(prev => ({ ...prev, isConnected: true }));
        channelRef.current?.postMessage({ type: 'host-ack', objects: defaultObjects });
      }
    };

    setState(prev => ({
      ...prev,
      roomCode: code,
      isHost: true,
      roomObjects: defaultObjects,
    }));

    return code;
  }, []);

  const joinRoom = useCallback((code: string) => {
    const upperCode = code.toUpperCase();
    storageKeyRef.current = `game-room-${upperCode}`;
    
    const roomData = localStorage.getItem(storageKeyRef.current);
    if (!roomData) {
      return false;
    }

    channelRef.current = new BroadcastChannel(`game-${upperCode}`);
    
    channelRef.current.onmessage = (event) => {
      if (event.data.type === 'host-ack') {
        setState(prev => ({ 
          ...prev, 
          isConnected: true,
          roomObjects: event.data.objects || [],
        }));
      }
    };

    channelRef.current.postMessage({ type: 'join' });

    setState(prev => ({
      ...prev,
      roomCode: upperCode,
      isHost: false,
      isConnected: true,
    }));

    return true;
  }, []);

  const sendControl = useCallback((action: ControlData['action']) => {
    if (!channelRef.current) return;
    
    const data: ControlData = { action, timestamp: Date.now() };
    channelRef.current.postMessage({ type: 'control', data });
  }, []);

  const updateRoomObjects = useCallback((objects: RoomObject[]) => {
    setState(prev => ({ ...prev, roomObjects: objects }));
    if (storageKeyRef.current) {
      const roomData = localStorage.getItem(storageKeyRef.current);
      if (roomData) {
        const parsed = JSON.parse(roomData);
        parsed.objects = objects;
        localStorage.setItem(storageKeyRef.current, JSON.stringify(parsed));
      }
    }
  }, []);

  const disconnect = useCallback(() => {
    if (channelRef.current) {
      channelRef.current.close();
      channelRef.current = null;
    }
    if (state.isHost && storageKeyRef.current) {
      localStorage.removeItem(storageKeyRef.current);
    }
    setState({
      roomCode: null,
      isHost: false,
      isConnected: false,
      controlData: { action: 'none', timestamp: Date.now() },
      roomObjects: [],
    });
  }, [state.isHost]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  return {
    ...state,
    createRoom,
    joinRoom,
    sendControl,
    updateRoomObjects,
    disconnect,
  };
};

export type { RoomObject, ControlData };
