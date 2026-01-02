import { useState, useEffect, useCallback, useRef } from 'react';

interface ControlData {
  x: number;
  y: number;
  timestamp: number;
}

interface GameRoomState {
  roomCode: string | null;
  isHost: boolean;
  isConnected: boolean;
  controlData: ControlData;
}

// Simple in-memory "server" using BroadcastChannel for same-device testing
// In production, this would be replaced with WebSocket/Supabase Realtime
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
    controlData: { x: 0, y: 0, timestamp: Date.now() },
  });

  const channelRef = useRef<BroadcastChannel | null>(null);
  const storageKeyRef = useRef<string>('');

  const createRoom = useCallback(() => {
    const code = generateRoomCode();
    storageKeyRef.current = `game-room-${code}`;
    
    // Store room in localStorage for cross-tab discovery
    localStorage.setItem(storageKeyRef.current, JSON.stringify({ 
      created: Date.now(),
      host: true 
    }));

    // Create broadcast channel for real-time updates
    channelRef.current = new BroadcastChannel(`game-${code}`);
    
    channelRef.current.onmessage = (event) => {
      if (event.data.type === 'control') {
        setState(prev => ({
          ...prev,
          controlData: event.data.data,
          isConnected: true,
        }));
      } else if (event.data.type === 'join') {
        setState(prev => ({ ...prev, isConnected: true }));
        channelRef.current?.postMessage({ type: 'host-ack' });
      }
    };

    setState(prev => ({
      ...prev,
      roomCode: code,
      isHost: true,
    }));

    return code;
  }, []);

  const joinRoom = useCallback((code: string) => {
    const upperCode = code.toUpperCase();
    storageKeyRef.current = `game-room-${upperCode}`;
    
    // Check if room exists
    const roomData = localStorage.getItem(storageKeyRef.current);
    if (!roomData) {
      return false;
    }

    channelRef.current = new BroadcastChannel(`game-${upperCode}`);
    
    channelRef.current.onmessage = (event) => {
      if (event.data.type === 'host-ack') {
        setState(prev => ({ ...prev, isConnected: true }));
      }
    };

    // Notify host
    channelRef.current.postMessage({ type: 'join' });

    setState(prev => ({
      ...prev,
      roomCode: upperCode,
      isHost: false,
      isConnected: true,
    }));

    return true;
  }, []);

  const sendControl = useCallback((x: number, y: number) => {
    if (!channelRef.current) return;
    
    const data: ControlData = { x, y, timestamp: Date.now() };
    channelRef.current.postMessage({ type: 'control', data });
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
      controlData: { x: 0, y: 0, timestamp: Date.now() },
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
    disconnect,
  };
};
