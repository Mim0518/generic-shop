import {computed, inject, Injectable, signal} from '@angular/core';
import {User} from '@auth/interfaces/user.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {AuthResponse} from '@auth/interfaces/auth-response.interface';
import {catchError, map, Observable, of} from 'rxjs';
import {rxResource} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
type authStatus = 'checking' | 'authenticated' | 'not-authenticated' ;
const baseUrl = environment.baseUrl;
@Injectable({providedIn: 'root'})
export class AuthService {
  private _authStatus = signal('checking')
  private _user = signal<User | null>(null)
  private _token = signal<string | null>(localStorage.getItem('token'))
  private http = inject(HttpClient)
  private router = inject(Router)

  authStatus = computed(()=> {
    if(this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });
  user = computed<User|null>(() => this._user());
  token = computed<string|null>(() => this._token());
  isAdmin = computed(() => {
    return this._user()?.roles?.includes('admin') ?? false
  });
  register(fullName:string, email:string, password:string):Observable<boolean> {
    return this.http.post<AuthResponse>(baseUrl + '/auth/register', {fullName, email, password})
      .pipe(
        map((response)=> this.handleAuthSuccess(response)),
        catchError((error:any) => this.handleAuthError(error))
      )
  }
  login(email:string, password:string):Observable<boolean> {
    return this.http.post<AuthResponse>(baseUrl + '/auth/login', {email, password})
      .pipe(
        map((response)=> this.handleAuthSuccess(response)),
        catchError((error:any) => this.handleAuthError(error))
      )
  }
  checkAuthStatus(): Observable<boolean>{
    const token = localStorage.getItem('token');
    if(!token){
      this.logout();
      return of(false)
    }
    return this.http.get<AuthResponse>(baseUrl +'/auth/check-status', {
      // headers: {Authorization: `Bearer ${token}`}
    }).pipe(
      map((response)=> this.handleAuthSuccess(response)),
      catchError((error:any) => this.handleAuthError(error))
    )
  }
  checkResourceStatus = rxResource({
    stream: () => this.checkAuthStatus()
  })

  private handleAuthSuccess({token, user}:AuthResponse){
    this._authStatus.set('authenticated');
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token);
    return true
  }
  logout():void {
    this._authStatus.set('not-authenticated');
    this._user.set(null);
    this._token.set(null);
    localStorage.removeItem('token');
    // this.router.navigateByUrl('/');
  }
  private handleAuthError(error:any){
    this.logout();
    return of(false);
  }
}
