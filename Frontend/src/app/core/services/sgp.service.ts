import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface SolicitudSgp {
  id_solicitud?: number;
  numero_solicitud?: string;
  tipo_solicitud?: 'VENDEDOR' | 'PUNTO_VENTA' | 'AMBOS';
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
  estado_solicitud?: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';

  // Los hacemos OPCIONALES (?) para que no estorben en el módulo de solicitudes
  cerberus?: string;
  contratocodesa?: string;
  manager?: string;
  sinet?: string;
  jaspersoft?: string;
  sims?: string;
  cem?: string;
  onj?: string;
  visiapp?: string;
  papeleria?: string;
  superflex?: string;

  incidenteManager?: string;
  incidenteSinet?: string;
  incidenteJaspersoft?: string;
  incidenteSims?: string;
}
@Injectable({ providedIn: 'root' })
export class SgpService {
  private readonly URL_API = `${environment.apiUrlSgp}/solicitudes`;

  constructor(private http: HttpClient) { }

  /** * MÓDULO 1: SOLICITUDES (Creación)
   */
  crearSolicitud(datos: SolicitudSgp): Observable<any> {
    return this.http.post(this.URL_API, datos);
  }

  /** * MÓDULO 2: GESTIÓN (Aprobación/Rechazo)
   */
  
  // Trae solo los que tienen estado 'PENDIENTE'
  obtenerPendientes(): Observable<SolicitudSgp[]> {
    return this.http.get<SolicitudSgp[]>(`${this.URL_API}/pendientes`);
  }

  // Cambia el estado a 'APROBADO'
  aprobarSolicitud(id: number): Observable<any> {
    return this.http.patch(`${this.URL_API}/${id}/aprobar`, {});
  }

  // Cambia el estado a 'RECHAZADO' o elimina el registro
  rechazarSolicitud(id: number, motivo: string): Observable<any> {
    return this.http.patch(`${this.URL_API}/${id}/rechazar`, { motivo });
  }

  // En caso de que prefieras borrarla físicamente de la DB
  eliminarSolicitud(id: number): Observable<any> {
    return this.http.delete(`${this.URL_API}/${id}`);
  }

  /** * MÓDULO 3: CONTRATOS (Consulta y Cierre)
   */

  // Busca solicitudes APROBADAS por documento para cargar en Contratos
  obtenerHistorialPorDocumento(valor: string): Observable<SolicitudSgp[]> {
    return this.http.get<SolicitudSgp[]>(`${this.URL_API}/historial/${valor}`);
  }

  // Guarda el registro final en la tabla de producción
  guardarContratoFinal(datos: SolicitudSgp): Observable<any> {
    return this.http.post(`${this.URL_API}/finalizar`, datos);
  }
}