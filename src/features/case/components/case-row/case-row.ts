import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { Case } from '../../models/case.model';
import { AvatarComponent, PriorityBadgeComponent, StatusBadgeComponent } from '@shared/components';
import { TimeAgoPipe } from '@shared/pipes';

@Component({
  selector: 'cf-case-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusBadgeComponent, PriorityBadgeComponent, AvatarComponent, TimeAgoPipe],
  templateUrl: './case-row.html',
  styleUrl: './case-row.css',
})
export class CaseRowComponent {
  readonly case = input.required<Case>();
  readonly assigneeInitials = input<string | null>(null);
  readonly assigneeName = input<string | null>(null);
  readonly selected = output<string>();
}
