import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CaseService } from './case.service';
import { CaseStatus } from '../models/case-status.enum';
import { CasePriority } from '../models/case-priority.enum';
import { CreateCasePayload } from '../models/case.model';
import { MOCK_CASES } from '../mock/case.mock';

describe('CaseService', () => {
  let service: CaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaseService);
  });

  describe('getCases$', () => {
    it('should emit the initial mock cases', async () => {
      const cases = await firstValueFrom(service.getCases$());
      expect(cases.length).toBe(MOCK_CASES.length);
    });

    it('should emit Case objects with expected shape', async () => {
      const cases = await firstValueFrom(service.getCases$());
      expect(cases[0].id).toBeDefined();
      expect(cases[0].status).toBeDefined();
    });
  });

  describe('getCaseById$', () => {
    it('should return the correct case', async () => {
      const c = await firstValueFrom(service.getCaseById$('CASE-001'));
      expect(c?.id).toBe('CASE-001');
    });

    it('should return undefined for an unknown id', async () => {
      const c = await firstValueFrom(service.getCaseById$('CASE-999'));
      expect(c).toBeUndefined();
    });
  });

  describe('createCase', () => {
    const payload: CreateCasePayload = {
      title: 'New test case',
      description: 'Test description',
      status: CaseStatus.New,
      priority: CasePriority.Low,
      assigneeId: null,
      reporterId: 'USR-001',
      tags: [],
    };

    it('should add a new case to the list', async () => {
      const before = await firstValueFrom(service.getCases$());
      service.createCase(payload);
      const after = await firstValueFrom(service.getCases$());
      expect(after.length).toBe(before.length + 1);
    });

    it('should assign a CASE- prefixed id', async () => {
      service.createCase({ ...payload, title: 'ID test' });
      const cases = await firstValueFrom(service.getCases$());
      const created = cases.find((c) => c.title === 'ID test');
      expect(created?.id).toMatch(/^CASE-\d+$/);
    });

    it('should set createdAt to now', async () => {
      const before = Date.now();
      service.createCase({ ...payload, title: 'Timestamp test' });
      const cases = await firstValueFrom(service.getCases$());
      const created = cases.find((c) => c.title === 'Timestamp test');
      expect(created!.createdAt.getTime()).toBeGreaterThanOrEqual(before);
    });

    it('should initialise with empty timeline and comments', async () => {
      service.createCase({ ...payload, title: 'Empty collections' });
      const cases = await firstValueFrom(service.getCases$());
      const created = cases.find((c) => c.title === 'Empty collections');
      expect(created?.timeline).toEqual([]);
      expect(created?.comments).toEqual([]);
    });

    it('should append a created timeline event', async () => {
      service.createCase({ ...payload, title: 'Timeline event test' });
      const cases = await firstValueFrom(service.getCases$());
      const created = cases.find((c) => c.title === 'Timeline event test');
      expect(created?.timeline[0].type).toBe('created');
    });
  });

  describe('updateCase', () => {
    it('should update the title of an existing case', async () => {
      service.updateCase('CASE-002', { title: 'Updated title' });
      const c = await firstValueFrom(service.getCaseById$('CASE-002'));
      expect(c?.title).toBe('Updated title');
    });

    it('should update updatedAt', async () => {
      const before = Date.now();
      service.updateCase('CASE-002', { title: 'Updated again' });
      const c = await firstValueFrom(service.getCaseById$('CASE-002'));
      expect(c!.updatedAt.getTime()).toBeGreaterThanOrEqual(before);
    });

    it('should not affect other cases', async () => {
      service.updateCase('CASE-002', { title: 'Only this one' });
      const c = await firstValueFrom(service.getCaseById$('CASE-001'));
      expect(c?.title).toBe('Login page throws 500 on Safari');
    });
  });

  describe('transitionStatus', () => {
    it('should update status when transition is valid', async () => {
      service.transitionStatus('CASE-002', CaseStatus.InReview, 'USR-001');
      const c = await firstValueFrom(service.getCaseById$('CASE-002'));
      expect(c?.status).toBe(CaseStatus.InReview);
    });

    it('should append a status_changed timeline event', async () => {
      service.transitionStatus('CASE-002', CaseStatus.InReview, 'USR-001');
      const c = await firstValueFrom(service.getCaseById$('CASE-002'));
      const event = c?.timeline.find((e) => e.type === 'status_changed');
      expect(event?.metadata['from']).toBe(CaseStatus.New);
      expect(event?.metadata['to']).toBe(CaseStatus.InReview);
    });

    it('should set resolvedAt when transitioning to resolved', async () => {
      const before = Date.now();
      service.transitionStatus('CASE-001', CaseStatus.Resolved, 'USR-001');
      const c = await firstValueFrom(service.getCaseById$('CASE-001'));
      expect(c!.resolvedAt!.getTime()).toBeGreaterThanOrEqual(before);
    });

    it('should throw when transition is invalid', () => {
      expect(() =>
        service.transitionStatus('CASE-002', CaseStatus.Resolved, 'USR-001'),
      ).toThrowError(/Invalid transition/);
    });

    it('should not mutate state when transition is invalid', async () => {
      const before = await firstValueFrom(service.getCaseById$('CASE-002'));
      try {
        service.transitionStatus('CASE-002', CaseStatus.Resolved, 'USR-001');
      } catch {}
      const after = await firstValueFrom(service.getCaseById$('CASE-002'));
      expect(after?.status).toBe(before?.status);
    });
  });

  describe('addComment', () => {
    it('should add a comment to the correct case', async () => {
      service.addComment('CASE-001', {
        authorId: 'USR-001',
        body: 'Looking into this now.',
        isInternal: false,
      });
      const c = await firstValueFrom(service.getCaseById$('CASE-001'));
      expect(c?.comments.length).toBe(1);
      expect(c?.comments[0].body).toBe('Looking into this now.');
    });

    it('should append a comment_added timeline event', async () => {
      service.addComment('CASE-001', {
        authorId: 'USR-001',
        body: 'Timeline test.',
        isInternal: false,
      });
      const c = await firstValueFrom(service.getCaseById$('CASE-001'));
      expect(c?.timeline.some((e) => e.type === 'comment_added')).toBe(true);
    });

    it('should assign unique ids to comments', async () => {
      service.addComment('CASE-001', { authorId: 'USR-001', body: 'First.', isInternal: false });
      service.addComment('CASE-001', { authorId: 'USR-002', body: 'Second.', isInternal: false });
      const c = await firstValueFrom(service.getCaseById$('CASE-001'));
      const ids = c!.comments.map((cm) => cm.id);
      expect(new Set(ids).size).toBe(ids.length);
    });
  });

  describe('deleteCase', () => {
    it('should remove the case from the list', async () => {
      service.deleteCase('CASE-005');
      const cases = await firstValueFrom(service.getCases$());
      expect(cases.find((c) => c.id === 'CASE-005')).toBeUndefined();
    });

    it('should not affect other cases', async () => {
      service.deleteCase('CASE-005');
      const cases = await firstValueFrom(service.getCases$());
      expect(cases.find((c) => c.id === 'CASE-001')).toBeDefined();
    });
  });
});
