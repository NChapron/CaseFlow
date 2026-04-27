import { User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  {
    id: 'USR-001',
    name: 'Aisha Patel',
    email: 'a.patel@internal.io',
    initials: 'AP',
    department: 'Platform Engineering',
    role: 'lead',
  },
  {
    id: 'USR-002',
    name: 'Marcus Webb',
    email: 'm.webb@internal.io',
    initials: 'MW',
    department: 'Backend Services',
    role: 'agent',
  },
  {
    id: 'USR-003',
    name: 'Sofia Reyes',
    email: 's.reyes@internal.io',
    initials: 'SR',
    department: 'Frontend',
    role: 'agent',
  },
];
