import { memo } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
} from '@xyflow/react';

type EdgeData = {
  label?: string;
  processId?: string;
  isNew?: boolean;
  completed?: boolean;
  onOpenProcess?: (processId: string) => void;
};

function AnimatedEdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
}: EdgeProps) {
  const edgeData = (data ?? {}) as EdgeData;
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 18,
  });

  const completed = Boolean(edgeData.completed);
  const isNew = Boolean(edgeData.isNew);
  const stroke = completed ? '#2E7D32' : '#D32F2F';

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke,
          strokeWidth: 2.4,
          filter: completed
            ? 'drop-shadow(0 0 5px rgba(46,125,50,0.45))'
            : 'drop-shadow(0 0 7px rgba(211,47,47,0.55))',
          strokeDasharray: isNew ? 500 : undefined,
          animation: isNew ? 'draw-line 0.75s ease forwards' : undefined,
        }}
        className={!completed && !isNew ? 'animated-edge' : undefined}
      />

      {!completed && (
        <circle r="3.5" fill={stroke}>
          <animateMotion dur="2.4s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}

      {edgeData.label && (
        <EdgeLabelRenderer>
          <div
            dir="rtl"
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (edgeData.processId && edgeData.onOpenProcess) {
                  edgeData.onOpenProcess(edgeData.processId);
                }
              }}
              className={`inline-flex max-w-[120px] sm:max-w-[160px] items-center justify-center rounded-full border px-2 py-1.5 sm:px-2.5 text-center text-[9px] sm:text-[10px] font-bold leading-tight shadow-lg backdrop-blur-md transition hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D32F2F] touch-manipulation min-h-[32px] ${
                completed
                  ? 'border-[#2E7D32]/50 bg-[#1C1F26]/95 text-[#81C784] hover:border-[#2E7D32]'
                  : 'border-[#D32F2F]/50 bg-[#1C1F26]/95 text-[#FFCDD2] hover:border-[#D32F2F] hover:shadow-[0_0_16px_rgba(211,47,47,0.35)]'
              }`}
              title="اضغط لشرح العملية"
            >
              {edgeData.label}
            </button>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

export const AnimatedEdge = memo(AnimatedEdgeComponent);
