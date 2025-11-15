import { createContext, useContext, useState, ReactNode } from 'react';
import { MindmapNode, mindmapData as initialMindmapData } from '@/data/mindmap';

interface MindmapContextType {
  mindmapData: Record<string, MindmapNode>;
  setMindmapData: (data: Record<string, MindmapNode>) => void;
}

const MindmapContext = createContext<MindmapContextType | undefined>(undefined);

export const MindmapProvider = ({ children }: { children: ReactNode }) => {
  const [mindmapData, setMindmapData] = useState<Record<string, MindmapNode>>(initialMindmapData);

  return (
    <MindmapContext.Provider value={{ mindmapData, setMindmapData }}>
      {children}
    </MindmapContext.Provider>
  );
};

export const useMindmap = () => {
  const context = useContext(MindmapContext);
  if (!context) {
    throw new Error('useMindmap must be used within a MindmapProvider');
  }
  return context;
};