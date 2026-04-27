import { Component, ChangeDetectionStrategy } from '@angular/core';
import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'cf-dashboard-page',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent],
  template: `
    <cf-page-header title="Dashboard" />
    <!--    <cf-dashboard />-->
  `,
})
export class DashboardPage {}
