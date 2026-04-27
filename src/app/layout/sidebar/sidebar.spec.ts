import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SidebarComponent } from './sidebar';

describe('SidebarComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render a link for each nav item', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    const links = fixture.nativeElement.querySelectorAll('.sidebar__link');
    expect(links.length).toBe(fixture.componentInstance.navItems.length);
  });

  it('should render Dashboard and Cases nav items', () => {
    const fixture = TestBed.createComponent(SidebarComponent);
    fixture.detectChanges();
    const labels = Array.from(fixture.nativeElement.querySelectorAll('.sidebar__label')).map(
      (el: any) => el.textContent.trim(),
    );
    expect(labels).toContain('Dashboard');
    expect(labels).toContain('Cases');
  });
});
