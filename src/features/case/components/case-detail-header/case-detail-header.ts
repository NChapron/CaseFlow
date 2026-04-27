import { Component, input, inject,  ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, switchMap } from 'rxjs';
import { CaseService } from '../../services/case.service';
import { AvatarComponent, PriorityBadgeComponent, StatusBadgeComponent } from '@shared/components';
import { TimeAgoPipe } from '@shared/pipes';
import { UserService } from '@features/user/services';


@Component({
  selector: 'cf-case-detail-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [StatusBadgeComponent, PriorityBadgeComponent, AvatarComponent, TimeAgoPipe],
  templateUrl: './case-detail-header.html',
  styleUrl: './case-detail-header.css',
})
export class CaseDetailHeaderComponent {
  private readonly caseService = inject(CaseService);
  private readonly userService = inject(UserService);

  readonly caseId = input.required<string>();

  readonly case = toSignal(
    toObservable(this.caseId).pipe(switchMap((id) => this.caseService.getCaseById$(id))),
    { initialValue: undefined },
  );

  readonly assignee = toSignal(
    toObservable(this.case).pipe(
      switchMap((c) =>
        c?.assigneeId ? this.userService.getUserById$(c.assigneeId) : of(undefined),
      ),
    ),
    { initialValue: undefined },
  );
}
