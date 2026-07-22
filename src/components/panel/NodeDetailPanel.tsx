import type { CSSProperties, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { MODULE_BY_ID, CATEGORY_LABELS } from '../../data/modules';
import { PROCESS_BY_TO_STAGE } from '../../data/processes';
import { useWorkflowStore } from '../../store/workflowStore';
import { useIsMobile } from '../../hooks/useMediaQuery';

export function NodeDetailPanel() {
  const selectedId = useWorkflowStore((s) => s.selectedId);
  const panelOpen = useWorkflowStore((s) => s.panelOpen);
  const setPanelOpen = useWorkflowStore((s) => s.setPanelOpen);
  const selectModule = useWorkflowStore((s) => s.selectModule);
  const openProcess = useWorkflowStore((s) => s.openProcess);
  const isMobile = useIsMobile();

  const mod = selectedId ? MODULE_BY_ID[selectedId] : null;
  const incomingProcess = selectedId ? PROCESS_BY_TO_STAGE[selectedId] : null;

  const close = () => {
    setPanelOpen(false);
    selectModule(null);
  };

  return (
    <AnimatePresence>
      {panelOpen && mod && (
        <>
          {isMobile && (
            <motion.button
              type="button"
              aria-label="إغلاق"
              className="absolute inset-0 z-40 bg-black/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={close}
            />
          )}

          <motion.aside
            dir="rtl"
            initial={
              isMobile
                ? { y: '100%', opacity: 1 }
                : { x: -420, opacity: 0 }
            }
            animate={isMobile ? { y: 0, opacity: 1 } : { x: 0, opacity: 1 }}
            exit={
              isMobile
                ? { y: '100%', opacity: 1 }
                : { x: -420, opacity: 0 }
            }
            transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            className={
              isMobile
                ? 'absolute inset-x-0 bottom-0 z-50 flex max-h-[85dvh] w-full flex-col rounded-t-3xl border border-[#2D2D2D] border-b-0 bg-[#1C1F26] shadow-2xl safe-bottom'
                : 'absolute left-0 top-0 bottom-0 z-40 flex w-full max-w-[420px] flex-col border-r border-[#2D2D2D] bg-[#1C1F26]/97 backdrop-blur-2xl shadow-2xl'
            }
            role="dialog"
            aria-label={`تفاصيل ${mod.name}`}
          >
            {isMobile && (
              <div className="flex justify-center pt-2 pb-1">
                <span className="h-1 w-10 rounded-full bg-white/20" />
              </div>
            )}

            <div className="flex items-start gap-3 p-4 sm:p-5 border-b border-[#2D2D2D]">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-[#D32F2F]/15 border border-[#D32F2F]/30 text-xl sm:text-2xl">
                {mod.emoji}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight">
                  {mod.name}
                </h2>
                <p className="text-[12px] text-white/50 mt-1 leading-relaxed line-clamp-3 sm:line-clamp-none">
                  {mod.description}
                </p>
              </div>
              <button
                type="button"
                onClick={close}
                className="h-10 w-10 sm:h-9 sm:w-9 rounded-xl border border-[#2D2D2D] flex items-center justify-center text-white/50 hover:text-white touch-manipulation"
                aria-label="إغلاق"
              >
                <X size={16} />
              </button>
            </div>

            <div className="px-4 sm:px-5 py-3 flex flex-wrap gap-2 border-b border-[#2D2D2D]">
              <Badge label={CATEGORY_LABELS[mod.category] ?? mod.category} />
              <Badge label={mod.mainUsers[0] ?? 'مستخدم'} />
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-5 pb-8">
              <Section title="وصف المرحلة">
                <p className="text-[13px] text-white/65 leading-relaxed">
                  {mod.description}
                </p>
              </Section>

              <Section title="الهدف منها">
                <p className="text-[13px] text-white/65 leading-relaxed">
                  {mod.purpose}
                </p>
              </Section>

              <ListSection title="المستخدم المسؤول" items={mod.mainUsers} />
              <ListSection title="أهم العمليات" items={mod.operations ?? []} />
              <ListSection
                title="البيانات المستخدمة (المدخلات)"
                items={mod.inputData}
              />
              <ListSection title="المخرجات" items={mod.outputData} />
              <ListSection
                title="الجداول المرتبطة (Mock)"
                items={mod.tables}
                mono
              />
              <ListSection
                title="الوحدات المرتبطة"
                items={(mod.relatedModules ?? []).map(
                  (id) => MODULE_BY_ID[id]?.name ?? id
                )}
              />
              <ListSection title="ما قبل المرحلة" items={mod.dataBefore ?? []} />
              <ListSection title="ما بعد المرحلة" items={mod.dataAfter ?? []} />
              <ListSection title="الصلاحيات المطلوبة" items={mod.permissions} />

              {incomingProcess && (
                <Section title="العملية المؤدية لهذه المرحلة">
                  <button
                    type="button"
                    onClick={() => openProcess(incomingProcess.id)}
                    className="w-full min-h-[48px] rounded-xl border border-[#D32F2F]/35 bg-[#D32F2F]/10 px-3 py-3 text-right text-[13px] font-semibold text-[#FFCDD2] transition active:bg-[#D32F2F]/25 touch-manipulation"
                  >
                    عرض تفاصيل عملية: {incomingProcess.name}
                  </button>
                </Section>
              )}

              <Section title="ملاحظات">
                <p className="text-[12px] text-white/45 leading-relaxed">
                  {mod.developmentNotes ||
                    'بيانات تجريبية داخل الواجهة فقط — جاهزة للاستبدال بمصدر حقيقي لاحقًا دون تغيير هيكل الشاشات.'}
                </p>
              </Section>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section>
      <h3 className="section-title">{title}</h3>
      {children}
    </section>
  );
}

function ListSection({
  title,
  items,
  mono,
}: {
  title: string;
  items: string[];
  mono?: boolean;
}) {
  if (!items.length) return null;
  return (
    <Section title={title}>
      <ul className="space-y-1.5">
        {items.map((item) => (
          <li
            key={item}
            className={`text-[12px] text-white/70 rounded-lg border border-[#2D2D2D]/80 bg-[#0F1115]/70 px-2.5 py-1.5 ${
              mono ? 'font-mono text-[11px] dir-ltr text-left' : ''
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </Section>
  );
}

function Badge({
  label,
  style,
}: {
  label: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className="text-[10px] tracking-wide px-2 py-1 rounded-md border border-[#2D2D2D] text-white/60"
      style={style}
    >
      {label}
    </span>
  );
}
