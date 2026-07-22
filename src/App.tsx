import { useEffect, useRef, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Header } from './components/layout/Header';
import { Controls } from './components/layout/Controls';
import {
  ProgressPanel,
  MobileProgressBar,
} from './components/layout/ProgressPanel';
import { WorkflowCanvas } from './components/flow/WorkflowCanvas';
import { NodeDetailPanel } from './components/panel/NodeDetailPanel';
import { ProcessDialog } from './components/panel/ProcessDialog';
import { Particles } from './components/effects/Particles';
import { useKeyboardNav } from './hooks/useKeyboardNav';
import { useWorkflowStore } from './store/workflowStore';
import { WORKFLOW_ORDER } from './data/modules';
import { cn } from './lib/utils';

export default function App() {
  useKeyboardNav();

  const isPlaying = useWorkflowStore((s) => s.isPlaying);
  const playSpeedMs = useWorkflowStore((s) => s.playSpeedMs);
  const next = useWorkflowStore((s) => s.next);
  const pause = useWorkflowStore((s) => s.pause);
  const visibleCount = useWorkflowStore((s) => s.visibleCount);
  const currentIndex = useWorkflowStore((s) => s.currentIndex);
  const tick = useWorkflowStore((s) => s.tick);
  const highContrast = useWorkflowStore((s) => s.highContrast);
  const reduceMotion = useWorkflowStore((s) => s.reduceMotion);
  const panelOpen = useWorkflowStore((s) => s.panelOpen);
  const processDialogOpen = useWorkflowStore((s) => s.processDialogOpen);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const shellRef = useRef<HTMLDivElement>(null);
  const completedToast = useRef(false);

  useEffect(() => {
    if (!isPlaying) return;
    const id = window.setInterval(() => {
      const state = useWorkflowStore.getState();
      const atEnd =
        state.visibleCount >= WORKFLOW_ORDER.length &&
        state.currentIndex >= WORKFLOW_ORDER.length - 1;
      if (atEnd) {
        pause();
        if (!completedToast.current) {
          completedToast.current = true;
          toast.success('اكتملت رحلة تشغيل الفندق');
        }
        return;
      }
      next();
    }, playSpeedMs);
    return () => window.clearInterval(id);
  }, [isPlaying, playSpeedMs, next, pause]);

  useEffect(() => {
    const id = window.setInterval(() => tick(), 1000);
    return () => window.clearInterval(id);
  }, [tick]);

  useEffect(() => {
    document.body.classList.toggle('reduce-motion', reduceMotion);
    document.body.classList.toggle('high-contrast', highContrast);
    document.documentElement.lang = 'ar';
    document.documentElement.dir = 'rtl';
  }, [reduceMotion, highContrast]);

  useEffect(() => {
    if (visibleCount === 1 && currentIndex === 0) completedToast.current = false;
  }, [visibleCount, currentIndex]);

  // Lock body scroll when mobile sheets open
  useEffect(() => {
    const lock = panelOpen || processDialogOpen;
    document.body.style.overflow = lock ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [panelOpen, processDialogOpen]);

  const toggleFullscreen = async () => {
    const el = shellRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      await el.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  return (
    <div
      ref={shellRef}
      dir="rtl"
      className={cn(
        'h-[100dvh] w-full flex flex-col text-white relative overflow-hidden',
        highContrast && 'contrast-125'
      )}
      style={{ background: '#0F1115' }}
    >
      <Header />

      <main className="relative flex-1 min-h-0">
        <Particles />

        <div className="absolute inset-0 z-10">
          <WorkflowCanvas />
        </div>

        <div className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between p-2.5 sm:p-4">
          <div className="flex justify-start">
            <div className="pointer-events-auto hidden md:block">
              <ProgressPanel />
            </div>
            <div className="pointer-events-auto w-full md:hidden">
              <MobileProgressBar />
            </div>
          </div>

          <div className="flex justify-center pointer-events-auto pb-1 safe-bottom">
            <Controls
              isFullscreen={isFullscreen}
              onToggleFullscreen={toggleFullscreen}
            />
          </div>
        </div>

        <NodeDetailPanel />
        <ProcessDialog />
      </main>

      <Toaster
        position="top-center"
        toastOptions={{
          className: 'text-sm',
          style: {
            background: '#1C1F26',
            color: '#fff',
            border: '1px solid #2D2D2D',
            fontFamily: 'inherit',
            maxWidth: '90vw',
          },
        }}
      />
    </div>
  );
}
