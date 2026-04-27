import { describe, it, expect, vi } from 'vitest';
import { unsavedChangesGuard } from './unsaved-changes.guard';

describe('unsavedChangesGuard', () => {
  it('should allow deactivation when form is not dirty', () => {
    const component = { isDirty: () => false } as any;
    expect(unsavedChangesGuard(component, null!, null!, null!)).toBe(true);
  });

  it('should confirm when form is dirty and user confirms', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    const component = { isDirty: () => true } as any;
    expect(unsavedChangesGuard(component, null!, null!, null!)).toBe(true);
  });

  it('should block when form is dirty and user cancels', () => {
    vi.spyOn(window, 'confirm').mockReturnValue(false);
    const component = { isDirty: () => true } as any;
    expect(unsavedChangesGuard(component, null!, null!, null!)).toBe(false);
  });
});
