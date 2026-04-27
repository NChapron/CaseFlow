// layout/shell/shell.component.ts
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar} from '../sidebar/sidebar';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'cf-shell',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, Navbar , Sidebar],
  template: `
    <div class="shell">
      <cf-navbar />
      <div class="shell__body">
        <cf-sidebar />
        <main class="shell__main" id="main-content" tabindex="-1">
          <div class="shell__content">
            <router-outlet />
          </div>
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        height: 100vh;
      }

      .shell {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #f5f4f0;
      }

      .shell__body {
        display: flex;
        flex: 1;
        overflow: hidden;
      }

      .shell__main {
        flex: 1;
        overflow-y: auto;
        outline: none;
      }

      .shell__content {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0 24px 48px;
      }
    `,
  ],
})
export class Shell {}
