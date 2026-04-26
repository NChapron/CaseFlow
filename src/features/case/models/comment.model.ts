export interface Comment {
  id: string;
  caseId: string;
  authorId: string;
  body: string;
  createdAt: Date;
  isInternal: boolean;
}
