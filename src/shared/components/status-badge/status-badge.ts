import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CaseStatus } from '@features/case/models/case-status.enum';

const STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.New]: 'New',
  [CaseStatus.InReview]: 'In Review',
  [CaseStatus.InProgress]: 'In Progress',
  [CaseStatus.Blocked]: 'Blocked',
  [CaseStatus.Resolved]: 'Resolved',
  [CaseStatus.Closed]: 'Closed',
};

const STATUS_CLASSES: Record<CaseStatus, string> = {
  [CaseStatus.New]: 'badge--new',
  [CaseStatus.InReview]: 'badge--in-review',
  [CaseStatus.InProgress]: 'badge--in-progress',
  [CaseStatus.Blocked]: 'badge--blocked',
  [CaseStatus.Resolved]: 'badge--resolved',
  [CaseStatus.Closed]: 'badge--closed',
};

@Component({
  selector: 'cf-status-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './status-badge.html',
  styleUrl: './status-badge.css',
})
export class StatusBadgeComponent {
  readonly status = input.required<CaseStatus>();
  readonly label = computed(() => STATUS_LABELS[this.status()]);
  readonly badgeClass = computed(() => STATUS_CLASSES[this.status()]);
}
