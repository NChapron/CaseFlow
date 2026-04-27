import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { PageHeaderComponent } from './page-header';

describe('PageHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PageHeaderComponent],
    });
  });

  it('should render the title', () => {
    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.componentRef.setInput('title', 'All Cases');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.page-header__title').textContent.trim()).toBe(
      'All Cases',
    );
  });

  it('should render the subtitle when provided', () => {
    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.componentRef.setInput('title', 'All Cases');
    fixture.componentRef.setInput('subtitle', '24 open cases');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.page-header__subtitle').textContent.trim()).toBe(
      '24 open cases',
    );
  });

  it('should not render the subtitle element when not provided', () => {
    const fixture = TestBed.createComponent(PageHeaderComponent);
    fixture.componentRef.setInput('title', 'All Cases');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.page-header__subtitle')).toBeNull();
  });
});
