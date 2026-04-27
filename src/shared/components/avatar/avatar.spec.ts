import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { AvatarComponent } from './avatar';

describe('AvatarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AvatarComponent],
    });
  });

  it('should render initials', () => {
    const fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('initials', 'AP');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.avatar').textContent.trim()).toBe('AP');
  });

  it('should render a tooltip with the full name when provided', () => {
    const fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('initials', 'AP');
    fixture.componentRef.setInput('name', 'Aisha Patel');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.avatar');
    expect(el.getAttribute('title')).toBe('Aisha Patel');
  });

  it('should apply the sm size class by default', () => {
    const fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('initials', 'AP');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.avatar').classList.contains('avatar--sm')).toBe(
      true,
    );
  });

  it('should apply the lg size class when size is lg', () => {
    const fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('initials', 'MW');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.avatar').classList.contains('avatar--lg')).toBe(
      true,
    );
  });

  it('should have an aria-label for accessibility', () => {
    const fixture = TestBed.createComponent(AvatarComponent);
    fixture.componentRef.setInput('initials', 'SR');
    fixture.componentRef.setInput('name', 'Sofia Reyes');
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.avatar');
    expect(el.getAttribute('aria-label')).toBe('Sofia Reyes');
  });
});
