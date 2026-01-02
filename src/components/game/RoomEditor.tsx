import React, { useState, useRef, useCallback } from 'react';
import type { RoomObject } from '@/hooks/useGameRoom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, Save, Grid3X3 } from 'lucide-react';

interface RoomEditorProps {
  roomObjects: RoomObject[];
  onSave: (objects: RoomObject[]) => void;
  onClose: () => void;
}

export const RoomEditor: React.FC<RoomEditorProps> = ({ roomObjects, onSave, onClose }) => {
  const [objects, setObjects] = useState<RoomObject[]>(roomObjects);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showGrid, setShowGrid] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; objX: number; objY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; objW: number; objH: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, obj: RoomObject, mode: 'drag' | 'resize') => {
    e.stopPropagation();
    setSelectedId(obj.id);
    
    if (mode === 'drag') {
      dragRef.current = { startX: e.clientX, startY: e.clientY, objX: obj.x, objY: obj.y };
    } else {
      resizeRef.current = { startX: e.clientX, startY: e.clientY, objW: obj.width, objH: obj.height };
    }
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || !selectedId) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = 100 / rect.width;
    const scaleY = 100 / rect.height;

    if (dragRef.current) {
      const deltaX = (e.clientX - dragRef.current.startX) * scaleX;
      const deltaY = (e.clientY - dragRef.current.startY) * scaleY;
      
      setObjects(prev => prev.map(obj => 
        obj.id === selectedId 
          ? { ...obj, x: Math.max(0, Math.min(100 - obj.width, dragRef.current!.objX + deltaX)), 
                      y: Math.max(0, Math.min(100 - obj.height, dragRef.current!.objY + deltaY)) }
          : obj
      ));
    }

    if (resizeRef.current) {
      const deltaX = (e.clientX - resizeRef.current.startX) * scaleX;
      const deltaY = (e.clientY - resizeRef.current.startY) * scaleY;
      
      setObjects(prev => prev.map(obj => 
        obj.id === selectedId 
          ? { ...obj, width: Math.max(5, resizeRef.current!.objW + deltaX), 
                      height: Math.max(3, resizeRef.current!.objH + deltaY) }
          : obj
      ));
    }
  }, [selectedId]);

  const handleMouseUp = useCallback(() => {
    dragRef.current = null;
    resizeRef.current = null;
  }, []);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  const addObject = () => {
    const newObj: RoomObject = {
      id: Date.now().toString(),
      name: 'New Platform',
      x: 30,
      y: 50,
      width: 15,
      height: 8,
    };
    setObjects(prev => [...prev, newObj]);
    setSelectedId(newObj.id);
  };

  const deleteObject = (id: string) => {
    if (id === '1') return; // Don't delete floor
    setObjects(prev => prev.filter(obj => obj.id !== id));
    setSelectedId(null);
  };

  const updateObjectName = (id: string, name: string) => {
    setObjects(prev => prev.map(obj => obj.id === id ? { ...obj, name } : obj));
  };

  const selectedObject = objects.find(obj => obj.id === selectedId);

  return (
    <div className="fixed inset-0 bg-background/95 z-50 flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="text-xl font-orbitron font-bold gradient-text">Room Editor</h2>
          <p className="text-sm text-muted-foreground">Drag platforms to match your real furniture</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowGrid(!showGrid)}>
            <Grid3X3 className="w-4 h-4 mr-1" />
            Grid
          </Button>
          <Button variant="outline" size="sm" onClick={addObject}>
            <Plus className="w-4 h-4 mr-1" />
            Add Platform
          </Button>
          <Button onClick={() => { onSave(objects); onClose(); }}>
            <Save className="w-4 h-4 mr-1" />
            Save & Play
          </Button>
        </div>
      </header>

      {/* Editor area */}
      <div className="flex-1 flex">
        {/* Canvas */}
        <div className="flex-1 p-6">
          <div 
            ref={containerRef}
            className="relative w-full h-full bg-card/50 rounded-xl border-2 border-dashed border-primary/30 overflow-hidden"
            onClick={() => setSelectedId(null)}
          >
            {/* Grid overlay */}
            {showGrid && (
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 10 }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div 
                      className="absolute border-l border-primary/10" 
                      style={{ left: `${(i + 1) * 10}%`, top: 0, bottom: 0 }} 
                    />
                    <div 
                      className="absolute border-t border-primary/10" 
                      style={{ top: `${(i + 1) * 10}%`, left: 0, right: 0 }} 
                    />
                  </React.Fragment>
                ))}
              </div>
            )}

            {/* Platform objects */}
            {objects.map(obj => (
              <div
                key={obj.id}
                className={`absolute cursor-move transition-shadow ${
                  selectedId === obj.id 
                    ? 'ring-2 ring-primary shadow-lg shadow-primary/30' 
                    : 'hover:ring-1 hover:ring-primary/50'
                } ${obj.id === '1' ? 'bg-muted/80' : 'bg-secondary/80'}`}
                style={{
                  left: `${obj.x}%`,
                  top: `${obj.y}%`,
                  width: `${obj.width}%`,
                  height: `${obj.height}%`,
                }}
                onMouseDown={(e) => handleMouseDown(e, obj, 'drag')}
              >
                {/* Label */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-orbitron text-foreground/80 truncate px-1">
                    {obj.name}
                  </span>
                </div>

                {/* Resize handle */}
                {obj.id !== '1' && (
                  <div
                    className="absolute bottom-0 right-0 w-4 h-4 bg-primary cursor-se-resize"
                    onMouseDown={(e) => handleMouseDown(e, obj, 'resize')}
                  />
                )}
              </div>
            ))}

            {/* Instructions overlay */}
            <div className="absolute bottom-4 left-4 text-xs text-muted-foreground bg-card/80 px-3 py-2 rounded-lg">
              <p>💡 Tip: Position platforms to match where your real furniture is!</p>
            </div>
          </div>
        </div>

        {/* Properties panel */}
        <div className="w-72 border-l border-border p-4 space-y-4">
          <h3 className="font-orbitron text-sm text-muted-foreground">Properties</h3>
          
          {selectedObject ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground">Name</label>
                <Input
                  value={selectedObject.name}
                  onChange={(e) => updateObjectName(selectedObject.id, e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">X Position</label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.x)}
                    onChange={(e) => setObjects(prev => prev.map(obj => 
                      obj.id === selectedId ? { ...obj, x: Number(e.target.value) } : obj
                    ))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Y Position</label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.y)}
                    onChange={(e) => setObjects(prev => prev.map(obj => 
                      obj.id === selectedId ? { ...obj, y: Number(e.target.value) } : obj
                    ))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-muted-foreground">Width</label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.width)}
                    onChange={(e) => setObjects(prev => prev.map(obj => 
                      obj.id === selectedId ? { ...obj, width: Number(e.target.value) } : obj
                    ))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height</label>
                  <Input
                    type="number"
                    value={Math.round(selectedObject.height)}
                    onChange={(e) => setObjects(prev => prev.map(obj => 
                      obj.id === selectedId ? { ...obj, height: Number(e.target.value) } : obj
                    ))}
                    className="mt-1"
                  />
                </div>
              </div>

              {selectedObject.id !== '1' && (
                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full"
                  onClick={() => deleteObject(selectedObject.id)}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Delete Platform
                </Button>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a platform to edit</p>
          )}

          {/* Platform list */}
          <div className="pt-4 border-t border-border">
            <h4 className="text-xs text-muted-foreground mb-2">All Platforms</h4>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {objects.map(obj => (
                <button
                  key={obj.id}
                  onClick={() => setSelectedId(obj.id)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                    selectedId === obj.id 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-muted text-foreground'
                  }`}
                >
                  {obj.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
