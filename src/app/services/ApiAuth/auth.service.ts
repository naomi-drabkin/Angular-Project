import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User } from '../../../models/User';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usersSubject = new BehaviorSubject<User[]>([]);
  users$ = this.usersSubject.asObservable();

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`http://localhost:3000/api/users`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }
  postLoginOrRegister(userStatus: string, data: Partial<User>): Observable<{ token: string, userId: number }> {
    return this.http.post<{ token: string, userId: number }>(`http://localhost:3000/api/auth/${userStatus}`, data);
  }

  deleteUser(id: number) {
    return this.http.delete<void>(`http://localhost:3000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error deleting user:', error);
        return of();
      })
    );
  }

  updateUser(user: User, id: number) {
    return this.http.put<void>(`http://localhost:3000/api/users/${id}`, user, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error updtate user:', error);
        return of();
      })
    );
  }

  getUserById(id: number): Observable<User | null> {
    return this.http.get<User>(`http://localhost:3000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        alert("you dont have a permission")
        return of({} as User);
      })
    );
  }

  getToken(): string | null {
    return sessionStorage.getItem('userToken');
  }

  logout(): void {
    sessionStorage.removeItem('userToken');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || null;
    } catch (e) {
      console.error('שגיאה בפענוח הטוקן', e);
      return null;
    }
  }

  isTeacher(): boolean {
    return this.getUserRole() === 'teacher';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }
}
