import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { CaseListComponent } from './case-list';
import { CaseService } from '../../services/case.service';
import { CaseFilterService } from '../../services/case-filter.service';
import { UserService } from '@features/user/services';
import { MOCK_CASES } from '../../mock/case.mock';
import { MOCK_USERS } from '../../../user/mock/user.mock';
import { CaseStatus } from '../../models/case-status.enum';

const mockCaseService = {
  getCases$: vi.fn(() => of(MOCK_CASES)),
};

const mockCaseFilterService = {
  filterAndSort: vi.fn().mockImplementation((cases) => cases ?? []),
};

const mockUserService = {
  getUsers$: vi.fn(() => of(MOCK_USERS)),
};

const mockRouter = {
  navigate: vi.fn().mockResolvedValue(true),
};

describe('CaseListComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockCaseFilterService.filterAndSort.mockImplementation((cases) => cases ?? []);

    await TestBed.configureTestingModule({
      imports: [CaseListComponent],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        { provide: CaseFilterService, useValue: mockCaseFilterService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter }, // ← mock router directly
      ],
    }).compileComponents();
  });

  it('should render a row for each case', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('cf-case-row');
    expect(rows.length).toBe(MOCK_CASES.length);
  });

  it('should render the filter bar', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-case-filter-bar')).not.toBeNull();
  });

  it('should show empty state when no cases match', () => {
    mockCaseFilterService.filterAndSort.mockReturnValue([]);
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-empty-state')).not.toBeNull();
  });

  it('should not show empty state when cases exist', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-empty-state')).toBeNull();
  });

  it('should call filterAndSort when filter changes', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();

    fixture.componentInstance.onFilterChange({ status: CaseStatus.Blocked });
    fixture.detectChanges();

    expect(mockCaseFilterService.filterAndSort).toHaveBeenCalledWith(
      MOCK_CASES,
      { status: CaseStatus.Blocked },
      expect.any(String),
      expect.any(String),
    );
  });

  it('should call filterAndSort when sort changes', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();

    fixture.componentInstance.onSortChange('priority', 'desc');
    fixture.detectChanges();

    expect(mockCaseFilterService.filterAndSort).toHaveBeenCalledWith(
      MOCK_CASES,
      expect.any(Object),
      'priority',
      'desc',
    );
  });

  it('should navigate to case detail when a row is selected', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();

    fixture.componentInstance.onCaseSelected('CASE-001');

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/cases', 'CASE-001']);
  });

  it('should emit caseSelected when a row emits selected', () => {
    const fixture = TestBed.createComponent(CaseListComponent);
    fixture.detectChanges();

    let emittedId: string | undefined;
    fixture.componentInstance.caseSelected.subscribe((id: string) => (emittedId = id));
    fixture.componentInstance.onCaseSelected('CASE-001');

    expect(emittedId).toBe('CASE-001');
  });
});
