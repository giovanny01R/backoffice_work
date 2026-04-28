import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SgpService, SolicitudSgp } from '../../core/services/sgp.service';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {
  pasoActual: number = 5;
  busquedaCedula: string = ''; 
  
contrato: SolicitudSgp = {
    fecha: '',
    documento: '',
    nombre: '',
    numero_solicitud: '',
    tipo_solicitud: 'VENDEDOR',
    fechaNac: '',
    fechaExpedicion: '',
    direccion: '',
    telefono: '',
    correo: '',
    zona: '',
    rol: '',
    grupoVenta: '',
    liquidacion: '',
    ceco: '',
    codigoSF: '---',
    planVirtual: '---',
    
    // --- LOS 11 APLICATIVOS (Iniciados en '---') ---
    cerberus: '---',
    contratocodesa: '---',
    manager: '---',
    sinet: '---',
    jaspersoft: '---',
    sims: '---',
    cem: '---',
    onj: '---',
    visiapp: '---',
    papeleria: '---',
    superflex: '---',

    // --- INCIDENTES ---
    incidenteManager: '',
    incidenteSinet: '',
    incidenteJaspersoft: '',
    incidenteSims: ''
  };

  constructor(private sgpService: SgpService) {}

  ngOnInit(): void {
    // Inicializamos la fecha del sistema
    this.contrato.fecha = new Date().toISOString().split('T')[0];
  }

  /**
   * BUSCADOR: Consulta la base de datos de solicitudes iniciales
   */
  consultarCedula(): void {
    if (!this.busquedaCedula) {
      alert("⚠️ Ingresa una cédula para consultar.");
      return;
    }

    this.sgpService.obtenerHistorialPorDocumento(this.busquedaCedula).subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          const infoSgp = res[0];
          
          // Mantenemos los aplicativos en '---' pero cargamos la info del usuario
          this.contrato = { 
            ...this.contrato, // Conserva los valores por defecto (---)
            ...infoSgp        // Sobrescribe con los datos reales de la solicitud
          };
          
          this.pasoActual = 5; // Reseteamos al primer paso técnico
          alert(`✅ Datos recuperados de: ${this.contrato.nombre}`);
        } else {
          alert("❌ No se encontró ninguna solicitud aprobada para esta cédula.");
        }
      },
      error: (err) => {
        console.error("Error en la consulta:", err);
        alert("❌ Error de conexión al servidor.");
      }
    });
  }

  /**
   * Maneja la selección de perfiles en cada paso del stepper
   */
  seleccionar(campo: keyof SolicitudSgp, valor: string): void {
    (this.contrato as any)[campo] = valor;
    
    // Si la opción requiere escribir un ticket, no avanzamos automáticamente
    if (valor !== 'PENDIENTE') {
      this.siguiente();
    }
  }

  // Navegación del Stepper
  siguiente(): void {
    if (this.pasoActual < 15) {
      this.pasoActual++;
    }
  }

  atras(): void {
    if (this.pasoActual > 5) {
      this.pasoActual--;
    }
  }

  /**
   * GUARDAR: Envía el contrato final con todos los aplicativos a la tabla de producción
   */
  guardarTablaFinal(): void {
    // Validación mínima antes de enviar
    if (!this.contrato.documento) {
      alert("⚠️ No hay ningún usuario cargado para finalizar.");
      return;
    }

    this.sgpService.guardarContratoFinal(this.contrato).subscribe({
      next: (res) => {
        alert("🚀 ¡Contrato finalizado y guardado con éxito en Producción!");
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error("Error al guardar contrato final:", err);
        alert("❌ Hubo un error al intentar guardar el contrato.");
      }
    });
  }

  /**
   * Limpia el formulario para una nueva gestión
   */
  limpiarFormulario(): void {
    this.busquedaCedula = '';
    this.pasoActual = 5;
    this.contrato = {
      fecha: new Date().toISOString().split('T')[0],
      documento: '',
    nombre: '',
    numero_solicitud: '',
    tipo_solicitud: 'VENDEDOR',
    fechaNac: '',
    fechaExpedicion: '',
    direccion: '',
    telefono: '',
    correo: '',
    zona: '',
    rol: '',
    grupoVenta: '',
    liquidacion: '',
    ceco: '',
    codigoSF: '---',
    planVirtual: '---',
    
    // --- LOS 11 APLICATIVOS (Iniciados en '---') ---
    cerberus: '---',
    contratocodesa: '---',
    manager: '---',
    sinet: '---',
    jaspersoft: '---',
    sims: '---',
    cem: '---',
    onj: '---',
    visiapp: '---',
    papeleria: '---',
    superflex: '---',

    // --- INCIDENTES ---
    incidenteManager: '',
    incidenteSinet: '',
    incidenteJaspersoft: '',
    incidenteSims: ''
    };
  }
}