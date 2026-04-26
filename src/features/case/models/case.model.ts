import { CaseStatus } from './case-status.enum';
import { CasePriority } from './case-priority.enum';
import { TimelineEvent } from './timeline-event.model';
import { Comment } from './comment.model';

export interface Case {
  id: string;
  title: string;
  description: string;
  status: CaseStatus;
  priority: CasePriority;
  assigneeId: string | null;
  reporterId: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  resolvedAt: Date | null;
  timeline: TimelineEvent[];
  comments: Comment[];
}

export type CreateCasePayload = Omit<
  Case,
  'id' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'timeline' | 'comments'
>;

export type UpdateCasePayload = Partial<CreateCasePayload>;
