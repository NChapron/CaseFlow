import { CanDeactivateFn } from '@angular/router';
import { CaseFormComponent } from '@features/case/components';


export const unsavedChangesGuard: CanDeactivateFn<CaseFormComponent> = (component) => {
  if (!component.isDirty()) return true;
  return window.confirm('You have unsaved changes. Leave anyway?');
};
