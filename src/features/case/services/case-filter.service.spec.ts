import { describe, it, expect, beforeEach } from 'vitest';
import { CaseFilterService } from './case-filter.service';
import { CaseStatus } from '../models/case-status.enum';
import { CasePriority } from '../models/case-priority.enum';
import { MOCK_CASES } from '../mock/case.mock';

describe('CaseFilterService', () => {
  let service: CaseFilterService;

  beforeEach(() => {
    service = new CaseFilterService();
  });

  describe('filter', () => {
    it('should return all cases when filter is empty', () => {
      expect(service.filter(MOCK_CASES, {}).length).toBe(MOCK_CASES.length);
    });

    it('should filter by status', () => {
      const result = service.filter(MOCK_CASES, { status: CaseStatus.Blocked });
      expect(result.length).toBeGreaterThan(0);
      expect(result.every((c) => c.status === CaseStatus.Blocked)).toBe(true);
    });

    it('should filter by priority', () => {
      const result = service.filter(MOCK_CASES, { priority: CasePriority.Critical });
      expect(result.every((c) => c.priority === CasePriority.Critical)).toBe(true);
    });

    it('should filter by search term against title', () => {
      const target = MOCK_CASES[0];
      const firstWord = target.title.split(' ')[0];
      const result = service.filter(MOCK_CASES, { search: firstWord });
      expect(result.some((c) => c.id === target.id)).toBe(true);
    });

    it('should filter by search term against description', () => {
      const target = MOCK_CASES[0];
      const firstWord = target.description.split(' ')[0];
      const result = service.filter(MOCK_CASES, { search: firstWord });
      expect(result.some((c) => c.id === target.id)).toBe(true);
    });

    it('should be case-insensitive when searching', () => {
      const target = MOCK_CASES[0];
      const upper = target.title.split(' ')[0].toUpperCase();
      const result = service.filter(MOCK_CASES, { search: upper });
      expect(result.some((c) => c.id === target.id)).toBe(true);
    });

    it('should return empty array when no cases match search', () => {
      expect(service.filter(MOCK_CASES, { search: 'zzznomatch999' })).toEqual([]);
    });

    it('should filter by assigneeId', () => {
      const assigneeId = MOCK_CASES.find((c) => c.assigneeId)?.assigneeId!;
      const result = service.filter(MOCK_CASES, { assigneeId });
      expect(result.every((c) => c.assigneeId === assigneeId)).toBe(true);
    });

    it('should apply multiple filters together', () => {
      const result = service.filter(MOCK_CASES, {
        status: CaseStatus.InProgress,
        priority: CasePriority.High,
      });
      expect(
        result.every((c) => c.status === CaseStatus.InProgress && c.priority === CasePriority.High),
      ).toBe(true);
    });
  });

  describe('sort', () => {
    it('should sort by createdAt descending', () => {
      const result = service.sort(MOCK_CASES, 'createdAt', 'desc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
          result[i].createdAt.getTime(),
        );
      }
    });

    it('should sort by createdAt ascending', () => {
      const result = service.sort(MOCK_CASES, 'createdAt', 'asc');
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].createdAt.getTime()).toBeLessThanOrEqual(
          result[i].createdAt.getTime(),
        );
      }
    });

    it('should sort by priority descending (critical first)', () => {
      const order = [
        CasePriority.Critical,
        CasePriority.High,
        CasePriority.Medium,
        CasePriority.Low,
      ];
      const result = service.sort(MOCK_CASES, 'priority', 'desc');
      const indices = result.map((c) => order.indexOf(c.priority));
      for (let i = 1; i < indices.length; i++) {
        expect(indices[i - 1]).toBeLessThanOrEqual(indices[i]);
      }
    });

    it('should not mutate the original array', () => {
      const original = [...MOCK_CASES];
      service.sort(MOCK_CASES, 'createdAt', 'desc');
      expect(MOCK_CASES).toEqual(original);
    });
  });

  describe('filterAndSort', () => {
    it('should apply filter then sort in one call', () => {
      const result = service.filterAndSort(
        MOCK_CASES,
        { status: CaseStatus.InProgress },
        'createdAt',
        'desc',
      );
      expect(result.every((c) => c.status === CaseStatus.InProgress)).toBe(true);
      for (let i = 1; i < result.length; i++) {
        expect(result[i - 1].createdAt.getTime()).toBeGreaterThanOrEqual(
          result[i].createdAt.getTime(),
        );
      }
    });
  });
});
