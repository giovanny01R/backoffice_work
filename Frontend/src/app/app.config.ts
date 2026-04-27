import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';

// Importamos ambos: el de Visitas y el nuevo de SGP
import { authInterceptorFn } from './core/interceptors/auth.interceptor';
import { sgpInterceptorFn } from './core/interceptors/sgp.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        authInterceptorFn, // El de Visitas sigue trabajando igual
        sgpInterceptorFn   // El de SGP se encarga de tus nuevas rutas
      ])
    ),
  ]
};