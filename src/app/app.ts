import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ENVIRONMENT } from '@core/tokens/environment.token';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('CaseFlow');
  private readonly env = inject(ENVIRONMENT);

  constructor() {
    console.log('[CaseFlow] Environment:', this.env.name);
    console.log('[CaseFlow] API URL:', this.env.apiUrl);
    console.log('[CaseFlow] Production:', this.env.production);
  }
}
