import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Scan,
} from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';
import { WORKFLOW_ORDER } from '../../data/modules';
import { cn } from '../../lib/utils';
import toast from 'react-hot-toast';

interface Props {
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function Controls({ isFullscreen, onToggleFullscreen }: Props) {
  const next = useWorkflowStore((s) => s.next);
  const previous = useWorkflowStore((s) => s.previous);
  const play = useWorkflowStore((s) => s.play);
  const pause = useWorkflowStore((s) => s.pause);
  const restart = useWorkflowStore((s) => s.restart);
  const isPlaying = useWorkflowStore((s) => s.isPlaying);
  const currentIndex = useWorkflowStore((s) => s.currentIndex);
  const visibleCount = useWorkflowStore((s) => s.visibleCount);

  const atEnd =
    visibleCount >= WORKFLOW_ORDER.length &&
    currentIndex >= WORKFLOW_ORDER.length - 1;

  const btn =
    'inline-flex h-11 w-11 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-[#2D2D2D] bg-[#1C1F26]/95 text-white/80 transition active:scale-95 hover:border-[#D32F2F]/50 hover:text-white hover:bg-[#D32F2F]/10 disabled:opacity-35 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D32F2F] touch-manipulation';

  return (
    <div
      dir="rtl"
      className="glass flex max-w-[calc(100vw-1.5rem)] flex-wrap items-center justify-center gap-1 rounded-2xl p-1.5 shadow-2xl sm:gap-1.5"
    >
      <button
        type="button"
        className={btn}
        onClick={previous}
        disabled={currentIndex === 0 && visibleCount <= 1}
        aria-label="السابق"
      >
        <ChevronRight size={18} />
      </button>

      <button
        type="button"
        className={cn(btn, isPlaying && 'border-[#D32F2F]/50 text-[#D32F2F]')}
        onClick={() => {
          if (isPlaying) {
            pause();
            toast('تم الإيقاف');
          } else {
            if (atEnd) restart();
            play();
            toast.success('تشغيل تلقائي');
          }
        }}
        aria-label={isPlaying ? 'إيقاف' : 'تشغيل'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
      </button>

      <button
        type="button"
        className={cn(
          btn,
          'w-auto min-w-[5.5rem] px-3 gap-1.5 bg-[#D32F2F]/15 border-[#D32F2F]/40 text-[#EF5350] hover:bg-[#D32F2F]/25'
        )}
        onClick={() => {
          next();
          if (
            visibleCount >= WORKFLOW_ORDER.length - 1 &&
            currentIndex >= WORKFLOW_ORDER.length - 2
          ) {
            toast.success('اكتملت رحلة العمل');
          }
        }}
        disabled={atEnd}
        aria-label="التالي"
      >
        <span className="text-xs font-bold tracking-wide">التالي</span>
        <ChevronLeft size={16} />
      </button>

      <button
        type="button"
        className={btn}
        onClick={() => {
          restart();
          toast('تمت إعادة التشغيل');
        }}
        aria-label="إعادة"
      >
        <RotateCcw size={16} />
      </button>

      <div className="mx-0.5 hidden h-6 w-px bg-[#2D2D2D] sm:block sm:mx-1" />

      <button
        type="button"
        className={btn}
        onClick={() => window.dispatchEvent(new Event('wf-zoom-in'))}
        aria-label="تكبير"
      >
        <ZoomIn size={16} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => window.dispatchEvent(new Event('wf-zoom-out'))}
        aria-label="تصغير"
      >
        <ZoomOut size={16} />
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => window.dispatchEvent(new Event('wf-fit'))}
        aria-label="ملائمة الشاشة"
      >
        <Scan size={16} />
      </button>
      <button
        type="button"
        className={cn(btn, 'hidden sm:inline-flex')}
        onClick={onToggleFullscreen}
        aria-label="ملء الشاشة"
      >
        {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  );
}
