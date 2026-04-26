// features/case/services/case-workflow.service.ts
import { Injectable } from '@angular/core';
import { CaseStatus } from '../models/case-status.enum';

const TRANSITIONS: Record<CaseStatus, CaseStatus[]> = {
  [CaseStatus.New]: [CaseStatus.InReview],
  [CaseStatus.InReview]: [CaseStatus.InProgress],
  [CaseStatus.InProgress]: [CaseStatus.Blocked, CaseStatus.Resolved],
  [CaseStatus.Blocked]: [CaseStatus.InProgress],
  [CaseStatus.Resolved]: [CaseStatus.Closed],
  [CaseStatus.Closed]: [],
};

const TERMINAL_STATUSES = new Set<CaseStatus>([CaseStatus.Closed]);

@Injectable({ providedIn: 'root' })
export class CaseWorkflowService {
  canTransition(from: CaseStatus, to: CaseStatus): boolean {
    return TRANSITIONS[from].includes(to);
  }

  getValidTransitions(from: CaseStatus): CaseStatus[] {
    return [...TRANSITIONS[from]];
  }

  isTerminal(status: CaseStatus): boolean {
    return TERMINAL_STATUSES.has(status);
  }
}
