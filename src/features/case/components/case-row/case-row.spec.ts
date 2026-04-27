import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CaseRowComponent } from './case-row';
import { MOCK_CASES } from '../../mock/case.mock';

describe('CaseRowComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseRowComponent],
    });
  });

  it('should render the case id', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[0]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.case-row__id').textContent.trim()).toBe(
      MOCK_CASES[0].id,
    );
  });

  it('should render the case title', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[0]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.case-row__title').textContent.trim()).toBe(
      MOCK_CASES[0].title,
    );
  });

  it('should render a status badge', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[0]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-status-badge')).not.toBeNull();
  });

  it('should render a priority badge', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[0]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-priority-badge')).not.toBeNull();
  });

  it('should emit selected when the row is clicked', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[0]);
    fixture.detectChanges();

    let emittedId: string | undefined;
    fixture.componentInstance.selected.subscribe((id: string) => (emittedId = id));

    fixture.nativeElement.querySelector('.case-row').click();
    expect(emittedId).toBe(MOCK_CASES[0].id);
  });

  it('should emit selected on Enter keydown for keyboard accessibility', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[0]);
    fixture.detectChanges();

    let emittedId: string | undefined;
    fixture.componentInstance.selected.subscribe((id: string) => (emittedId = id));

    const row = fixture.nativeElement.querySelector('.case-row');
    row.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(emittedId).toBe(MOCK_CASES[0].id);
  });

  it('should show an avatar when assigneeInitials is provided', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[0]);
    fixture.componentRef.setInput('assigneeInitials', 'AP');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-avatar')).not.toBeNull();
  });

  it('should not show an avatar when assigneeInitials is not provided', () => {
    const fixture = TestBed.createComponent(CaseRowComponent);
    fixture.componentRef.setInput('case', MOCK_CASES[1]); // assigneeId is null
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('cf-avatar')).toBeNull();
  });
});
