import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CaseService } from '../../services/case.service';
import { UserService } from '@features/user/services';
import { MOCK_CASES } from '../../mock/case.mock';
import { MOCK_USERS } from '@features/user/mock/user.mock';
import { CaseDetailHeaderComponent } from '@features/case/components/case-detail-header/case-detail-header';
import { User } from '@features/user/models/user.model';

const mockCaseService = {
  getCaseById$: vi.fn(() => of(MOCK_CASES[0])),
};

const mockUserService = {
  getUserById$: vi.fn(() => of(MOCK_USERS[0])),
};

describe('CaseDetailHeaderComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [CaseDetailHeaderComponent],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();
  });

  it('should render the case title', () => {
    const fixture = TestBed.createComponent(CaseDetailHeaderComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.detail-header__title').textContent.trim()).toBe(
      MOCK_CASES[0].title,
    );
  });

  it('should render a status badge', () => {
    const fixture = TestBed.createComponent(CaseDetailHeaderComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-status-badge')).not.toBeNull();
  });

  it('should render a priority badge', () => {
    const fixture = TestBed.createComponent(CaseDetailHeaderComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-priority-badge')).not.toBeNull();
  });

  it('should render the case id', () => {
    const fixture = TestBed.createComponent(CaseDetailHeaderComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.detail-header__id').textContent.trim()).toBe(
      'CASE-001',
    );
  });

  it('should render tags', () => {
    const fixture = TestBed.createComponent(CaseDetailHeaderComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const tags = fixture.nativeElement.querySelectorAll('.detail-header__tag');
    expect(tags.length).toBe(MOCK_CASES[0].tags.length);
  });

  it('should render the assignee avatar when assignee exists', () => {
    const fixture = TestBed.createComponent(CaseDetailHeaderComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-avatar')).not.toBeNull();
  });

  it('should render unassigned label when there is no assignee', () => {
    mockCaseService.getCaseById$.mockReturnValue(of({ ...MOCK_CASES[1], assigneeId: null }));
    mockUserService.getUserById$.mockReturnValue(of(undefined as unknown as User));

    const fixture = TestBed.createComponent(CaseDetailHeaderComponent);
    fixture.componentRef.setInput('caseId', 'CASE-002');
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('.detail-header__unassigned').textContent.trim(),
    ).toBe('Unassigned');
  });
});
