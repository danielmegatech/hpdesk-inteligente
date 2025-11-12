import { PossibilityNode } from '@/data/reportsData';
import { cn } from '@/lib/utils';

const NodeCard = ({ node }: { node: PossibilityNode }) => {
  const cardClasses = cn(
    "border-2 rounded-lg p-3 w-40 text-center bg-card flex flex-col items-center justify-center gap-2 text-xs",
    {
      'border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]': node.type === 'path_taken',
      'border-dashed border-gray-500': node.type === 'alternative',
      'border-green-500 bg-green-500/10': node.type === 'resolution',
    }
  );

  return (
    <div className={cardClasses}>
      <node.icon className="h-5 w-5 mb-1" />
      <p className="font-semibold">{node.text}</p>
    </div>
  );
};

const PossibilityBranch = ({ node }: { node: PossibilityNode }) => {
  return (
    <div className="flex items-center">
      <div className="flex flex-col items-center">
        <NodeCard node={node} />
      </div>
      {node.children && node.children.length > 0 && (
        <div className="flex items-center">
          {/* Horizontal line */}
          <div className="w-8 h-0.5 bg-gray-600" />
          {/* Container for children branches */}
          <div className="flex flex-col gap-4">
            {node.children.map(child => (
              <PossibilityBranch key={child.id} node={child} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PossibilityTree = ({ data }: { data: PossibilityNode }) => {
  return (
    <div className="p-4 overflow-x-auto">
      <div className="inline-block">
        <PossibilityBranch node={data} />
      </div>
    </div>
  );
};

export default PossibilityTree;