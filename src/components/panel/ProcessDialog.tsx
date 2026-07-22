import type { ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, X } from 'lucide-react';
import { PROCESS_BY_ID } from '../../data/processes';
import { MODULE_BY_ID, WORKFLOW_ORDER } from '../../data/modules';
import { useWorkflowStore } from '../../store/workflowStore';

export function ProcessDialog() {
  const open = useWorkflowStore((s) => s.processDialogOpen);
  const processId = useWorkflowStore((s) => s.selectedProcessId);
  const closeProcess = useWorkflowStore((s) => s.closeProcess);
  const goToStep = useWorkflowStore((s) => s.goToStep);
  const selectModule = useWorkflowStore((s) => s.selectModule);

  const process = processId ? PROCESS_BY_ID[processId] : null;
  const nextStage = process ? MODULE_BY_ID[process.nextStageId] : null;
  const toStage = process ? MODULE_BY_ID[process.toStageId] : null;

  const goNext = () => {
    if (!process) return;
    const idx = WORKFLOW_ORDER.indexOf(process.nextStageId);
    if (idx >= 0) {
      goToStep(idx);
      selectModule(process.nextStageId);
      useWorkflowStore.setState({ panelOpen: true });
    }
    closeProcess();
  };

  return (
    <AnimatePresence>
      {open && process && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" dir="rtl">
          <motion.button
            type="button"
            aria-label="إغلاق الخلفية"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeProcess}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="process-dialog-title"
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 340, damping: 28 }}
            className="relative z-10 flex h-[92dvh] sm:h-auto sm:max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl border border-[#2D2D2D] bg-[#1C1F26] shadow-2xl safe-bottom"
          >
            <div className="flex justify-center pt-2 sm:hidden">
              <span className="h-1 w-10 rounded-full bg-white/20" />
            </div>
            <div className="flex items-start gap-3 border-b border-[#2D2D2D] bg-gradient-to-l from-[#D32F2F]/15 to-transparent p-4 sm:p-5">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] text-white/40 mb-1">
                  عملية · من {MODULE_BY_ID[process.fromStageId]?.name} إلى{' '}
                  {toStage?.name}
                </p>
                <h2
                  id="process-dialog-title"
                  className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white"
                >
                  {process.name}
                </h2>
              </div>
              <button
                type="button"
                onClick={closeProcess}
                className="flex h-10 w-10 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl border border-[#2D2D2D] text-white/50 hover:text-white touch-manipulation"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-5 pb-8">
              <Block title="وصف العملية">
                <p className="text-[13px] leading-relaxed text-white/70">
                  {process.description}
                </p>
              </Block>

              <Block title="من يبدأ العملية">
                <div className="flex flex-wrap gap-2">
                  {process.startedBy.map((u) => (
                    <Chip key={u}>{u}</Chip>
                  ))}
                </div>
              </Block>

              <Block title="الهدف">
                <p className="text-[13px] leading-relaxed text-white/70">
                  {process.purpose}
                </p>
              </Block>

              <Block title="البيانات المطلوبة">
                <ul className="grid gap-1.5 sm:grid-cols-2">
                  {process.requiredData.map((d) => (
                    <li
                      key={d}
                      className="rounded-lg border border-[#2D2D2D] bg-[#0F1115]/80 px-2.5 py-1.5 text-[12px] text-white/75"
                    >
                      {d}
                    </li>
                  ))}
                </ul>
              </Block>

              <Block title="خطوات التنفيذ">
                <ol className="space-y-0">
                  {process.steps.map((step, i) => (
                    <li key={step} className="flex flex-col items-stretch">
                      <div className="flex items-start gap-3 rounded-xl border border-[#2D2D2D] bg-[#151820] px-3 py-2.5">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#D32F2F]/20 text-[11px] font-bold text-[#EF5350]">
                          {i + 1}
                        </span>
                        <span className="text-[13px] text-white/80 pt-0.5">{step}</span>
                      </div>
                      {i < process.steps.length - 1 && (
                        <div className="flex justify-center py-1 text-[#D32F2F]/70">
                          <ArrowDown size={14} />
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              </Block>

              <Block title="الجداول المتأثرة (Mock Data)">
                <div className="flex flex-wrap gap-2">
                  {process.affectedTables.map((t) => (
                    <code
                      key={t}
                      className="rounded-md border border-[#2D2D2D] bg-[#0F1115] px-2 py-1 font-mono text-[11px] text-[#EF9A9A] dir-ltr"
                    >
                      {t}
                    </code>
                  ))}
                </div>
              </Block>

              <div className="grid gap-4 sm:grid-cols-2">
                <Block title="البيانات قبل التنفيذ">
                  <ul className="space-y-1.5">
                    {process.dataBefore.map((x) => (
                      <li key={x} className="text-[12px] text-white/65">
                        • {x}
                      </li>
                    ))}
                  </ul>
                </Block>
                <Block title="البيانات بعد التنفيذ">
                  <ul className="space-y-1.5">
                    {process.dataAfter.map((x) => (
                      <li key={x} className="text-[12px] text-[#81C784]">
                        • {x}
                      </li>
                    ))}
                  </ul>
                </Block>
              </div>

              <Block title="الصلاحيات المطلوبة">
                <div className="flex flex-wrap gap-2">
                  {process.permissions.map((p) => (
                    <Chip key={p}>{p}</Chip>
                  ))}
                </div>
              </Block>

              <Block title="النتائج النهائية">
                <ul className="space-y-1.5">
                  {process.outcomes.map((o) => (
                    <li key={o} className="text-[12px] text-white/70">
                      • {o}
                    </li>
                  ))}
                </ul>
              </Block>

              {process.notes && (
                <Block title="ملاحظات">
                  <p className="text-[12px] text-white/50 leading-relaxed">
                    {process.notes}
                  </p>
                </Block>
              )}

              <Block title="الخطوة التالية">
                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 rounded-2xl border border-[#D32F2F]/30 bg-[#D32F2F]/10 p-4">
                  <div>
                    <p className="text-[11px] text-white/45">المرحلة التالية</p>
                    <p className="mt-1 font-display text-base sm:text-lg font-bold">
                      {nextStage?.emoji} {nextStage?.name ?? '—'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={goNext}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#D32F2F] px-4 py-3 sm:py-2.5 text-sm font-bold text-white shadow-lg shadow-[#D32F2F]/25 transition hover:bg-[#E53935] touch-manipulation min-h-[48px]"
                  >
                    الانتقال إلى المرحلة التالية
                    <ArrowLeft size={16} />
                  </button>
                </div>
              </Block>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="mb-2 font-display text-[11px] font-bold text-white/40">
        {title}
      </h3>
      {children}
    </section>
  );
}

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-[#2D2D2D] bg-[#0F1115] px-2.5 py-1 text-[11px] text-white/70">
      {children}
    </span>
  );
}
