import { motion } from 'framer-motion';
import { useWorkflowStore, getProgressStats } from '../../store/workflowStore';
import { formatTime } from '../../lib/utils';
import { MODULE_BY_ID, WORKFLOW_ORDER } from '../../data/modules';

const STATUS_AR: Record<string, string> = {
  idle: 'جاهز',
  playing: 'تشغيل',
  paused: 'إيقاف',
  completed: 'مكتمل',
};

export function ProgressPanel() {
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

  const current = MODULE_BY_ID[WORKFLOW_ORDER[currentIndex]];

  return (
    <div dir="rtl" className="glass rounded-2xl p-4 w-[260px] shadow-2xl">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-sm font-semibold tracking-tight">التقدم</h2>
        <span
          className={`text-[10px] font-mono px-2 py-0.5 rounded-md border ${
            stats.status === 'playing'
              ? 'text-[#D32F2F] border-[#D32F2F]/30 bg-[#D32F2F]/10'
              : stats.status === 'completed'
                ? 'text-[#2E7D32] border-[#2E7D32]/30 bg-[#2E7D32]/10'
                : 'text-white/45 border-[#2D2D2D]'
          }`}
        >
          {STATUS_AR[stats.status]}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-[11px] text-white/50 mb-1.5">
          <span>
            المرحلة {stats.currentStep} / {stats.totalSteps}
          </span>
          <span className="font-mono text-white/70">{stats.completedPercent}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-[#111] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-l from-[#D32F2F] to-[#EF5350]"
            initial={false}
            animate={{ width: `${stats.completedPercent}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <p className="text-[12px] text-white/70 truncate mb-3">
        <span className="text-white/40">الحالي · </span>
        {current?.emoji} {current?.name}
      </p>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <Stat label="المتبقي" value={String(stats.remainingSteps)} />
        <Stat label="الوقت" value={formatTime(stats.elapsedSeconds)} />
        <Stat label="مكتمل" value={String(stats.completedCount)} />
        <Stat label="ظاهر" value={String(visibleCount)} />
      </div>
    </div>
  );
}

/** Compact progress strip for mobile */
export function MobileProgressBar() {
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
  const current = MODULE_BY_ID[WORKFLOW_ORDER[currentIndex]];

  return (
    <div
      dir="rtl"
      className="glass w-full max-w-full rounded-2xl px-3 py-2.5 shadow-xl"
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="min-w-0 truncate text-[12px] font-semibold">
          {current?.emoji} {current?.name}
        </p>
        <span className="shrink-0 font-mono text-[11px] text-white/55">
          {stats.currentStep}/{stats.totalSteps} · {stats.completedPercent}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-[#111] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-l from-[#D32F2F] to-[#EF5350]"
          initial={false}
          animate={{ width: `${stats.completedPercent}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#2D2D2D] bg-[#111]/70 px-2.5 py-2">
      <div className="text-white/40 text-[10px]">{label}</div>
      <div className="font-mono text-sm mt-0.5">{value}</div>
    </div>
  );
}
