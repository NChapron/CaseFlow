export type TimelineEventType =
  | 'created'
  | 'status_changed'
  | 'priority_changed'
  | 'assigned'
  | 'comment_added'
  | 'tag_added';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  actorId: string;
  timestamp: Date;
  metadata: Record<string, string>;
}
