import { Component, input, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CaseService } from '../../services/case.service';

@Component({
  selector: 'cf-comment-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <section class="comment-form" aria-label="Add a comment">
      <h2 class="comment-form__heading">Add comment</h2>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" novalidate>
        <div class="comment-form__field">
          <label for="comment-body" class="comment-form__label">
            Comment <span aria-hidden="true">*</span>
          </label>
          <textarea
            id="comment-body"
            formControlName="body"
            class="comment-form__textarea"
            placeholder="Write a comment…"
            rows="4"
            aria-required="true"
            [attr.aria-describedby]="bodyTouched() ? 'comment-body-error' : null"
          >
          </textarea>
          @if (bodyTouched() && bodyInvalid()) {
            <p id="comment-body-error" class="comment-form__error" role="alert">
              Comment cannot be empty.
            </p>
          }
        </div>

        <div class="comment-form__footer">
          <label class="comment-form__internal">
            <input
              type="checkbox"
              formControlName="isInternal"
              aria-label="Mark as internal note"
            />
            Internal note
          </label>

          <button type="submit" class="comment-form__submit" [disabled]="form.invalid">
            Post comment
          </button>
        </div>
      </form>
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .comment-form__heading {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a18;
        margin: 0 0 16px;
      }

      .comment-form__field {
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-bottom: 12px;
      }

      .comment-form__label {
        font-size: 13px;
        font-weight: 500;
        color: #1a1a18;
      }

      .comment-form__textarea {
        width: 100%;
        padding: 8px 10px;
        font-size: 13px;
        font-family: inherit;
        border: 1px solid rgba(0, 0, 0, 0.12);
        border-radius: 6px;
        resize: vertical;
        color: #1a1a18;
        line-height: 1.5;

        &:focus-visible {
          outline: 2px solid #378add;
          outline-offset: 1px;
        }

        &[aria-invalid='true'] {
          border-color: #f09595;
        }
      }

      .comment-form__error {
        font-size: 12px;
        color: #791f1f;
        margin: 0;
      }

      .comment-form__footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }

      .comment-form__internal {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: #6b6a64;
        cursor: pointer;
        user-select: none;
      }

      .comment-form__submit {
        height: 34px;
        padding: 0 16px;
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px;
        border: 1px solid rgba(0, 0, 0, 0.12);
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
export class CommentFormComponent implements OnInit {
  private readonly caseService = inject(CaseService);
  private readonly fb = inject(FormBuilder);

  readonly caseId = input.required<string>();
  readonly authorId = input<string>('USR-001');

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      body: ['', [Validators.required, Validators.minLength(1)]],
      isInternal: [false],
    });
  }

  bodyTouched(): boolean {
    return !!this.form.get('body')?.touched;
  }

  bodyInvalid(): boolean {
    return !!this.form.get('body')?.invalid;
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.caseService.addComment(this.caseId(), {
      authorId: this.authorId(),
      body: this.form.value.body.trim(),
      isInternal: this.form.value.isInternal,
    });

    this.form.reset({ body: '', isInternal: false });
  }
}
