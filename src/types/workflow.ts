export type NodeStatus =
  | 'hidden'
  | 'locked'
  | 'available'
  | 'current'
  | 'completed'
  | 'warning'
  | 'maintenance'
  | 'deprecated'
  | 'future';

export type ModuleCategory =
  | 'core'
  | 'finance'
  | 'rooms'
  | 'guests'
  | 'maintenance'
  | 'restaurant'
  | 'hr'
  | 'reports'
  | 'administration'
  | 'services';

export type RelationType =
  | 'uses'
  | 'creates'
  | 'reads'
  | 'updates'
  | 'deletes'
  | 'depends_on'
  | 'one_to_many'
  | 'many_to_many'
  | 'one_to_one';

export type ViewMode =
  | 'workflow'
  | 'timeline'
  | 'tree'
  | 'mindmap'
  | 'flowchart'
  | 'architecture'
  | 'dependency'
  | 'database'
  | 'roadmap';

export type Complexity = 'low' | 'medium' | 'high' | 'critical';

export interface ModuleRelation {
  targetId: string;
  type: RelationType;
  label?: string;
}

export interface WorkflowModule {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: ModuleCategory;
  color: string;
  dependencies: string[];
  relatedModules: string[];
  tables: string[];
  mainUsers: string[];
  permissions: string[];
  businessRules: string[];
  estimatedHours: number;
  complexity: Complexity;
  completionPercentage: number;
  purpose: string;
  features: string[];
  businessFlow: string[];
  inputData: string[];
  outputData: string[];
  relationships: ModuleRelation[];
  apiEndpoints: string[];
  roles: string[];
  screens: string[];
  validationRules: string[];
  notifications: string[];
  reports: string[];
  auditLogs: string[];
  attachments: string[];
  futureImprovements: string[];
  developmentNotes: string;
  /** Optional Arabic extras used by the roadmap UI */
  emoji?: string;
  edgeFromPrevious?: string;
  dataBefore?: string[];
  dataAfter?: string[];
  operations?: string[];
}

export interface ProgressStats {
  currentStep: number;
  totalSteps: number;
  completedCount: number;
  completedPercent: number;
  remainingSteps: number;
  elapsedSeconds: number;
  status: 'idle' | 'playing' | 'paused' | 'completed';
  totalHours: number;
  totalTables: number;
  totalRelationships: number;
}
