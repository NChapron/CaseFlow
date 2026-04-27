import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { EmptyStateComponent } from './empty-state';

describe('EmptyStateComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EmptyStateComponent],
    });
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'No cases found');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state__title').textContent.trim()).toBe(
      'No cases found',
    );
  });

  it('should render the message when provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'No cases found');
    fixture.componentRef.setInput('message', 'Try adjusting your filters.');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state__message').textContent.trim()).toBe(
      'Try adjusting your filters.',
    );
  });

  it('should not render the message element when message is not provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'No cases found');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state__message')).toBeNull();
  });

  it('should emit actionClick when the action button is clicked', async () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'No cases found');
    fixture.componentRef.setInput('actionLabel', 'Create case');
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.actionClick.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('.empty-state__action').click();
    expect(emitted).toBe(true);
  });

  it('should not render the action button when actionLabel is not provided', () => {
    const fixture = TestBed.createComponent(EmptyStateComponent);
    fixture.componentRef.setInput('title', 'Nothing here');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.empty-state__action')).toBeNull();
  });
});
