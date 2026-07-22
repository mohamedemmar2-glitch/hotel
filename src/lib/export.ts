import { toPng, toSvg } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { WORKFLOW_MODULES } from '../data/modules';
import { useWorkflowStore } from '../store/workflowStore';

export async function exportWorkflow(fmt: 'png' | 'svg' | 'pdf' | 'json' | 'print') {
  const el = document.getElementById('workflow-canvas');

  if (fmt === 'json') {
    const state = useWorkflowStore.getState();
    const payload = {
      exportedAt: new Date().toISOString(),
      visibleCount: state.visibleCount,
      currentIndex: state.currentIndex,
      modules: WORKFLOW_MODULES,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    downloadBlob(blob, 'hotel-workflow.json');
    return;
  }

  if (fmt === 'print') {
    window.print();
    return;
  }

  if (!el) throw new Error('Canvas not found');

  if (fmt === 'png') {
    const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
    downloadDataUrl(dataUrl, 'hotel-workflow.png');
    return;
  }

  if (fmt === 'svg') {
    const dataUrl = await toSvg(el, { cacheBust: true });
    downloadDataUrl(dataUrl, 'hotel-workflow.svg');
    return;
  }

  if (fmt === 'pdf') {
    const dataUrl = await toPng(el, { pixelRatio: 2, cacheBust: true });
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'px', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    pdf.setFillColor(9, 9, 9);
    pdf.rect(0, 0, pageW, pageH, 'F');
    pdf.addImage(dataUrl, 'PNG', 20, 20, pageW - 40, pageH - 40, undefined, 'FAST');
    pdf.save('hotel-workflow.pdf');
  }
}

function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
