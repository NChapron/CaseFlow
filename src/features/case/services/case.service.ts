// features/case/services/case.service.ts
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Case, CreateCasePayload, UpdateCasePayload } from '../models/case.model';
import { CaseStatus } from '../models/case-status.enum';
import { TimelineEvent } from '../models/timeline-event.model';
import { Comment } from '../models/comment.model';
import { CaseWorkflowService } from './case-workflow.service';
import { MOCK_CASES } from '../mock/case.mock';

@Injectable({ providedIn: 'root' })
export class CaseService {
  private readonly _workflow = inject(CaseWorkflowService);
  private readonly state$ = new BehaviorSubject<Case[]>(
    structuredClone(MOCK_CASES), // defensive copy so tests don't share state
  );

  getCases$(): Observable<Case[]> {
    return this.state$.asObservable();
  }

  getCaseById$(id: string): Observable<Case | undefined> {
    return this.state$.pipe(map((cases) => cases.find((c) => c.id === id)));
  }

  createCase(payload: CreateCasePayload): void {
    const cases = this.state$.value;
    const nextId = this.generateId(cases);
    const now = new Date();

    const newCase: Case = {
      ...payload,
      id: nextId,
      createdAt: now,
      updatedAt: now,
      resolvedAt: null,
      timeline: [
        {
          id: this.generateEventId(),
          type: 'created',
          actorId: payload.reporterId,
          timestamp: now,
          metadata: {},
        },
      ],
      comments: [],
    };

    this.state$.next([...cases, newCase]);
  }

  updateCase(id: string, payload: UpdateCasePayload): void {
    this.state$.next(
      this.state$.value.map((c) => (c.id === id ? { ...c, ...payload, updatedAt: new Date() } : c)),
    );
  }

  transitionStatus(id: string, to: CaseStatus, actorId: string): void {
    const current = this.state$.value.find((c) => c.id === id);
    if (!current) return;

    if (!this._workflow.canTransition(current.status, to)) {
      throw new Error(`Invalid transition: ${current.status} → ${to}`);
    }

    const now = new Date();
    const event: TimelineEvent = {
      id: this.generateEventId(),
      type: 'status_changed',
      actorId,
      timestamp: now,
      metadata: { from: current.status, to },
    };

    this.state$.next(
      this.state$.value.map((c) =>
        c.id === id
          ? {
              ...c,
              status: to,
              updatedAt: now,
              resolvedAt: to === CaseStatus.Resolved ? now : c.resolvedAt,
              timeline: [...c.timeline, event],
            }
          : c,
      ),
    );
  }

  addComment(caseId: string, payload: Pick<Comment, 'authorId' | 'body' | 'isInternal'>): void {
    const now = new Date();
    const comment: Comment = {
      id: this.generateCommentId(),
      caseId,
      ...payload,
      createdAt: now,
    };

    const event: TimelineEvent = {
      id: this.generateEventId(),
      type: 'comment_added',
      actorId: payload.authorId,
      timestamp: now,
      metadata: { commentId: comment.id },
    };

    this.state$.next(
      this.state$.value.map((c) =>
        c.id === caseId
          ? {
              ...c,
              updatedAt: now,
              comments: [...c.comments, comment],
              timeline: [...c.timeline, event],
            }
          : c,
      ),
    );
  }

  deleteCase(id: string): void {
    this.state$.next(this.state$.value.filter((c) => c.id !== id));
  }

  private generateId(cases: Case[]): string {
    const max = cases.reduce((acc, c) => {
      const num = parseInt(c.id.replace('CASE-', ''), 10);
      return isNaN(num) ? acc : Math.max(acc, num);
    }, 0);
    return `CASE-${String(max + 1).padStart(3, '0')}`;
  }

  private generateEventId(): string {
    return `EVT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }

  private generateCommentId(): string {
    return `CMT-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  }
}
