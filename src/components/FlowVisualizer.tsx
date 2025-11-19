import { mindmapData, MindmapNode } from '@/data/mindmap';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertTriangle, GitBranch } from 'lucide-react';

interface NodeCardProps {
  node: MindmapNode;
}

const NodeCard = ({ node }: NodeCardProps) => {
  const isEndNode = node.id.startsWith('end_');
  const isResolution = isEndNode && (node.id.includes('success') || node.id.includes('instruct'));
  const isEscalation = isEndNode && !isResolution;

  let type: 'step' | 'resolution' | 'escalation' = 'step';
  if (isResolution) type = 'resolution';
  if (isEscalation) type = 'escalation';

  const cardClasses = cn(
    "border-2 rounded-lg p-3 w-48 text-center bg-card flex flex-col items-center justify-center gap-2 text-xs",
    {
      'border-blue-500': type === 'step',
      'border-green-500 bg-green-500/10': type === 'resolution',
      'border-red-500 bg-red-500/10': type === 'escalation',
    }
  );

  const Icon = isResolution ? CheckCircle : isEscalation ? AlertTriangle : GitBranch;

  return (
    <div className={cardClasses}>
      <Icon className="h-5 w-5 mb-1" />
      <p className="font-semibold">{node.question}</p>
    </div>
  );
};

interface FlowBranchProps {
  node: MindmapNode;
}

const FlowBranch = ({ node }: FlowBranchProps) => {
  return (
    <div className="flex items-center">
      <NodeCard node={node} />
      {node.options && node.options.length > 0 && (
        <div className="flex items-center">
          <div className="w-8 h-0.5 bg-gray-600" />
          <div className="flex flex-col gap-4">
            {node.options.map((option, index) => {
              const nextNode = option.nextNodeId ? mindmapData[option.nextNodeId] : null;
              return (
                <div key={option.nextNodeId || index} className="flex items-center">
                  <div className="text-center w-24">
                    <p className="text-xs p-1 bg-muted rounded-md">{option.text}</p>
                  </div>
                  <div className="w-8 h-0.5 bg-gray-600" />
                  {nextNode ? <FlowBranch node={nextNode} /> : <div className="text-xs text-muted-foreground">(Fim)</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface FlowVisualizerProps {
  startNodeId: string;
}

const FlowVisualizer = ({ startNodeId }: FlowVisualizerProps) => {
  const startNode = mindmapData[startNodeId];
  if (!startNode) return <p>Flow not found.</p>;

  return (
    <div className="p-4 overflow-x-auto">
      <div className="inline-block">
        <FlowBranch node={startNode} />
      </div>
    </div>
  );
};

export default FlowVisualizer;