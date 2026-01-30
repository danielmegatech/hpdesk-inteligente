import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { mindmapData } from '@/data/mindmap';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to get subthemes for the search dialog
export function getCategorySubthemes(startNodeId: string): string {
  const startNode = mindmapData[startNodeId];
  if (!startNode || startNode.options.length === 0) {
    return 'Nenhum subtema definido.';
  }
  
  // Limit to first 4 options for conciseness
  const subthemes = startNode.options.slice(0, 4).map(opt => opt.text);
  
  let description = subthemes.join(', ');
  if (startNode.options.length > 4) {
    description += ', ...';
  }
  
  return description;
}