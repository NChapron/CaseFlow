import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import { CasePriority } from '@features/case/models/case-priority.enum';

const PRIORITY_LABELS: Record<CasePriority, string> = {
  [CasePriority.Low]: 'Low',
  [CasePriority.Medium]: 'Medium',
  [CasePriority.High]: 'High',
  [CasePriority.Critical]: 'Critical',
};

const PRIORITY_CLASSES: Record<CasePriority, string> = {
  [CasePriority.Low]: 'badge--low',
  [CasePriority.Medium]: 'badge--medium',
  [CasePriority.High]: 'badge--high',
  [CasePriority.Critical]: 'badge--critical',
};

@Component({
  selector: 'cf-priority-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './priority-badge.html',
  styleUrl: './priority-badge.css',
})
export class PriorityBadgeComponent {
  readonly priority = input.required<CasePriority>();
  readonly label = computed(() => PRIORITY_LABELS[this.priority()]);
  readonly badgeClass = computed(() => PRIORITY_CLASSES[this.priority()]);
}
