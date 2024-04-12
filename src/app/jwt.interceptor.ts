import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
const TOKEN_KEY = 'auth-token';

export const jwtInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return next(request);
};
