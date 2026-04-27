// pages/cases/case-detail.page.ts
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '@shared/components';
import {
  CaseDetailHeaderComponent,
  CaseTimelineComponent,
  CommentFormComponent,
  StatusStepperComponent,
} from '@features/case/components';


@Component({
  selector: 'cf-case-detail-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    PageHeaderComponent,
    CaseDetailHeaderComponent,
    StatusStepperComponent,
    CaseTimelineComponent,
    CommentFormComponent,
  ],
  template: `
    <cf-page-header [title]="'Case ' + id()">
      <a class="page-link" [routerLink]="['/cases', id(), 'edit']">Edit</a>
      <a class="page-link" routerLink="/cases">← Back</a>
    </cf-page-header>

    <cf-case-detail-header [caseId]="id()" />
    <cf-status-stepper [caseId]="id()" />
    <cf-case-timeline [caseId]="id()" />
    <cf-comment-form [caseId]="id()" />
  `,
  styles: [
    `
      .page-link {
        font-size: 13px;
        color: #378add;
        text-decoration: none;
        padding: 6px 10px;
        border-radius: 6px;

        &:hover {
          background: #e6f1fb;
        }
        &:focus-visible {
          outline: 2px solid #378add;
          outline-offset: 2px;
        }
      }
    `,
  ],
})
export class CaseDetailPage {
  readonly id = input.required<string>();
}
