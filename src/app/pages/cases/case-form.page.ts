import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';
import { CaseFormComponent } from '@features/case/components';


@Component({
  selector: 'cf-case-form-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, CaseFormComponent],
  template: `
    <cf-page-header [title]="id() ? 'Edit case' : 'New case'" />
    <cf-case-form [caseId]="id() ?? null" />
  `,
})
export class CaseFormPage {
  readonly id = input<string | undefined>(undefined);
}
