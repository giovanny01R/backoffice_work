import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SgpService, SolicitudSgp } from '../../core/services/sgp.service';

@Component({
  selector: 'app-gestion-solicitudes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestionsolicitudes.component.html',
  styleUrls: ['./gestionsolicitudes.component.css']
})
export class GestionSolicitudesComponent implements OnInit {

  pendientes: SolicitudSgp[] = [];
  seleccionada: SolicitudSgp | null = null;
  cargando: boolean = false;

  constructor(private sgpService: SgpService) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.cargando = true;
    this.sgpService.obtenerPendientes().subscribe({
      next: (res) => {
        this.pendientes = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
      }
    });
  }

  verDetalles(item: SolicitudSgp) {
    this.seleccionada = item;
  }

  aprobar() {
    if (!this.seleccionada?.id_solicitud) return;

    if (confirm(`¿Confirmas la aprobación de ${this.seleccionada.nombre}?`)) {
      this.sgpService.aprobarSolicitud(this.seleccionada.id_solicitud).subscribe({
        next: () => {
          alert("✅ Solicitud Aprobada. Ya disponible en el módulo de Contratos.");
          this.seleccionada = null;
          this.cargarPendientes();
        },
        error: (err) => alert("❌ Error al aprobar")
      });
    }
  }

  rechazar() {
    if (!this.seleccionada?.id_solicitud) return;

    const motivo = prompt("Indique el motivo del rechazo:");
    if (motivo) {
      // Usamos el método eliminar o uno de actualizar estado a RECHAZADO
      this.sgpService.eliminarSolicitud(this.seleccionada.id_solicitud).subscribe({
        next: () => {
          alert("🚫 Solicitud Rechazada y eliminada de la lista.");
          this.seleccionada = null;
          this.cargarPendientes();
        }
      });
    }
  }
}