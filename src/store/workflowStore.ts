import { create } from 'zustand';
import { WORKFLOW_MODULES, WORKFLOW_ORDER } from '../data/modules';
import type { ModuleCategory, ViewMode } from '../types/workflow';

export type FilterKey =
  | 'all'
  | 'completed'
  | 'pending'
  | ModuleCategory;

interface WorkflowState {
  visibleCount: number;
  currentIndex: number;
  selectedId: string | null;
  panelOpen: boolean;
  selectedProcessId: string | null;
  processDialogOpen: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  elapsedSeconds: number;
  viewMode: ViewMode;
  searchQuery: string;
  activeFilter: FilterKey;
  highContrast: boolean;
  reduceMotion: boolean;
  sidebarCollapsed: boolean;
  playSpeedMs: number;

  // actions
  next: () => void;
  previous: () => void;
  play: () => void;
  pause: () => void;
  restart: () => void;
  goToStep: (index: number) => void;
  selectModule: (id: string | null) => void;
  setPanelOpen: (open: boolean) => void;
  openProcess: (processId: string) => void;
  closeProcess: () => void;
  setViewMode: (mode: ViewMode) => void;
  setSearchQuery: (q: string) => void;
  setActiveFilter: (f: FilterKey) => void;
  tick: () => void;
  toggleHighContrast: () => void;
  toggleReduceMotion: () => void;
  setSidebarCollapsed: (v: boolean) => void;
}

const TOTAL = WORKFLOW_ORDER.length;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  visibleCount: 1,
  currentIndex: 0,
  selectedId: WORKFLOW_ORDER[0],
  panelOpen: false,
  selectedProcessId: null,
  processDialogOpen: false,
  isPlaying: false,
  isPaused: false,
  elapsedSeconds: 0,
  viewMode: 'workflow',
  searchQuery: '',
  activeFilter: 'all',
  highContrast: false,
  reduceMotion: false,
  sidebarCollapsed: false,
  playSpeedMs: 1600,

  next: () => {
    const { visibleCount, currentIndex } = get();
    if (visibleCount < TOTAL) {
      const nextVisible = visibleCount + 1;
      const nextIndex = nextVisible - 1;
      set({
        visibleCount: nextVisible,
        currentIndex: nextIndex,
        selectedId: WORKFLOW_ORDER[nextIndex],
        panelOpen: false,
      });
    } else if (currentIndex < TOTAL - 1) {
      const nextIndex = currentIndex + 1;
      set({
        currentIndex: nextIndex,
        selectedId: WORKFLOW_ORDER[nextIndex],
      });
    } else {
      set({ isPlaying: false, isPaused: false });
    }
  },

  previous: () => {
    const { currentIndex, visibleCount } = get();
    if (currentIndex > 0) {
      const prev = currentIndex - 1;
      set({
        currentIndex: prev,
        selectedId: WORKFLOW_ORDER[prev],
      });
    } else if (visibleCount > 1) {
      set({
        visibleCount: visibleCount - 1,
        currentIndex: 0,
        selectedId: WORKFLOW_ORDER[0],
      });
    }
  },

  play: () => set({ isPlaying: true, isPaused: false }),
  pause: () => set({ isPlaying: false, isPaused: true }),

  restart: () =>
    set({
      visibleCount: 1,
      currentIndex: 0,
      selectedId: WORKFLOW_ORDER[0],
      panelOpen: false,
      processDialogOpen: false,
      selectedProcessId: null,
      isPlaying: false,
      isPaused: false,
      elapsedSeconds: 0,
      searchQuery: '',
    }),

  goToStep: (index) => {
    if (index < 0 || index >= TOTAL) return;
    const { visibleCount } = get();
    set({
      currentIndex: index,
      selectedId: WORKFLOW_ORDER[index],
      visibleCount: Math.max(visibleCount, index + 1),
    });
  },

  selectModule: (id) =>
    set({
      selectedId: id,
      panelOpen: !!id,
      currentIndex: id ? WORKFLOW_ORDER.indexOf(id) : get().currentIndex,
    }),

  setPanelOpen: (open) => set({ panelOpen: open }),

  openProcess: (processId) =>
    set({
      selectedProcessId: processId,
      processDialogOpen: true,
      isPlaying: false,
    }),

  closeProcess: () =>
    set({
      processDialogOpen: false,
      selectedProcessId: null,
    }),

  setViewMode: (mode) => set({ viewMode: mode }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setActiveFilter: (f) => set({ activeFilter: f }),
  tick: () => set((s) => ({ elapsedSeconds: s.elapsedSeconds + 1 })),
  toggleHighContrast: () => set((s) => ({ highContrast: !s.highContrast })),
  toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
}));

export function getNodeStatus(
  index: number,
  currentIndex: number,
  visibleCount: number
): 'hidden' | 'completed' | 'current' | 'available' {
  if (index >= visibleCount) return 'hidden';
  if (index < currentIndex) return 'completed';
  if (index === currentIndex) return 'current';
  return 'available';
}

export function getProgressStats(state: {
  visibleCount: number;
  currentIndex: number;
  elapsedSeconds: number;
  isPlaying: boolean;
  isPaused: boolean;
}) {
  const total = TOTAL;
  const completedCount = Math.min(state.currentIndex, total);
  const completedPercent = Math.round((completedCount / (total - 1 || 1)) * 100);
  const remainingSteps = Math.max(total - state.visibleCount, 0);
  let status: 'idle' | 'playing' | 'paused' | 'completed' = 'idle';
  if (state.currentIndex >= total - 1 && state.visibleCount >= total) status = 'completed';
  else if (state.isPlaying) status = 'playing';
  else if (state.isPaused) status = 'paused';

  const totalHours = WORKFLOW_MODULES.reduce((s, m) => s + m.estimatedHours, 0);
  const totalTables = new Set(WORKFLOW_MODULES.flatMap((m) => m.tables)).size;
  const totalRelationships = WORKFLOW_MODULES.reduce(
    (s, m) => s + m.relationships.length,
    0
  );

  return {
    currentStep: state.currentIndex + 1,
    totalSteps: total,
    completedCount,
    completedPercent: Math.min(completedPercent, 100),
    remainingSteps,
    elapsedSeconds: state.elapsedSeconds,
    status,
    totalHours,
    totalTables,
    totalRelationships,
  };
}
