import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavbarComponent } from './navbar';

describe('NavbarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the brand name', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.navbar__name').textContent.trim()).toBe(
      'CaseFlow',
    );
  });

  it('should have a skip to main content link', () => {
    const fixture = TestBed.createComponent(NavbarComponent);
    fixture.detectChanges();
    const skip = fixture.nativeElement.querySelector('a.sr-only');
    expect(skip.getAttribute('href')).toBe('#main-content');
  });
});
