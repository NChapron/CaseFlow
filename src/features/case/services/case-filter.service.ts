// features/case/services/case-filter.service.ts
import { Injectable } from '@angular/core';
import { Case } from '../models/case.model';
import { CaseFilter, SortDirection, SortField } from '../models/case-filter.model';
import { CasePriority } from '../models/case-priority.enum';

const PRIORITY_WEIGHT: Record<CasePriority, number> = {
  [CasePriority.Low]: 1,
  [CasePriority.Medium]: 2,
  [CasePriority.High]: 3,
  [CasePriority.Critical]: 4,
};

@Injectable({ providedIn: 'root' })
export class CaseFilterService {
  filter(cases: Case[], f: CaseFilter): Case[] {
    return cases.filter((c) => {
      if (f.status && c.status !== f.status) return false;
      if (f.priority && c.priority !== f.priority) return false;
      if (f.assigneeId && c.assigneeId !== f.assigneeId) return false;
      if (f.search) {
        const term = f.search.toLowerCase();
        if (!c.title.toLowerCase().includes(term) && !c.description.toLowerCase().includes(term))
          return false;
      }
      return true;
    });
  }

  sort(cases: Case[], field: SortField, direction: SortDirection): Case[] {
    return [...cases].sort((a, b) => {
      const delta =
        field === 'priority'
          ? PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]
          : a[field].getTime() - b[field].getTime();
      return direction === 'desc' ? -delta : delta;
    });
  }

  filterAndSort(
    cases: Case[],
    f: CaseFilter,
    sortField: SortField,
    sortDirection: SortDirection,
  ): Case[] {
    return this.sort(this.filter(cases, f), sortField, sortDirection);
  }
}
