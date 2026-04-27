import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { CommentFormComponent } from './comment-form';
import { CaseService } from '../../services/case.service';

const mockCaseService = {
  addComment: vi.fn(),
};

describe('CommentFormComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [CommentFormComponent],
      providers: [{ provide: CaseService, useValue: mockCaseService }],
    }).compileComponents();
  });

  it('should render the comment textarea', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('textarea')).not.toBeNull();
  });

  it('should render the submit button', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).not.toBeNull();
  });

  it('should disable submit button when form is invalid', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(btn.disabled).toBe(true);
  });

  it('should enable submit button when body has content', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    fixture.componentInstance.form.get('body')!.setValue('This is a comment.');
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(btn.disabled).toBe(false);
  });

  it('should show a validation error when body is touched and empty', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const control = fixture.componentInstance.form.get('body')!;
    control.markAsTouched();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.comment-form__error')).not.toBeNull();
  });

  it('should call addComment with correct payload on valid submit', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.componentRef.setInput('authorId', 'USR-001');
    fixture.detectChanges();

    fixture.componentInstance.form.get('body')!.setValue('Looking into this.');
    fixture.componentInstance.form.get('isInternal')!.setValue(false);
    fixture.detectChanges();

    fixture.componentInstance.onSubmit();

    expect(mockCaseService.addComment).toHaveBeenCalledWith('CASE-001', {
      authorId: 'USR-001',
      body: 'Looking into this.',
      isInternal: false,
    });
  });

  it('should reset the form after a successful submit', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();

    fixture.componentInstance.form.get('body')!.setValue('A comment.');
    fixture.componentInstance.onSubmit();
    fixture.detectChanges();

    expect(fixture.componentInstance.form.get('body')!.value).toBe('');
  });

  it('should not call addComment when form is invalid', () => {
    const fixture = TestBed.createComponent(CommentFormComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();

    fixture.componentInstance.onSubmit();

    expect(mockCaseService.addComment).not.toHaveBeenCalled();
  });
});
