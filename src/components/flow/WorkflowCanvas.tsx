import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  MiniMap,
  useEdgesState,
  useNodesState,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  MarkerType,
  Position,
  type Node,
  type Edge,
} from '@xyflow/react';
import { WORKFLOW_MODULES, WORKFLOW_ORDER } from '../../data/modules';
import { PROCESS_BY_TO_STAGE } from '../../data/processes';
import {
  getNodeStatus,
  useWorkflowStore,
} from '../../store/workflowStore';
import { WorkflowNode, type WorkflowNodeData } from './WorkflowNode';
import { AnimatedEdge } from './AnimatedEdge';
import { useIsMobile } from '../../hooks/useMediaQuery';

const nodeTypes = { workflow: WorkflowNode };
const edgeTypes = { animated: AnimatedEdge };

/** Horizontal spacing between nodes (RTL: decreasing X) */
const NODE_GAP_DESKTOP = 340;
const NODE_GAP_MOBILE = 250;
const START_X = 0;

function buildGraph(
  visibleCount: number,
  currentIndex: number,
  onOpen: (id: string) => void,
  onOpenProcess: (processId: string) => void,
  isMobile: boolean
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const gap = isMobile ? NODE_GAP_MOBILE : NODE_GAP_DESKTOP;

  for (let i = 0; i < visibleCount; i++) {
    const mod = WORKFLOW_MODULES[i];
    const status = getNodeStatus(i, currentIndex, visibleCount);

    nodes.push({
      id: mod.id,
      type: 'workflow',
      position: { x: START_X - i * gap, y: 0 },
      sourcePosition: Position.Left,
      targetPosition: Position.Right,
      data: {
        module: mod,
        status,
        stepNumber: i + 1,
        onOpen,
        compact: isMobile,
      } satisfies WorkflowNodeData,
      draggable: false,
      selectable: true,
    });

    if (i > 0) {
      const prev = WORKFLOW_MODULES[i - 1];
      const isNew = i === visibleCount - 1;
      const completed = i - 1 < currentIndex;
      const process = PROCESS_BY_TO_STAGE[mod.id];
      edges.push({
        id: `${prev.id}->${mod.id}`,
        source: prev.id,
        target: mod.id,
        type: 'animated',
        data: {
          label: process?.name ?? mod.edgeFromPrevious,
          processId: process?.id,
          isNew,
          completed,
          onOpenProcess,
        },
        animated: !completed,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: completed ? '#2E7D32' : '#D32F2F',
          width: 18,
          height: 18,
        },
      });
    }
  }

  return { nodes, edges };
}

function FlowInner() {
  const visibleCount = useWorkflowStore((s) => s.visibleCount);
  const currentIndex = useWorkflowStore((s) => s.currentIndex);
  const selectModule = useWorkflowStore((s) => s.selectModule);
  const openProcess = useWorkflowStore((s) => s.openProcess);
  const searchQuery = useWorkflowStore((s) => s.searchQuery);
  const reduceMotion = useWorkflowStore((s) => s.reduceMotion);
  const isMobile = useIsMobile();

  const { fitView, setCenter, getNode, zoomIn, zoomOut } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const lastFocused = useRef<string | null>(null);

  const onOpen = useCallback(
    (id: string) => {
      selectModule(id);
    },
    [selectModule]
  );

  const onOpenProcess = useCallback(
    (processId: string) => {
      openProcess(processId);
    },
    [openProcess]
  );

  useEffect(() => {
    const g = buildGraph(
      visibleCount,
      currentIndex,
      onOpen,
      onOpenProcess,
      isMobile
    );
    setNodes(g.nodes);
    setEdges(g.edges);
  }, [
    visibleCount,
    currentIndex,
    onOpen,
    onOpenProcess,
    isMobile,
    setNodes,
    setEdges,
  ]);

  useEffect(() => {
    const id = WORKFLOW_ORDER[currentIndex];
    if (!id || lastFocused.current === `${id}-${visibleCount}-${isMobile}`)
      return;
    lastFocused.current = `${id}-${visibleCount}-${isMobile}`;

    const t = window.setTimeout(() => {
      const n = getNode(id);
      if (!n) return;
      const offsetX = isMobile ? 80 : 110;
      const offsetY = isMobile ? 48 : 55;
      setCenter(n.position.x + offsetX, n.position.y + offsetY, {
        zoom: isMobile ? 0.92 : 1,
        duration: reduceMotion ? 0 : 650,
      });
    }, reduceMotion ? 0 : 100);

    return () => window.clearTimeout(t);
  }, [
    currentIndex,
    visibleCount,
    getNode,
    setCenter,
    reduceMotion,
    isMobile,
  ]);

  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) return;

    const match = WORKFLOW_MODULES.find(
      (m) =>
        m.name.includes(q) ||
        m.description.includes(q) ||
        m.tables.some((t) => t.includes(q.toLowerCase()))
    );
    if (!match) return;

    const idx = WORKFLOW_ORDER.indexOf(match.id);
    const store = useWorkflowStore.getState();
    if (idx >= store.visibleCount) {
      store.goToStep(idx);
    } else if (store.selectedId !== match.id) {
      store.selectModule(match.id);
      useWorkflowStore.setState({ currentIndex: idx, panelOpen: false });
    }
  }, [searchQuery]);

  const minimapNodeColor = useCallback((node: Node) => {
    const status = (node.data as WorkflowNodeData)?.status;
    if (status === 'current') return '#D32F2F';
    if (status === 'completed') return '#2E7D32';
    return '#3D3D3D';
  }, []);

  useEffect(() => {
    const pad = isMobile ? 0.45 : 0.35;
    const onZoomIn = () => zoomIn({ duration: 200 });
    const onZoomOut = () => zoomOut({ duration: 200 });
    const onFit = () => fitView({ padding: pad, duration: 400 });
    window.addEventListener('wf-zoom-in', onZoomIn);
    window.addEventListener('wf-zoom-out', onZoomOut);
    window.addEventListener('wf-fit', onFit);
    return () => {
      window.removeEventListener('wf-zoom-in', onZoomIn);
      window.removeEventListener('wf-zoom-out', onZoomOut);
      window.removeEventListener('wf-fit', onFit);
    };
  }, [zoomIn, zoomOut, fitView, isMobile]);

  const proOptions = useMemo(() => ({ hideAttribution: true }), []);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
      fitViewOptions={{ padding: isMobile ? 0.5 : 0.4 }}
      minZoom={isMobile ? 0.25 : 0.3}
      maxZoom={1.8}
      nodesDraggable={false}
      proOptions={proOptions}
      panOnScroll
      panOnDrag
      zoomOnScroll
      zoomOnPinch
      selectionOnDrag={false}
      defaultEdgeOptions={{ type: 'animated' }}
      className="bg-transparent touch-pan-x touch-pan-y"
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={isMobile ? 18 : 22}
        size={1.15}
        color="#2A2A2A"
      />
      <MiniMap
        nodeColor={minimapNodeColor}
        maskColor="rgba(15,15,15,0.75)"
        pannable
        zoomable
        position="bottom-left"
        className="!mb-24 sm:!mb-4"
        style={{
          width: isMobile ? 110 : 168,
          height: isMobile ? 72 : 112,
          direction: 'ltr',
        }}
      />
    </ReactFlow>
  );
}

export function WorkflowCanvas() {
  return (
    <ReactFlowProvider>
      <div className="h-full w-full" id="workflow-canvas">
        <FlowInner />
      </div>
    </ReactFlowProvider>
  );
}
