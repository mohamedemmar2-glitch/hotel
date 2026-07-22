import type { ReactNode } from 'react';
import {
  ChartBarIcon,
  CubeIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { WORKFLOW_MODULES } from '../../data/modules';
import { useWorkflowStore, getProgressStats } from '../../store/workflowStore';
import { complexityColor } from '../../lib/utils';

export function StatsPanel() {
  const visibleCount = useWorkflowStore((s) => s.visibleCount);
  const currentIndex = useWorkflowStore((s) => s.currentIndex);
  const elapsedSeconds = useWorkflowStore((s) => s.elapsedSeconds);
  const isPlaying = useWorkflowStore((s) => s.isPlaying);
  const isPaused = useWorkflowStore((s) => s.isPaused);

  const stats = getProgressStats({
    visibleCount,
    currentIndex,
    elapsedSeconds,
    isPlaying,
    isPaused,
  });

  const complexityDist = WORKFLOW_MODULES.reduce(
    (acc, m) => {
      acc[m.complexity] = (acc[m.complexity] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className="glass rounded-2xl p-4 w-[280px] shadow-2xl">
      <div className="flex items-center gap-2 mb-3">
        <ChartBarIcon className="h-4 w-4 text-primary" />
        <h2 className="font-display text-sm font-semibold tracking-tight">
          Statistics
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
        <Cell
          icon={<CubeIcon className="h-3 w-3" />}
          label="Modules"
          value={String(stats.totalSteps)}
        />
        <Cell label="Completed" value={String(stats.completedCount)} />
        <Cell
          label="Remaining"
          value={String(stats.totalSteps - stats.completedCount)}
        />
        <Cell
          icon={<TableCellsIcon className="h-3 w-3" />}
          label="Tables"
          value={String(stats.totalTables)}
        />
        <Cell label="Relations" value={String(stats.totalRelationships)} />
        <Cell label="Est. Hours" value={String(stats.totalHours)} />
      </div>
      <div className="text-[10px] uppercase tracking-wide text-white/40 mb-2">
        Complexity
      </div>
      <div className="space-y-1.5">
        {Object.entries(complexityDist).map(([k, v]) => (
          <div key={k} className="flex items-center gap-2">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: complexityColor(k) }}
            />
            <span className="text-[11px] capitalize text-white/60 flex-1">{k}</span>
            <span className="font-mono text-[11px]">{v}</span>
            <div className="w-16 h-1 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(v / WORKFLOW_MODULES.length) * 100}%`,
                  background: complexityColor(k),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cell({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-secondary/60 px-2.5 py-2">
      <div className="text-white/40 text-[10px] flex items-center gap-1">
        {icon}
        {label}
      </div>
      <div className="font-mono text-sm mt-0.5">{value}</div>
    </div>
  );
}
