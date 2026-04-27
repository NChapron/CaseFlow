import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { StatusBadgeComponent } from './status-badge';
import { CaseStatus } from '../../../features/case/models/case-status.enum';

describe('StatusBadgeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    });
  });

  const cases: { status: CaseStatus; expectedLabel: string; expectedClass: string }[] = [
    { status: CaseStatus.New, expectedLabel: 'New', expectedClass: 'badge--new' },
    { status: CaseStatus.InReview, expectedLabel: 'In Review', expectedClass: 'badge--in-review' },
    {
      status: CaseStatus.InProgress,
      expectedLabel: 'In Progress',
      expectedClass: 'badge--in-progress',
    },
    { status: CaseStatus.Blocked, expectedLabel: 'Blocked', expectedClass: 'badge--blocked' },
    { status: CaseStatus.Resolved, expectedLabel: 'Resolved', expectedClass: 'badge--resolved' },
    { status: CaseStatus.Closed, expectedLabel: 'Closed', expectedClass: 'badge--closed' },
  ];

  cases.forEach(({ status, expectedLabel, expectedClass }) => {
    it(`should render correct label for ${status}`, () => {
      const fixture = TestBed.createComponent(StatusBadgeComponent);
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.badge');
      expect(el.textContent.trim()).toBe(expectedLabel);
    });

    it(`should apply correct class for ${status}`, () => {
      const fixture = TestBed.createComponent(StatusBadgeComponent);
      fixture.componentRef.setInput('status', status);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.badge');
      expect(el.classList.contains(expectedClass)).toBe(true);
    });
  });
});
