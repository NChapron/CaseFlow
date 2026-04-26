import { describe, it, expect, beforeEach } from 'vitest';
import { CaseWorkflowService } from './case-workflow.service';
import { CaseStatus } from '../models/case-status.enum';

describe('CaseWorkflowService', () => {
  let service: CaseWorkflowService;

  beforeEach(() => {
    service = new CaseWorkflowService();
  });

  describe('canTransition', () => {
    it('should allow new → in_review', () => {
      expect(service.canTransition(CaseStatus.New, CaseStatus.InReview)).toBe(true);
    });

    it('should allow in_review → in_progress', () => {
      expect(service.canTransition(CaseStatus.InReview, CaseStatus.InProgress)).toBe(true);
    });

    it('should allow in_progress → blocked', () => {
      expect(service.canTransition(CaseStatus.InProgress, CaseStatus.Blocked)).toBe(true);
    });

    it('should allow in_progress → resolved', () => {
      expect(service.canTransition(CaseStatus.InProgress, CaseStatus.Resolved)).toBe(true);
    });

    it('should allow blocked → in_progress', () => {
      expect(service.canTransition(CaseStatus.Blocked, CaseStatus.InProgress)).toBe(true);
    });

    it('should allow resolved → closed', () => {
      expect(service.canTransition(CaseStatus.Resolved, CaseStatus.Closed)).toBe(true);
    });

    it('should block new → resolved', () => {
      expect(service.canTransition(CaseStatus.New, CaseStatus.Resolved)).toBe(false);
    });

    it('should block new → closed', () => {
      expect(service.canTransition(CaseStatus.New, CaseStatus.Closed)).toBe(false);
    });

    it('should block in_review → blocked', () => {
      expect(service.canTransition(CaseStatus.InReview, CaseStatus.Blocked)).toBe(false);
    });

    it('should block resolved → in_progress', () => {
      expect(service.canTransition(CaseStatus.Resolved, CaseStatus.InProgress)).toBe(false);
    });

    it('should block all transitions from closed', () => {
      Object.values(CaseStatus).forEach((target) => {
        expect(service.canTransition(CaseStatus.Closed, target)).toBe(false);
      });
    });

    it('should return false for a self-transition', () => {
      expect(service.canTransition(CaseStatus.InProgress, CaseStatus.InProgress)).toBe(false);
    });
  });

  describe('getValidTransitions', () => {
    it('should return [in_review] for new', () => {
      expect(service.getValidTransitions(CaseStatus.New)).toEqual([CaseStatus.InReview]);
    });

    it('should return [blocked, resolved] for in_progress', () => {
      expect(service.getValidTransitions(CaseStatus.InProgress)).toEqual([
        CaseStatus.Blocked,
        CaseStatus.Resolved,
      ]);
    });

    it('should return an empty array for closed', () => {
      expect(service.getValidTransitions(CaseStatus.Closed)).toEqual([]);
    });
  });

  describe('isTerminal', () => {
    it('should return true for closed', () => {
      expect(service.isTerminal(CaseStatus.Closed)).toBe(true);
    });

    it('should return false for all non-terminal statuses', () => {
      [
        CaseStatus.New,
        CaseStatus.InReview,
        CaseStatus.InProgress,
        CaseStatus.Blocked,
        CaseStatus.Resolved,
      ].forEach((s) => expect(service.isTerminal(s)).toBe(false));
    });
  });
});
