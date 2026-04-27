import { HttpInterceptorFn } from '@angular/common/http';

export const sgpInterceptorFn: HttpInterceptorFn = (req, next) => {
  // Solo actuamos si la URL de la petición es para nuestro backend SGP
  if (req.url.includes('3001')) {
    const token = localStorage.getItem('token_sgp'); // Usamos un nombre específico para no chocar con Visitas

    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(authReq);
    }
  }

  // Si no es para el SGP o no hay token, que siga su camino
  return next(req);
};