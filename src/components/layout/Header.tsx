import { Search, Download } from 'lucide-react';
import { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { exportWorkflow } from '../../lib/export';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';

export function Header() {
  const searchQuery = useWorkflowStore((s) => s.searchQuery);
  const setSearchQuery = useWorkflowStore((s) => s.setSearchQuery);
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <header
      dir="rtl"
      className="relative z-30 border-b border-[#2D2D2D]/80 bg-[#0c0c0c]/95 backdrop-blur-xl safe-top"
    >
      <div className="flex flex-col gap-2.5 px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6">
        <div className="flex items-center gap-2.5 justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-[#D32F2F]/15 border border-[#D32F2F]/30 text-base sm:text-lg">
              🏨
            </div>
            <div className="min-w-0">
              <h1 className="font-display text-[13px] sm:text-lg font-bold tracking-tight leading-snug truncate">
                <span className="sm:hidden">رحلة عمل الفندق</span>
                <span className="hidden sm:inline">
                  نظام إدارة الفندق
                  <span className="text-[#D32F2F]"> · </span>
                  خارطة رحلة العمل
                </span>
              </h1>
              <p className="hidden sm:block text-[11px] text-white/45 mt-1 truncate">
                مخطط تفاعلي أفقي لشرح دورة تشغيل الفندق بالكامل
              </p>
            </div>
          </div>

          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setExportOpen((v) => !v)}
              className="h-9 w-9 sm:w-auto sm:px-3 rounded-xl border border-[#2D2D2D] bg-[#1C1F26]/80 text-xs font-medium text-white/80 hover:border-[#D32F2F]/40 inline-flex items-center justify-center gap-1.5"
              aria-label="تصدير"
            >
              <Download size={14} />
              <span className="hidden sm:inline">تصدير</span>
            </button>
            <div
              className={cn(
                'absolute left-0 top-full mt-1 w-36 rounded-xl border border-[#2D2D2D] bg-[#1C1F26] shadow-2xl p-1 z-50 transition',
                exportOpen
                  ? 'visible opacity-100'
                  : 'invisible opacity-0 pointer-events-none sm:group-hover:visible'
              )}
            >
              {(['png', 'svg', 'pdf', 'json', 'print'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  className="w-full text-right px-3 py-2.5 rounded-lg text-xs hover:bg-[#D32F2F]/10 uppercase min-h-[40px]"
                  onClick={async () => {
                    setExportOpen(false);
                    try {
                      await exportWorkflow(fmt);
                      toast.success(`تم التصدير: ${fmt.toUpperCase()}`);
                    } catch {
                      toast.error('فشل التصدير');
                    }
                  }}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="relative w-full">
          <Search
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/35 pointer-events-none"
          />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مرحلة…"
            className="w-full h-10 sm:h-9 rounded-xl border border-[#2D2D2D] bg-[#1C1F26]/80 pr-9 pl-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#D32F2F]/50"
            aria-label="بحث"
          />
        </div>
      </div>
    </header>
  );
}
