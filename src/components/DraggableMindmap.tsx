import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { BrainCircuit } from 'lucide-react';

interface MindmapNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface DraggableMindmapProps {
  nodes: MindmapNode[];
}

const DraggableMindmap: React.FC<DraggableMindmapProps> = ({ nodes }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, startDrag]);

  // Simple Node Renderer
  const NodeRenderer = ({ node }: { node: MindmapNode }) => (
    <div
      className="absolute p-3 border rounded-lg shadow-md bg-card text-center w-32 transition-shadow hover:shadow-lg"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: 'translate(-50%, -50%)', // Center the node on its coordinates
      }}
    >
      <BrainCircuit className="h-4 w-4 mx-auto mb-1 text-primary" />
      <p className="text-xs font-medium truncate">{node.label}</p>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={cn(
        "relative w-full h-[500px] overflow-hidden border rounded-lg cursor-grab bg-muted/20",
        { 'cursor-grabbing': isDragging }
      )}
      onMouseDown={handleMouseDown}
    >
      <div
        className="absolute inset-0 transition-transform duration-50"
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
        }}
      >
        {nodes.map(node => (
          <NodeRenderer key={node.id} node={node} />
        ))}
      </div>
    </div>
  );
};

export default DraggableMindmap;