import {
  Component,
  OnInit,
  inject,
  output,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CaseService } from '../../services/case.service';
import { CaseFilterService } from '../../services/case-filter.service';
import { CaseFilter, SortDirection, SortField } from '../../models/case-filter.model';
import { CaseFilterBarComponent, CaseRowComponent } from '@features/case/components';
import { EmptyStateComponent } from '@shared/components';
import { UserService } from '@features/user/services';
import { User } from '@features/user/models/user.model';

@Component({
  selector: 'cf-case-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CaseRowComponent, CaseFilterBarComponent, EmptyStateComponent],
  templateUrl: './case-list.html',
  styleUrl: './case-list.css',
})
export class CaseListComponent {
  private readonly caseService = inject(CaseService);
  private readonly filterService = inject(CaseFilterService);
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  readonly caseSelected = output<string>();

  private readonly allCases = toSignal(this.caseService.getCases$(), { initialValue: [] });
  private readonly users = toSignal(this.userService.getUsers$(), { initialValue: [] as User[] });

  readonly activeFilter = signal<CaseFilter>({});
  readonly sortField = signal<SortField>('updatedAt');
  readonly sortDirection = signal<SortDirection>('desc');

  readonly filteredCases = computed(() =>
    this.filterService.filterAndSort(
      this.allCases(),
      this.activeFilter(),
      this.sortField(),
      this.sortDirection(),
    ),
  );

  onFilterChange(filter: CaseFilter): void {
    this.activeFilter.set(filter);
  }

  onSortChange(field: SortField, direction: SortDirection): void {
    this.sortField.set(field);
    this.sortDirection.set(direction);
  }

  onReset(): void {
    this.activeFilter.set({});
    this.sortField.set('updatedAt');
    this.sortDirection.set('desc');
  }

  toggleSortDirection(): void {
    this.sortDirection.update((d) => (d === 'desc' ? 'asc' : 'desc'));
  }

  onCaseSelected(id: string): void {
    this.caseSelected.emit(id);
    this.router.navigate(['/cases', id]);
  }

  getInitials(assigneeId: string | null): string | null {
    if (!assigneeId) return null;
    return this.users().find((u) => u.id === assigneeId)?.initials ?? null;
  }

  getName(assigneeId: string | null): string | null {
    if (!assigneeId) return null;
    return this.users().find((u) => u.id === assigneeId)?.name ?? null;
  }
}
