// features/case/components/case-form/case-form.component.ts
import { Component, input, inject, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of, firstValueFrom } from 'rxjs';
import { CaseService } from '../../services/case.service';
import { UserService } from '@features/user/services';
import { User } from '../../../user/models/user.model';
import { CasePriority } from '../../models/case-priority.enum';
import { CaseStatus } from '../../models/case-status.enum';
import { CreateCasePayload } from '../../models/case.model';

@Component({
  selector: 'cf-case-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <form
      [formGroup]="form"
      (ngSubmit)="onSubmit()"
      novalidate
      class="case-form"
      [attr.aria-label]="isEditMode() ? 'Edit case' : 'Create case'"
    >
      <h2 class="case-form__heading">
        {{ isEditMode() ? 'Edit case' : 'New case' }}
      </h2>

      <div class="form__field">
        <label for="case-title" class="form__label">
          Title <span aria-hidden="true">*</span>
        </label>
        <input
          id="case-title"
          type="text"
          formControlName="title"
          class="form__input"
          placeholder="Brief summary of the issue"
          aria-required="true"
          [attr.aria-describedby]="titleInvalid() ? 'title-error' : null"
        />
        @if (titleInvalid()) {
          <p id="title-error" class="form__error" role="alert">Title is required.</p>
        }
      </div>

      <div class="form__field">
        <label for="case-description" class="form__label">Description</label>
        <textarea
          id="case-description"
          formControlName="description"
          class="form__textarea"
          placeholder="Detailed description of the issue…"
          rows="5"
        >
        </textarea>
      </div>

      <div class="form__field">
        <label for="case-priority" class="form__label">
          Priority <span aria-hidden="true">*</span>
        </label>
        <select
          id="case-priority"
          formControlName="priority"
          class="form__select"
          aria-required="true"
        >
          <option value="">Select priority</option>
          @for (p of priorities; track p.value) {
            <option [value]="p.value">{{ p.label }}</option>
          }
        </select>
      </div>

      <div class="form__field">
        <label for="case-assignee" class="form__label">Assignee</label>
        <select id="case-assignee" formControlName="assigneeId" class="form__select">
          <option value="">Unassigned</option>
          @for (u of users(); track u.id) {
            <option [value]="u.id">{{ u.name }}</option>
          }
        </select>
      </div>

      <div class="form__field">
        <label for="case-tags" class="form__label">Tags</label>
        <input
          id="case-tags"
          type="text"
          formControlName="tags"
          class="form__input"
          placeholder="auth, frontend, safari  (comma separated)"
        />
        <p class="form__hint">Separate tags with commas.</p>
      </div>

      <div class="case-form__actions">
        <button type="button" class="case-form__cancel" (click)="onCancel()">Cancel</button>
        <button type="submit" class="case-form__submit" [disabled]="form.invalid">
          {{ isEditMode() ? 'Save changes' : 'Create case' }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      :host {
        display: block;
        max-width: 640px;
      }

      .case-form__heading {
        font-size: 18px;
        font-weight: 500;
        color: #1a1a18;
        margin: 0 0 24px;
      }

      .form__field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 20px;
      }

      .form__label {
        font-size: 13px;
        font-weight: 500;
        color: #1a1a18;
      }

      .form__input,
      .form__select,
      .form__textarea {
        padding: 8px 10px;
        font-size: 13px;
        font-family: inherit;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 6px;
        color: #1a1a18;
        background: #fff;
        width: 100%;

        &:focus-visible {
          outline: 2px solid #378add;
          outline-offset: 1px;
        }
      }

      .form__textarea {
        resize: vertical;
        line-height: 1.5;
      }

      .form__error {
        font-size: 12px;
        color: #791f1f;
        margin: 0;
      }

      .form__hint {
        font-size: 12px;
        color: #9b9a94;
        margin: 0;
      }

      .case-form__actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        padding-top: 8px;
        border-top: 1px solid rgba(0, 0, 0, 0.08);
      }

      .case-form__cancel {
        height: 34px;
        padding: 0 16px;
        font-size: 13px;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.12);
        background: transparent;
        color: #6b6a64;
        cursor: pointer;

        &:hover {
          background: #f1efe8;
        }
        &:focus-visible {
          outline: 2px solid #378add;
          outline-offset: 2px;
        }
      }

      .case-form__submit {
        height: 34px;
        padding: 0 16px;
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px;
        border: none;
        background: #1a1a18;
        color: #fff;
        cursor: pointer;
        transition: opacity 0.15s;

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
        &:not(:disabled):hover {
          opacity: 0.85;
        }
        &:focus-visible {
          outline: 2px solid #378add;
          outline-offset: 2px;
        }
      }
    `,
  ],
})
export class CaseFormComponent implements OnInit {
  private readonly caseService = inject(CaseService);
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  readonly caseId = input<string | null>(null);

  readonly isEditMode = () => !!this.caseId();

  readonly priorities = [
    { value: CasePriority.Low, label: 'Low' },
    { value: CasePriority.Medium, label: 'Medium' },
    { value: CasePriority.High, label: 'High' },
    { value: CasePriority.Critical, label: 'Critical' },
  ];

  readonly users = toSignal(this.userService.getUsers$(), { initialValue: [] as User[] });

  private readonly existingCase = toSignal(
    toObservable(this.caseId).pipe(
      switchMap((id) => (id ? this.caseService.getCaseById$(id) : of(undefined))),
    ),
    { initialValue: undefined },
  );

  form!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      priority: ['', Validators.required],
      assigneeId: [null],
      tags: [''],
    });

    const id = this.caseId();
    if (id) {
      firstValueFrom(this.caseService.getCaseById$(id)).then((c) => {
        if (!c) return;
        this.form.reset({
          title: c.title,
          description: c.description,
          priority: c.priority,
          assigneeId: c.assigneeId ?? '',
          tags: c.tags.join(', '),
        });
      });
    }
  }

  isDirty(): boolean {
    return this.form.dirty || Object.values(this.form.controls).some((c) => c.dirty);
  }

  titleInvalid(): boolean {
    const ctrl = this.form.get('title')!;
    return ctrl.invalid && ctrl.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const { title, description, priority, assigneeId, tags } = this.form.value;

    const parsedTags: string[] = tags
      ? tags
          .split(',')
          .map((t: string) => t.trim())
          .filter(Boolean)
      : [];

    const payload: Partial<CreateCasePayload> = {
      title: title.trim(),
      description: description?.trim() ?? '',
      priority,
      assigneeId: assigneeId || null,
      tags: parsedTags,
    };

    if (this.isEditMode()) {
      this.caseService.updateCase(this.caseId()!, payload);
    } else {
      this.caseService.createCase({
        ...payload,
        status: CaseStatus.New,
        reporterId: 'USR-001',
      } as CreateCasePayload);
    }

    this.router.navigate(['/cases']);
  }

  onCancel(): void {
    this.router.navigate(['/cases']);
  }
}
