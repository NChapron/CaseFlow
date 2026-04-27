import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UserService } from './user.service';
import { MOCK_USERS } from '../mock/user.mock';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  it('should return all users', async () => {
    const users = await firstValueFrom(service.getUsers$());
    expect(users.length).toBe(MOCK_USERS.length);
  });

  it('should return a user by id', async () => {
    const user = await firstValueFrom(service.getUserById$('USR-001'));
    expect(user).toBeDefined();
    expect(user!.name).toBe('Aisha Patel');
  });

  it('should return undefined for an unknown id', async () => {
    const user = await firstValueFrom(service.getUserById$('USR-999'));
    expect(user).toBeUndefined();
  });

  it('should return users filtered by role', async () => {
    const agents = await firstValueFrom(service.getUsersByRole$('agent'));
    expect(agents.every((u) => u.role === 'agent')).toBe(true);
  });
});
