import { CaseStatus } from './case-status.enum';
import { CasePriority } from './case-priority.enum';

export interface CaseFilter {
  search?: string;
  status?: CaseStatus;
  priority?: CasePriority;
  assigneeId?: string;
}

export type SortField = 'createdAt' | 'updatedAt' | 'priority';
export type SortDirection = 'asc' | 'desc';
