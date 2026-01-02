-- Create game_rooms table for cross-device sync
CREATE TABLE public.game_rooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_code TEXT NOT NULL UNIQUE,
  host_id TEXT NOT NULL,
  room_objects JSONB NOT NULL DEFAULT '[]'::jsonb,
  control_data JSONB DEFAULT '{"action": "none", "timestamp": 0}'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public game - no auth required)
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active rooms
CREATE POLICY "Anyone can read active rooms" 
ON public.game_rooms 
FOR SELECT 
USING (is_active = true);

-- Allow anyone to create rooms
CREATE POLICY "Anyone can create rooms" 
ON public.game_rooms 
FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update rooms (for control sync)
CREATE POLICY "Anyone can update rooms" 
ON public.game_rooms 
FOR UPDATE 
USING (is_active = true);

-- Enable realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;