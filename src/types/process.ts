export interface ProcessDetail {
  id: string;
  /** Target stage id this process leads into */
  toStageId: string;
  fromStageId: string;
  name: string;
  description: string;
  startedBy: string[];
  purpose: string;
  requiredData: string[];
  steps: string[];
  affectedTables: string[];
  dataBefore: string[];
  dataAfter: string[];
  permissions: string[];
  outcomes: string[];
  nextStageId: string;
  notes?: string;
}
