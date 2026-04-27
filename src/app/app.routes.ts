import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './shared/guards/unsaved-changes.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'cases',
    loadComponent: () => import('./pages/cases/cases.page').then((m) => m.CasesPage),
  },
  {
    path: 'cases/new',
    loadComponent: () => import('./pages/cases/case-form.page').then((m) => m.CaseFormPage),
  },
  {
    path: 'cases/:id',
    loadComponent: () => import('./pages/cases/case-detail.page').then((m) => m.CaseDetailPage),
  },
  {
    path: 'cases/:id/edit',
    loadComponent: () => import('./pages/cases/case-form.page').then((m) => m.CaseFormPage),
    canDeactivate: [unsavedChangesGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
