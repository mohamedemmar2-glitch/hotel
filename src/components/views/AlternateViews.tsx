import { WORKFLOW_MODULES, MODULE_BY_ID, CATEGORY_LABELS } from '../../data/modules';
import { useWorkflowStore, getProgressStats } from '../../store/workflowStore';
import { complexityColor, RELATION_COLORS, cn } from '../../lib/utils';
import type { ViewMode } from '../../types/workflow';

function useVisibleModules() {
  const visibleCount = useWorkflowStore((s) => s.visibleCount);
  const currentIndex = useWorkflowStore((s) => s.currentIndex);
  const activeFilter = useWorkflowStore((s) => s.activeFilter);
  const selectModule = useWorkflowStore((s) => s.selectModule);

  let mods = WORKFLOW_MODULES.slice(0, visibleCount);

  if (activeFilter === 'completed') {
    mods = mods.filter((_, i) => i < currentIndex);
  } else if (activeFilter === 'pending') {
    mods = mods.filter((_, i) => i >= currentIndex);
  } else if (activeFilter !== 'all') {
    mods = mods.filter((m) => m.category === activeFilter);
  }

  return { mods, currentIndex, selectModule, visibleCount };
}

export function AlternateViews({ mode }: { mode: ViewMode }) {
  if (mode === 'workflow') return null;

  return (
    <div className="absolute inset-0 z-20 overflow-auto bg-[#090909]/96 p-6">
      {mode === 'timeline' && <TimelineView />}
      {mode === 'tree' && <TreeView />}
      {mode === 'mindmap' && <MindMapView />}
      {mode === 'flowchart' && <FlowchartView />}
      {mode === 'architecture' && <ArchitectureView />}
      {mode === 'dependency' && <DependencyView />}
      {mode === 'database' && <DatabaseView />}
      {mode === 'roadmap' && <RoadmapView />}
    </div>
  );
}

function TimelineView() {
  const { mods, currentIndex, selectModule } = useVisibleModules();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Timeline</h2>
      <div className="relative pl-8 space-y-0">
        <div className="absolute left-3 top-2 bottom-2 w-px bg-border" />
        {mods.map((m, i) => {
          const done = i < currentIndex;
          const current = i === currentIndex;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => selectModule(m.id)}
              className="relative w-full text-left pb-8 group"
            >
              <span
                className={cn(
                  'absolute -left-8 top-1 h-3.5 w-3.5 rounded-full border-2',
                  current && 'bg-primary border-primary glow-red',
                  done && 'bg-success border-success',
                  !current && !done && 'bg-card border-border'
                )}
              />
              <div
                className={cn(
                  'rounded-2xl border p-4 transition group-hover:border-primary/40',
                  current ? 'border-primary/40 bg-primary/5' : 'border-border bg-card/60'
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display font-semibold">{m.name}</span>
                  <span className="text-[10px] font-mono text-white/40">
                    {m.estimatedHours}h
                  </span>
                </div>
                <p className="text-[12px] text-white/50 mt-1">{m.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TreeView() {
  const { mods, selectModule, currentIndex } = useVisibleModules();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Tree View</h2>
      <ul className="space-y-1 font-mono text-[13px]">
        {mods.map((m, i) => (
          <li key={m.id} style={{ paddingLeft: Math.min(i, 8) * 16 }}>
            <button
              type="button"
              onClick={() => selectModule(m.id)}
              className={cn(
                'w-full text-left rounded-lg px-3 py-2 border border-transparent hover:border-border hover:bg-card/50',
                i === currentIndex && 'border-primary/30 bg-primary/10 text-primary'
              )}
            >
              ├─ {m.name}
              <span className="text-white/30 ml-2">{CATEGORY_LABELS[m.category]}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MindMapView() {
  const { mods, selectModule, currentIndex } = useVisibleModules();
  const center = mods[Math.floor(mods.length / 2)] ?? mods[0];
  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="relative w-full max-w-4xl h-[520px]">
        {center && (
          <button
            type="button"
            onClick={() => selectModule(center.id)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 rounded-2xl border border-primary/50 bg-primary/15 px-5 py-3 font-display font-bold glow-red"
          >
            {center.name}
          </button>
        )}
        {mods.map((m, i) => {
          if (m.id === center?.id) return null;
          const angle = (i / mods.length) * Math.PI * 2;
          const r = 180 + (i % 3) * 28;
          const x = 50 + Math.cos(angle) * (r / 5.2);
          const y = 50 + Math.sin(angle) * (r / 5.2);
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => selectModule(m.id)}
              style={{ left: `${x}%`, top: `${y}%` }}
              className={cn(
                'absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-3 py-1.5 text-[11px] bg-card/80',
                i === currentIndex
                  ? 'border-primary text-primary'
                  : 'border-border text-white/70'
              )}
            >
              {m.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function FlowchartView() {
  const { mods, selectModule, currentIndex } = useVisibleModules();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Flowchart</h2>
      <div className="flex flex-col items-center gap-0">
        {mods.map((m, i) => (
          <div key={m.id} className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => selectModule(m.id)}
              className={cn(
                'min-w-[220px] rounded-xl border px-4 py-3 text-sm font-medium',
                i === currentIndex
                  ? 'border-primary bg-primary/15 text-primary'
                  : i < currentIndex
                    ? 'border-success/40 bg-success/10'
                    : 'border-border bg-card'
              )}
            >
              {m.name}
            </button>
            {i < mods.length - 1 && (
              <div className="h-8 w-px bg-gradient-to-b from-primary/60 to-border my-1" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ArchitectureView() {
  const layers = [
    { name: 'Presentation', cats: ['reports', 'core'] },
    { name: 'Operations', cats: ['guests', 'rooms', 'services', 'restaurant'] },
    { name: 'Finance', cats: ['finance'] },
    { name: 'Infrastructure', cats: ['administration', 'maintenance'] },
  ];
  const { mods, selectModule } = useVisibleModules();

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Architecture View</h2>
      <div className="space-y-4">
        {layers.map((layer) => (
          <div key={layer.name} className="rounded-2xl border border-border bg-card/40 p-4">
            <h3 className="text-xs uppercase tracking-widest text-white/40 mb-3">
              {layer.name}
            </h3>
            <div className="flex flex-wrap gap-2">
              {mods
                .filter((m) => layer.cats.includes(m.category))
                .map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectModule(m.id)}
                    className="rounded-xl border border-border bg-secondary/60 px-3 py-2 text-[12px] hover:border-primary/40"
                  >
                    {m.name}
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DependencyView() {
  const { mods, selectModule } = useVisibleModules();
  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-6">Module Dependencies</h2>
      <div className="space-y-3">
        {mods.map((m) => (
          <div key={m.id} className="rounded-2xl border border-border bg-card/50 p-4">
            <button
              type="button"
              onClick={() => selectModule(m.id)}
              className="font-display font-semibold hover:text-primary"
            >
              {m.name}
            </button>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {m.relationships.map((r, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-md border"
                  style={{
                    color: RELATION_COLORS[r.type],
                    borderColor: RELATION_COLORS[r.type] + '55',
                  }}
                >
                  {r.type.replace(/_/g, ' ')} → {MODULE_BY_ID[r.targetId]?.name ?? r.targetId}
                </span>
              ))}
              {m.relationships.length === 0 && (
                <span className="text-[11px] text-white/35">No dependencies</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DatabaseView() {
  const { mods, selectModule } = useVisibleModules();
  const tables = mods.flatMap((m) =>
    m.tables.map((t) => ({ table: t, module: m }))
  );

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-2">Database View</h2>
      <p className="text-[13px] text-white/45 mb-6">
        {tables.length} tables across visible modules
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {tables.map(({ table, module }) => (
          <button
            key={`${module.id}-${table}`}
            type="button"
            onClick={() => selectModule(module.id)}
            className="text-left rounded-2xl border border-border bg-card/60 p-4 hover:border-primary/40"
          >
            <div className="font-mono text-sm text-primary">{table}</div>
            <div className="text-[11px] text-white/45 mt-1">{module.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function RoadmapView() {
  const { mods, selectModule } = useVisibleModules();
  const stats = getProgressStats(useWorkflowStore.getState());
  let cumulative = 0;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold mb-2">Development Roadmap</h2>
      <p className="text-[13px] text-white/45 mb-6">
        Estimated {stats.totalHours}h · {stats.totalTables} tables ·{' '}
        {stats.totalRelationships} relationships
      </p>
      <div className="space-y-2">
        {mods.map((m) => {
          cumulative += m.estimatedHours;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => selectModule(m.id)}
              className="w-full rounded-xl border border-border bg-card/50 p-3 flex items-center gap-3 hover:border-primary/40"
            >
              <div
                className="h-2 w-2 rounded-full shrink-0"
                style={{ background: complexityColor(m.complexity) }}
              />
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm font-medium truncate">{m.name}</div>
                <div className="h-1.5 mt-1.5 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{
                      width: `${Math.min(100, (m.estimatedHours / 120) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div className="text-[11px] font-mono text-white/40 shrink-0">
                {m.estimatedHours}h · Σ{cumulative}h
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
