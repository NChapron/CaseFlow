export type UserRole = 'agent' | 'lead' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  department: string;
  role: UserRole;
}
