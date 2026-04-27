import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, UserRole } from '../models/user.model';
import { MOCK_USERS } from '../mock/user.mock';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly state$ = new BehaviorSubject<User[]>(MOCK_USERS);

  getUsers$(): Observable<User[]> {
    return this.state$.asObservable();
  }

  getUserById$(id: string): Observable<User | undefined> {
    return this.state$.pipe(map((users) => users.find((u) => u.id === id)));
  }

  getUsersByRole$(role: UserRole): Observable<User[]> {
    return this.state$.pipe(map((users) => users.filter((u) => u.role === role)));
  }
}
