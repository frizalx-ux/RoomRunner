import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

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
  isLoading: boolean;
}

const generateRoomCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const generateHostId = () => {
  return `host_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const useGameRoom = () => {
  const [state, setState] = useState<GameRoomState>({
    roomCode: null,
    isHost: false,
    isConnected: false,
    controlData: { action: 'none', timestamp: Date.now() },
    roomObjects: [],
    isLoading: false,
  });

  const hostIdRef = useRef<string>('');
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const createRoom = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    const code = generateRoomCode();
    hostIdRef.current = generateHostId();
    
    // Default room objects (furniture)
    const defaultObjects: RoomObject[] = [
      { id: '1', name: 'Floor', x: 0, y: 85, width: 100, height: 15 },
      { id: '2', name: 'Sofa', x: 10, y: 70, width: 20, height: 15 },
      { id: '3', name: 'Table', x: 40, y: 60, width: 15, height: 10 },
      { id: '4', name: 'Desk', x: 65, y: 50, width: 18, height: 8 },
      { id: '5', name: 'Shelf', x: 85, y: 35, width: 12, height: 6 },
    ];

    try {
      // Create room in database
      const { error } = await supabase
        .from('game_rooms')
        .insert({
          room_code: code,
          host_id: hostIdRef.current,
          room_objects: defaultObjects as unknown as Json,
          control_data: { action: 'none', timestamp: Date.now() } as unknown as Json,
        });

      if (error) {
        console.error('Error creating room:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return null;
      }

      // Subscribe to realtime updates
      channelRef.current = supabase
        .channel(`room-${code}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_rooms',
            filter: `room_code=eq.${code}`,
          },
          (payload) => {
            console.log('Realtime update:', payload);
            const newData = payload.new as any;
            if (newData.control_data) {
              setState(prev => ({
                ...prev,
                controlData: newData.control_data as ControlData,
                isConnected: true,
              }));
            }
          }
        )
        .subscribe();

      setState(prev => ({
        ...prev,
        roomCode: code,
        isHost: true,
        roomObjects: defaultObjects,
        isLoading: false,
      }));

      return code;
    } catch (err) {
      console.error('Error creating room:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  }, []);

  const joinRoom = useCallback(async (code: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    const upperCode = code.toUpperCase();

    try {
      // Check if room exists
      const { data: room, error } = await supabase
        .from('game_rooms')
        .select('*')
        .eq('room_code', upperCode)
        .eq('is_active', true)
        .single();

      if (error || !room) {
        console.error('Room not found:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return false;
      }

      // Subscribe to realtime updates (for controller to see room state)
      channelRef.current = supabase
        .channel(`room-${upperCode}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'game_rooms',
            filter: `room_code=eq.${upperCode}`,
          },
          (payload) => {
            console.log('Room update received:', payload);
          }
        )
        .subscribe();

      setState(prev => ({
        ...prev,
        roomCode: upperCode,
        isHost: false,
        isConnected: true,
        roomObjects: (room.room_objects as unknown as RoomObject[]) || [],
        isLoading: false,
      }));

      return true;
    } catch (err) {
      console.error('Error joining room:', err);
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  }, []);

  const sendControl = useCallback(async (action: ControlData['action']) => {
    if (!state.roomCode) return;

    const data: ControlData = { action, timestamp: Date.now() };
    
    try {
      const { error } = await supabase
        .from('game_rooms')
        .update({ control_data: data as unknown as Json, updated_at: new Date().toISOString() })
        .eq('room_code', state.roomCode);

      if (error) {
        console.error('Error sending control:', error);
      }
    } catch (err) {
      console.error('Error sending control:', err);
    }
  }, [state.roomCode]);

  const updateRoomObjects = useCallback(async (objects: RoomObject[]) => {
    setState(prev => ({ ...prev, roomObjects: objects }));
    
    if (state.roomCode && state.isHost) {
      try {
        await supabase
          .from('game_rooms')
          .update({ room_objects: objects as unknown as Json, updated_at: new Date().toISOString() })
          .eq('room_code', state.roomCode);
      } catch (err) {
        console.error('Error updating room objects:', err);
      }
    }
  }, [state.roomCode, state.isHost]);

  const disconnect = useCallback(async () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    if (state.isHost && state.roomCode) {
      try {
        await supabase
          .from('game_rooms')
          .update({ is_active: false })
          .eq('room_code', state.roomCode);
      } catch (err) {
        console.error('Error closing room:', err);
      }
    }

    setState({
      roomCode: null,
      isHost: false,
      isConnected: false,
      controlData: { action: 'none', timestamp: Date.now() },
      roomObjects: [],
      isLoading: false,
    });
  }, [state.isHost, state.roomCode]);

  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
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
