// features/case/components/case-timeline/case-timeline.component.spec.ts
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CaseTimelineComponent } from './case-timeline';
import { CaseService } from '../../services/case.service';
import { UserService } from '@features/user/services';
import { MOCK_CASES } from '../../mock/case.mock';
import { MOCK_USERS } from '../../../user/mock/user.mock';

const mockCaseService = {
  getCaseById$: vi.fn(() => of(MOCK_CASES[0])),
};

const mockUserService = {
  getUsers$: vi.fn(() => of(MOCK_USERS)),
};

describe('CaseTimelineComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [CaseTimelineComponent],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compileComponents();
  });

  it('should render a timeline event for each event in the case', () => {
    const fixture = TestBed.createComponent(CaseTimelineComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const events = fixture.nativeElement.querySelectorAll('.timeline__event');
    expect(events.length).toBe(MOCK_CASES[0].timeline.length);
  });

  it('should render the empty state when there are no timeline events', () => {
    mockCaseService.getCaseById$.mockReturnValue(of({ ...MOCK_CASES[0], timeline: [] }));
    const fixture = TestBed.createComponent(CaseTimelineComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.timeline__empty')).not.toBeNull();
  });

  it('should render events in reverse chronological order', () => {
    const fixture = TestBed.createComponent(CaseTimelineComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const timestamps = Array.from(fixture.nativeElement.querySelectorAll('.timeline__event')).map(
      (el: any) => el.getAttribute('data-timestamp'),
    );
    const sorted = [...timestamps].sort((a, b) => Number(b) - Number(a));
    expect(timestamps).toEqual(sorted);
  });

  it('should render a human-readable label for status_changed events', () => {
    mockCaseService.getCaseById$.mockReturnValue(
      of({
        ...MOCK_CASES[0],
        timeline: [
          {
            id: 'EVT-001',
            type: 'status_changed',
            actorId: 'USR-001',
            timestamp: new Date(),
            metadata: { from: 'new', to: 'in_review' },
          },
        ],
      }),
    );
    const fixture = TestBed.createComponent(CaseTimelineComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.timeline__event-label');
    expect(label.textContent).toContain('new');
    expect(label.textContent).toContain('in_review');
  });
});
