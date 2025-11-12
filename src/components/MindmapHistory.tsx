import { MindmapNode } from '@/data/mindmap';
import { ChevronRight } from 'lucide-react';

interface MindmapHistoryProps {
  history: MindmapNode[];
}

const MindmapHistory = ({ history }: MindmapHistoryProps) => {
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-center flex-wrap gap-2 p-4 mb-4 bg-gray-100 dark:bg-gray-800 rounded-lg animate-in fade-in">
      <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Caminho:</span>
      {history.map((node, index) => (
        <div key={node.id} className="flex items-center text-sm">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
            {node.question}
          </span>
          {index < history.length - 1 && <ChevronRight className="h-4 w-4 mx-1 text-gray-400" />}
        </div>
      ))}
    </div>
  );
};

export default MindmapHistory;