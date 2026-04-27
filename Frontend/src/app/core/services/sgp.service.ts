import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

// Definimos la interfaz para mantener el tipado fuerte en toda la app
export interface SolicitudContrato {
  id_solicitud?: number;
  tipo_solicitud: 'VENDEDOR' | 'PUNTO_VENTA' | 'AMBOS';
  fecha: string;
  documento: string;
  nombre: string;
  fechaNac: string;
  fechaExpedicion: string;
  direccion: string;
  telefono: string;
  correo: string;
  zona: string;
  rol: string;
  grupoVenta: string;
  liquidacion: string;
  ceco: string;
  codigoSF: string;
  planVirtual: string;
  
  nombre_local?: string;
  direccion_punto?: string;
  zona_operacion?: string;
  estado_solicitud?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SgpService {
  // Definimos la base (Puerto 3001) y la ruta específica de solicitudes
  private readonly API_BASE = environment.apiUrlSgp;
  private readonly URL_SOLICITUDES = `${this.API_BASE}/solicitudes`;

  constructor(private http: HttpClient) { }

  /**
   * Autenticación: Valida credenciales y almacena el token automáticamente
   * @param credentials Objeto con { username, password }
   */
  loginSgp(credentials: any): Observable<any> {
    return this.http.post(`${this.API_BASE}/auth/login`, credentials).pipe(
      tap((res: any) => {
        // Si el login es exitoso, guardamos la "llave" para el interceptor
        if (res.token) {
          localStorage.setItem('token_sgp', res.token);
          localStorage.setItem('usuario_sgp', JSON.stringify(res.usuario));
        }
      })
    );
  }

  /**
   * Envía la solicitud de nuevo contrato al Backend
   */
  crearSolicitud(datos: Partial<SolicitudContrato>): Observable<any> {
    return this.http.post(this.URL_SOLICITUDES, datos);
  }

  /**
   * Obtiene las solicitudes pendientes de revisión
   */
  obtenerPendientes(): Observable<SolicitudContrato[]> {
    return this.http.get<SolicitudContrato[]>(`${this.URL_SOLICITUDES}/pendientes`);
  }

  /**
   * Aprueba una solicitud y activa la lógica de negocio en el Backend
   */
  aprobarSolicitud(id: number): Observable<any> {
    return this.http.patch(`${this.URL_SOLICITUDES}/${id}/aprobar`, {});
  }

  /**
   * Método auxiliar para cerrar sesión en el SGP
   */
  logoutSgp() {
    localStorage.removeItem('token_sgp');
    localStorage.removeItem('usuario_sgp');
  }
}