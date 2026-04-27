import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'cf-navbar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <header class="navbar" role="banner">
      <a class="navbar__brand" routerLink="/dashboard" aria-label="CaseFlow home">
        <span class="navbar__logo" aria-hidden="true">◈</span>
        <span class="navbar__name">CaseFlow</span>
      </a>
      <nav class="navbar__nav" aria-label="Skip navigation">
        <a class="sr-only" href="#main-content">Skip to main content</a>
      </nav>
    </header>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;

        &:focus {
          width: auto;
          height: auto;
          clip: auto;
          overflow: visible;
          white-space: normal;
          background: #fff;
          padding: 8px 16px;
          z-index: 100;
        }
      }

      .navbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 52px;
        padding: 0 24px;
        background: #fff;
        border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        flex-shrink: 0;
      }

      .navbar__brand {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        color: #1a1a18;
      }

      .navbar__logo {
        font-size: 18px;
        color: #378add;
      }

      .navbar__name {
        font-size: 15px;
        font-weight: 500;
        letter-spacing: -0.01em;
      }
    `,
  ],
})
export class Navbar {}
