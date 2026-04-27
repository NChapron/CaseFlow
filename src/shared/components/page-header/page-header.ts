import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'cf-page-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './page-header.html' ,
  styleUrl: './page-header.css',
})
export class PageHeaderComponent {
  readonly title = input.required<string>();
  readonly subtitle = input<string | null>(null);
}
