import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Retrieve the token from localStorage
  const token = localStorage.getItem('token');

  // If there's a token, clone the request and add the Authorization header
  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(clonedRequest);  // Pass the cloned request to the next handler
  }

  // If there's no token, pass the original request without modification
  return next(req);
};