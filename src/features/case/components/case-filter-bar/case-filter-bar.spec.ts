import { describe, it, expect, beforeEach } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CaseFilterBarComponent } from './case-filter-bar';
import { CaseStatus } from '../../models/case-status.enum';
import { CasePriority } from '../../models/case-priority.enum';

describe('CaseFilterBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CaseFilterBarComponent],
    });
  });

  it('should render a search input', () => {
    const fixture = TestBed.createComponent(CaseFilterBarComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('input[type="search"]')).not.toBeNull();
  });

  it('should render a status select', () => {
    const fixture = TestBed.createComponent(CaseFilterBarComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('select[data-testid="status-filter"]'),
    ).not.toBeNull();
  });

  it('should render a priority select', () => {
    const fixture = TestBed.createComponent(CaseFilterBarComponent);
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('select[data-testid="priority-filter"]'),
    ).not.toBeNull();
  });

  it('should emit filterChange when search input changes', async () => {
    const fixture = TestBed.createComponent(CaseFilterBarComponent);
    fixture.detectChanges();

    const spy = vi.spyOn(fixture.componentInstance.filterChange, 'emit');

    fixture.componentInstance.form.get('search')!.setValue('login');
    await new Promise((r) => setTimeout(r, 350));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ search: 'login' }));
  });

  it('should emit filterChange when status select changes', () => {
    const fixture = TestBed.createComponent(CaseFilterBarComponent);
    fixture.detectChanges();

    const emitted: unknown[] = [];
    const spy = vi.spyOn(fixture.componentInstance.filterChange, 'emit');

    fixture.componentInstance.form.get('status')!.setValue(CaseStatus.Blocked);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ status: CaseStatus.Blocked }));
  });

  it('should emit filterChange when priority select changes', () => {
    const fixture = TestBed.createComponent(CaseFilterBarComponent);
    fixture.detectChanges();

    const spy = vi.spyOn(fixture.componentInstance.filterChange, 'emit');

    fixture.componentInstance.form.get('priority')!.setValue(CasePriority.Critical);
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({ priority: CasePriority.Critical }));
  });

  it('should emit resetFilters when the reset button is clicked', () => {
    const fixture = TestBed.createComponent(CaseFilterBarComponent);
    fixture.detectChanges();

    let emitted = false;
    fixture.componentInstance.resetFilters.subscribe(() => (emitted = true));

    fixture.nativeElement.querySelector('button[data-testid="reset-filters"]').click();
    expect(emitted).toBe(true);
  });
});
