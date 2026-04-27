import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StatusStepperComponent } from './status-stepper';
import { CaseService } from '../../services/case.service';
import { CaseWorkflowService } from '../../services/case-workflow.service';
import { MOCK_CASES } from '../../mock/case.mock';
import { CaseStatus } from '../../models/case-status.enum';

const mockCaseService = {
  getCaseById$: vi.fn(() => of(MOCK_CASES[0])),
  transitionStatus: vi.fn(),
};

describe('StatusStepperComponent', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await TestBed.configureTestingModule({
      imports: [StatusStepperComponent],
      providers: [
        { provide: CaseService, useValue: mockCaseService },
        CaseWorkflowService,
      ],
    }).compileComponents();
  });

  it('should render the current status label', () => {
    const fixture = TestBed.createComponent(StatusStepperComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const current = fixture.nativeElement.querySelector('.stepper__current');
    expect(current.textContent.trim()).toContain('In Progress');
  });

  it('should render buttons only for valid next transitions', () => {
    // CASE-001 is in_progress → valid next: blocked, resolved
    const fixture = TestBed.createComponent(StatusStepperComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.stepper__btn');
    expect(buttons.length).toBe(2);
  });

  it('should call transitionStatus with the correct args when a button is clicked', () => {
    const fixture = TestBed.createComponent(StatusStepperComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.componentRef.setInput('actorId', 'USR-001');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.stepper__btn');
    buttons[0].click();

    expect(mockCaseService.transitionStatus).toHaveBeenCalledWith(
      'CASE-001',
      expect.any(String),
      'USR-001',
    );
  });

  it('should render no transition buttons when status is closed', () => {
    mockCaseService.getCaseById$.mockReturnValue(
      of({ ...MOCK_CASES[0], status: CaseStatus.Closed }),
    );
    const fixture = TestBed.createComponent(StatusStepperComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.stepper__btn');
    expect(buttons.length).toBe(0);
  });

  it('should render a terminal message when status is closed', () => {
    mockCaseService.getCaseById$.mockReturnValue(
      of({ ...MOCK_CASES[0], status: CaseStatus.Closed }),
    );
    const fixture = TestBed.createComponent(StatusStepperComponent);
    fixture.componentRef.setInput('caseId', 'CASE-001');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.stepper__terminal')).not.toBeNull();
  });
});
