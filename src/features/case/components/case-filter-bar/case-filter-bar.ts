import { Component, output, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';
import { CaseFilter } from '../../models/case-filter.model';
import { CaseStatus } from '../../models/case-status.enum';
import { CasePriority } from '../../models/case-priority.enum';

@Component({
  selector: 'cf-case-filter-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './case-filter-bar.html',
  styleUrl: './case-filter-bar.css',
})
export class CaseFilterBarComponent implements OnInit, OnDestroy {
  readonly filterChange = output<CaseFilter>();
  readonly resetFilters = output<void>();

  readonly statuses = [
    { value: CaseStatus.New, label: 'New' },
    { value: CaseStatus.InReview, label: 'In Review' },
    { value: CaseStatus.InProgress, label: 'In Progress' },
    { value: CaseStatus.Blocked, label: 'Blocked' },
    { value: CaseStatus.Resolved, label: 'Resolved' },
    { value: CaseStatus.Closed, label: 'Closed' },
  ];

  readonly priorities = [
    { value: CasePriority.Low, label: 'Low' },
    { value: CasePriority.Medium, label: 'Medium' },
    { value: CasePriority.High, label: 'High' },
    { value: CasePriority.Critical, label: 'Critical' },
  ];

  form!: FormGroup;

  private readonly fb = new FormBuilder();
  private readonly destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.form = this.fb.group({
      search: [''],
      status: [''],
      priority: [''],
    });

    this.form
      .get('search')!
      .valueChanges.pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() =>
        this.buildAndEmit(
          this.form.getRawValue().search,
          this.form.getRawValue().status,
          this.form.getRawValue().priority,
        ),
      );

    this.form
      .get('status')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((status: string) => {
        const { search, priority } = this.form.getRawValue();
        this.buildAndEmit(search, status, priority);
      });

    this.form
      .get('priority')!
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((priority: string) => {
        const { search, status } = this.form.getRawValue();
        this.buildAndEmit(search, status, priority);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onReset(): void {
    this.form.reset({ search: '', status: '', priority: '' });
    this.resetFilters.emit();
  }

  private buildAndEmit(search: string, status: string, priority: string): void {
    const filter: CaseFilter = {};
    if (search?.trim()) filter.search = search.trim();
    if (status) filter.status = status as CaseStatus;
    if (priority) filter.priority = priority as CasePriority;
    this.filterChange.emit(filter);
  }
}
