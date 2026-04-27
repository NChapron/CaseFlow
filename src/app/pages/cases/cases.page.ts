// pages/cases/cases.page.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';
import { CaseListComponent } from '@features/case/components';


@Component({
  selector: 'cf-cases-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, CaseListComponent],
  template: `
    <cf-page-header title="Cases">
      <button class="page-btn" (click)="onCreate()">+ New case</button>
    </cf-page-header>
    <cf-case-list (caseSelected)="onCaseSelected($event)" />
  `,
  styles: [
    `
      .page-btn {
        height: 34px;
        padding: 0 14px;
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px;
        border: none;
        background: #1a1a18;
        color: #fff;
        cursor: pointer;

        &:hover {
          opacity: 0.85;
        }
        &:focus-visible {
          outline: 2px solid #378add;
          outline-offset: 2px;
        }
      }
    `,
  ],
})
export class CasesPage {
  private readonly router = inject(Router);

  onCaseSelected(id: string): void {
    this.router.navigate(['/cases', id]);
  }

  onCreate(): void {
    this.router.navigate(['/cases/new']);
  }
}
