import {HttpEvent, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {Observable,} from 'rxjs';
import {AuthService} from '@auth/services/auth.service';
import {inject} from '@angular/core';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const token = inject(AuthService).token();
  const authReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`)
  });
  return next(authReq);
}
