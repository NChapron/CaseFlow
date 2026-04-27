import { Component, input, inject, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CaseService } from '../../services/case.service';
import { CaseWorkflowService } from '../../services/case-workflow.service';
import { CaseStatus } from '../../models/case-status.enum';
import { StatusBadgeComponent } from '@shared/components';


const STATUS_LABELS: Record<CaseStatus, string> = {
  [CaseStatus.New]: 'New',
  [CaseStatus.InReview]: 'In Review',
  [CaseStatus.InProgress]: 'In Progress',
  [CaseStatus.Blocked]: 'Blocked',
  [CaseStatus.Resolved]: 'Resolved',
  [CaseStatus.Closed]: 'Closed',
};

@Component({
  selector: 'cf-status-stepper',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusBadgeComponent],
  templateUrl: './status-stepper.html',
  styleUrl: './status-stepper.css',
})
export class StatusStepperComponent {
  private readonly caseService = inject(CaseService);
  private readonly workflowService = inject(CaseWorkflowService);

  readonly caseId = input.required<string>();
  readonly actorId = input<string>('USR-001'); // default until auth exists

  readonly case = toSignal(
    toObservable(this.caseId).pipe(switchMap((id) => this.caseService.getCaseById$(id))),
    { initialValue: undefined },
  );

  readonly validTransitions = () =>
    this.case() ? this.workflowService.getValidTransitions(this.case()!.status) : [];

  readonly isTerminal = () =>
    this.case() ? this.workflowService.isTerminal(this.case()!.status) : false;

  label(status: CaseStatus): string {
    return STATUS_LABELS[status];
  }

  transition(to: CaseStatus): void {
    this.caseService.transitionStatus(this.caseId(), to, this.actorId());
  }
}
