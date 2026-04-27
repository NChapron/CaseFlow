import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PriorityBadgeComponent } from './priority-badge';
import { CasePriority } from '../../../features/case/models/case-priority.enum';

describe('PriorityBadgeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PriorityBadgeComponent],
    });
  });

  const cases: { priority: CasePriority; expectedLabel: string; expectedClass: string }[] = [
    { priority: CasePriority.Low, expectedLabel: 'Low', expectedClass: 'badge--low' },
    { priority: CasePriority.Medium, expectedLabel: 'Medium', expectedClass: 'badge--medium' },
    { priority: CasePriority.High, expectedLabel: 'High', expectedClass: 'badge--high' },
    {
      priority: CasePriority.Critical,
      expectedLabel: 'Critical',
      expectedClass: 'badge--critical',
    },
  ];

  cases.forEach(({ priority, expectedLabel, expectedClass }) => {
    it(`should render correct label for ${priority}`, () => {
      const fixture = TestBed.createComponent(PriorityBadgeComponent);
      fixture.componentRef.setInput('priority', priority);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.badge');
      expect(el.textContent.trim()).toBe(expectedLabel);
    });

    it(`should apply correct class for ${priority}`, () => {
      const fixture = TestBed.createComponent(PriorityBadgeComponent);
      fixture.componentRef.setInput('priority', priority);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.badge');
      expect(el.classList.contains(expectedClass)).toBe(true);
    });
  });

  it('should render an indicator dot', () => {
    const fixture = TestBed.createComponent(PriorityBadgeComponent);
    fixture.componentRef.setInput('priority', CasePriority.High);
    fixture.detectChanges();
    const dot = fixture.nativeElement.querySelector('.badge__dot');
    expect(dot).not.toBeNull();
  });
});
