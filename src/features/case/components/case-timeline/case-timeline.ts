import { Component, input, inject, computed, ChangeDetectionStrategy } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { CaseService } from '../../services/case.service';
import { UserService } from '@features/user/services';
import { TimelineEvent } from '../../models/timeline-event.model';
import { User } from '../../../user/models/user.model';
import { TimeAgoPipe } from '@shared/pipes';

const EVENT_LABELS: Record<string, (e: TimelineEvent) => string> = {
  created: () => 'Case created',
  status_changed: (e) => `Status changed from ${e.metadata['from']} to ${e.metadata['to']}`,
  priority_changed: (e) => `Priority changed from ${e.metadata['from']} to ${e.metadata['to']}`,
  assigned: (e) => `Assigned to ${e.metadata['assigneeName'] ?? 'someone'}`,
  comment_added: () => 'Comment added',
  tag_added: (e) => `Tag added: ${e.metadata['tag']}`,
};

@Component({
  selector: 'cf-case-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimeAgoPipe],
  template: `
    <section class="timeline" aria-label="Case timeline">
      <h2 class="timeline__heading">Activity</h2>

      @if (sortedEvents().length > 0) {
        <ol class="timeline__list" reversed>
          @for (event of sortedEvents(); track event.id) {
            <li class="timeline__event" [attr.data-timestamp]="event.timestamp.getTime()">
              <div class="timeline__event-dot" aria-hidden="true"></div>
              <div class="timeline__event-body">
                <span class="timeline__event-label">
                  {{ label(event) }}
                </span>
                <div class="timeline__event-meta">
                  <span class="timeline__event-actor">
                    {{ actorName(event.actorId) }}
                  </span>
                  <span class="timeline__event-time">
                    {{ event.timestamp | timeAgo }}
                  </span>
                </div>
              </div>
            </li>
          }
        </ol>
      } @else {
        <p class="timeline__empty">No activity yet.</p>
      }
    </section>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      .timeline__heading {
        font-size: 14px;
        font-weight: 500;
        color: #1a1a18;
        margin: 0 0 16px;
      }

      .timeline__list {
        list-style: none;
        padding: 0;
        margin: 0;
        position: relative;

        &::before {
          content: '';
          position: absolute;
          left: 7px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(0, 0, 0, 0.08);
        }
      }

      .timeline__event {
        display: flex;
        gap: 12px;
        padding: 0 0 20px 0;
        position: relative;
      }

      .timeline__event-dot {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        background: #fff;
        border: 2px solid #b4b2a9;
        flex-shrink: 0;
        margin-top: 2px;
        position: relative;
        z-index: 1;
      }

      .timeline__event-body {
        flex: 1;
        min-width: 0;
      }

      .timeline__event-label {
        font-size: 13px;
        color: #1a1a18;
        display: block;
        margin-bottom: 2px;
      }

      .timeline__event-meta {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .timeline__event-actor {
        font-size: 12px;
        font-weight: 500;
        color: #6b6a64;
      }

      .timeline__event-time {
        font-size: 12px;
        color: #9b9a94;
      }

      .timeline__empty {
        font-size: 13px;
        color: #9b9a94;
        font-style: italic;
        margin: 0;
      }
    `,
  ],
})
export class CaseTimelineComponent {
  private readonly caseService = inject(CaseService);
  private readonly userService = inject(UserService);

  readonly caseId = input.required<string>();

  private readonly case = toSignal(
    toObservable(this.caseId).pipe(switchMap((id) => this.caseService.getCaseById$(id))),
    { initialValue: undefined },
  );

  private readonly users = toSignal(this.userService.getUsers$(), { initialValue: [] as User[] });

  readonly sortedEvents = computed(() =>
    [...(this.case()?.timeline ?? [])].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime(),
    ),
  );

  label(event: TimelineEvent): string {
    return EVENT_LABELS[event.type]?.(event) ?? event.type;
  }

  actorName(actorId: string): string {
    return this.users().find((u) => u.id === actorId)?.name ?? actorId;
  }
}
