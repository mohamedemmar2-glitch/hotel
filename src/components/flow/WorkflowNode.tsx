import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { WorkflowModule } from '../../types/workflow';

export type WorkflowNodeData = {
  module: WorkflowModule;
  status: 'hidden' | 'completed' | 'current' | 'available';
  stepNumber: number;
  onOpen: (id: string) => void;
  compact?: boolean;
};

function WorkflowNodeComponent({ data }: NodeProps) {
  const d = data as WorkflowNodeData;
  const { module, status, stepNumber, onOpen, compact } = d;
  const isCurrent = status === 'current';
  const isCompleted = status === 'completed';

  return (
    <motion.button
      type="button"
      dir="rtl"
      initial={{ opacity: 0, x: 36, scale: 0.88 }}
      animate={{
        opacity: 1,
        x: 0,
        scale: 1,
        boxShadow: isCurrent
          ? '0 0 0 1px rgba(211,47,47,0.55), 0 0 36px rgba(211,47,47,0.35)'
          : isCompleted
            ? '0 0 0 1px rgba(46,125,50,0.5), 0 0 22px rgba(46,125,50,0.22)'
            : '0 8px 28px rgba(0,0,0,0.45)',
      }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen(module.id)}
      className={cn(
        'text-right rounded-2xl border cursor-pointer backdrop-blur-xl touch-manipulation',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D32F2F]',
        compact ? 'w-[168px] px-3 py-3' : 'w-[220px] px-4 py-4',
        isCurrent && 'pulse-current border-[#D32F2F]/70 bg-[#1C1F26]',
        isCompleted && 'border-[#2E7D32]/55 bg-[#132016]',
        !isCurrent &&
          !isCompleted &&
          'border-[#2D2D2D] bg-[#1C1F26]/95 hover:border-[#D32F2F]/45'
      )}
      aria-label={`${module.name}، المرحلة ${stepNumber}`}
    >
      <Handle
        type="target"
        position={Position.Right}
        className="!w-2.5 !h-2.5 !bg-[#2D2D2D] !border-0"
      />

      <div className="flex items-start gap-2.5">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl border',
            compact ? 'h-10 w-10 text-xl' : 'h-12 w-12 text-2xl',
            isCurrent && 'bg-[#D32F2F]/15 border-[#D32F2F]/40',
            isCompleted && 'bg-[#2E7D32]/15 border-[#2E7D32]/40',
            !isCurrent && !isCompleted && 'bg-[#111] border-[#2D2D2D]'
          )}
        >
          {module.emoji ?? '•'}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <span
              className={cn(
                'text-[9px] sm:text-[10px] font-mono px-1.5 py-0.5 rounded-md border',
                isCurrent && 'text-[#D32F2F] border-[#D32F2F]/30 bg-[#D32F2F]/10',
                isCompleted && 'text-[#2E7D32] border-[#2E7D32]/30 bg-[#2E7D32]/10',
                !isCurrent && !isCompleted && 'text-white/40 border-[#2D2D2D]'
              )}
            >
              {isCompleted ? 'مكتمل' : isCurrent ? 'الحالي' : 'متاح'}
            </span>
            <span className="text-[10px] text-white/35 font-mono">
              {compact ? `#${stepNumber}` : `المرحلة ${stepNumber}`}
            </span>
          </div>
          <h3
            className={cn(
              'mt-1 font-display font-bold tracking-tight truncate',
              compact ? 'text-[13px]' : 'text-[15px]'
            )}
          >
            {module.name}
          </h3>
          <p
            className={cn(
              'mt-1 leading-relaxed text-white/50',
              compact ? 'text-[10px] line-clamp-2' : 'text-[11px] line-clamp-2'
            )}
          >
            {module.description}
          </p>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Left}
        className="!w-2.5 !h-2.5 !bg-[#2D2D2D] !border-0"
      />
    </motion.button>
  );
}

export const WorkflowNode = memo(WorkflowNodeComponent);
