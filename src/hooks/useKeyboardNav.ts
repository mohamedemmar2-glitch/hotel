import { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export function useKeyboardNav() {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      const store = useWorkflowStore.getState();

      switch (e.key) {
        case 'ArrowRight':
        case 'n':
        case 'N':
          e.preventDefault();
          store.next();
          break;
        case 'ArrowLeft':
        case 'p':
        case 'P':
          e.preventDefault();
          store.previous();
          break;
        case ' ':
          e.preventDefault();
          if (store.isPlaying) store.pause();
          else store.play();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          store.restart();
          break;
        case '+':
        case '=':
          window.dispatchEvent(new Event('wf-zoom-in'));
          break;
        case '-':
        case '_':
          window.dispatchEvent(new Event('wf-zoom-out'));
          break;
        case 'f':
        case 'F':
          window.dispatchEvent(new Event('wf-fit'));
          break;
        case 'Escape':
          if (store.processDialogOpen) store.closeProcess();
          else {
            store.setPanelOpen(false);
            store.selectModule(null);
          }
          break;
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
