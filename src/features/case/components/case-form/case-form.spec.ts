import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';
import { CaseFormComponent } from './case-form';
import { CaseService } from '../../services/case.service';
import { UserService } from '@features/user/services';
import { MOCK_CASES } from '../../mock/case.mock';
import { MOCK_USERS } from '../../../user/mock/user.mock';
import { CasePriority } from '../../models/case-priority.enum';

const mockCaseService = {
  getCaseById$: vi.fn(),
  createCase: vi.fn(),
  updateCase: vi.fn(),
};

const mockUserService = {
  getUsers$: vi.fn(() => of(MOCK_USERS)),
};

const mockRouter = {
  navigate: vi.fn().mockResolvedValue(true),
};

describe('CaseFormComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    mockCaseService.getCaseById$.mockReturnValue(of(MOCK_CASES[0]));

    await TestBed.configureTestingModule({
      imports: [CaseFormComponent, ReactiveFormsModule],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        { provide: UserService, useValue: mockUserService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();
  });

  describe('create mode (no caseId input)', () => {
    it('should render an empty title field', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.form.get('title')!.value).toBe('');
    });

    it('should be invalid when title is empty', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.form.invalid).toBe(true);
    });

    it('should be valid when all required fields are filled', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      fixture.componentInstance.form.patchValue({
        title: 'New case title',
        description: 'Some description',
        priority: CasePriority.High,
        assigneeId: null,
      });
      expect(fixture.componentInstance.form.valid).toBe(true);
    });

    it('should show a validation error when title is touched and empty', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      fixture.componentInstance.form.get('title')!.markAsTouched();
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('.form__error')).not.toBeNull();
    });

    it('should call createCase with correct payload on valid submit', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      fixture.componentInstance.form.patchValue({
        title: 'Test case',
        description: 'Test desc',
        priority: CasePriority.Medium,
        assigneeId: 'USR-001',
        tags: 'auth, ui',
      });
      fixture.componentInstance.onSubmit();
      expect(mockCaseService.createCase).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test case',
          priority: CasePriority.Medium,
        }),
      );
    });

    it('should not call createCase when form is invalid', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      fixture.componentInstance.onSubmit();
      expect(mockCaseService.createCase).not.toHaveBeenCalled();
    });

    it('should parse comma-separated tags into an array', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      fixture.componentInstance.form.patchValue({
        title: 'Tag test',
        priority: CasePriority.Low,
        tags: 'auth, safari, frontend',
      });
      fixture.componentInstance.onSubmit();
      expect(mockCaseService.createCase).toHaveBeenCalledWith(
        expect.objectContaining({
          tags: ['auth', 'safari', 'frontend'],
        }),
      );
    });
  });

  describe('edit mode (caseId input provided)', () => {
    let caseSubject: Subject<any>;

    beforeEach(() => {
      caseSubject = new Subject();
      mockCaseService.getCaseById$.mockReturnValue(caseSubject.asObservable());
    });

    it('should patch the form with existing case values', async () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.componentRef.setInput('caseId', 'CASE-001');
      fixture.detectChanges();

      caseSubject.next(MOCK_CASES[0]);
      caseSubject.complete();
      await fixture.whenStable();

      expect(fixture.componentInstance.form.get('title')!.value).toBe(MOCK_CASES[0].title);
    });

    it('should call updateCase on submit in edit mode', async () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.componentRef.setInput('caseId', 'CASE-001');
      fixture.detectChanges();

      caseSubject.next(MOCK_CASES[0]);
      caseSubject.complete();
      await fixture.whenStable();

      fixture.componentInstance.onSubmit();
      expect(mockCaseService.updateCase).toHaveBeenCalledWith(
        'CASE-001',
        expect.objectContaining({ title: MOCK_CASES[0].title }),
      );
    });

    it('should not call createCase in edit mode', async () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.componentRef.setInput('caseId', 'CASE-001');
      fixture.detectChanges();

      caseSubject.next(MOCK_CASES[0]);
      caseSubject.complete();
      await fixture.whenStable();

      fixture.componentInstance.onSubmit();
      expect(mockCaseService.createCase).not.toHaveBeenCalled();
    });

    it('should mark form as dirty after user edits a field', async () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.componentRef.setInput('caseId', 'CASE-001');
      fixture.detectChanges();

      caseSubject.next(MOCK_CASES[0]);
      caseSubject.complete();
      await fixture.whenStable();

      fixture.componentInstance.form.get('title')!.markAsDirty();
      fixture.componentInstance.form.get('title')!.setValue('Changed title');
      expect(fixture.componentInstance.form.dirty).toBe(true);
    });
  });

  describe('isDirty', () => {
    it('should return false when form is pristine', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      expect(fixture.componentInstance.isDirty()).toBe(false);
    });

    it('should return true when form is dirty', () => {
      const fixture = TestBed.createComponent(CaseFormComponent);
      fixture.detectChanges();
      fixture.componentInstance.form.get('title')!.markAsDirty();
      expect(fixture.componentInstance.isDirty()).toBe(true);
    });
  });
});
