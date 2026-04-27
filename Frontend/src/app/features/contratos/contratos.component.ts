import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SgpService, SolicitudContrato } from '../../core/services/sgp.service';

@Component({
  selector: 'app-contratos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  // TIENEN QUE COINCIDIR CON LA IMAGEN:
  templateUrl: './creacion-contratos.component.html', 
  styleUrls: ['./creacion-contratos.component.css']
})
export class ContratosComponent implements OnInit {
  pasoActual = 1;
  totalPasos = 15;

  // Objeto central de datos (Model)
  datosContrato: any = {
    fecha: '', ticket: '', documento: '', usuario: '',
    grupoVentas: '---', zona: '---', c_costo: '---', tipocaja: '---',
    cerberus: '---', contratocodesa: '---', manager: '---', sinet: '---',
    jaspersoft: '---', sims: '---', cem: '---', onj: '---',
    visiapp: '---', papeleria: '---', superflex: '---',
    incidenteManager: '', incidenteSinet: '', incidenteJasper: '', incidenteSims: ''
  };

  readonly relacionZonasCosto: any = {
    "SAN ANDRES": ["2569 - PROVIDENCIA", "2570 - SAN ANDRES", "6875 - TESORERIA_SANANDRES", "17993 - CANAL VIRTUAL SAN ANDRES", "300066 - CENTRO DE DIAGNOSTICO SAI"],
    "CASANARE": ["2581 - AGUAZUL", "2582 - CHAMEZA", "2583 - CHAPARRERA", "2584 - HATO COROZAL", "2585 - LA SALINA", "2586 - MANI", "2587 - MONTERREY", "2588 - NUNCHIA", "2589 - OROCUE", "2590 - PAZ DE ARIPORO", "2591 - PORE", "2594 - SACAMA", "2595 - SAN LUIS DE PALENQUE", "2596 - TAURAMENA", "2597 - TRINIDAD", "2599 - CENTRO YOPAL", "2601 - SABANALARGA", "2602 - VILLANUEVA CAS", "3290 - LA 29", "3306 - TAMARA", "3310 - CASIMENA YOPAL", "3516 - ALGARROBO", "3550 - EL MORRO", "3810 - LA CAMPINA NUEVO", "6871 - TESORERIA_YOPAL", "6879 - TESORERIA_EE_CONAPUESTAS", "8134 - CIUDADELA LA BENDICION", "9230 - BOCAS DEL PAUTO", "17646 - PRINCIPAL CASANARE", "17986 - CANAL VIRTUAL CASANARE", "19922 - CARIBAYONA", "40607 - MONTANAS DEL TOTUMO", "43600 - CUPIAGUA", "250437 - CENTRO DE DIAGNOSTICO", "250470 - MOVIL CHANCE CASANARE"],
    "GUAINIA": ["2600 - INIRIDA", "4675 - BARRANCOMINAS", "8014 - SAN FELIPE", "17989 - CANAL VIRTUAL GUAINIA"],
    "GUAVIARE": ["2603 - CALAMAR", "2604 - CAPRICHO", "2606 - LIBERTAD", "2607 - MIRAFLORES", "2608 - RETORNO", "2609 - SAN JOSE", "5463 - SAN JOSE TAT", "6873 - TESORERIA_GUAVIARE", "17991 - CANAL VIRTUAL GUAVIARE", "40474 - EL BOQUERON", "300067 - CENTRO DE DIAGNOSTICO GUAVIARE"],
    "ARAUCA": ["3631 - ARAUCA", "3632 - CRAVONORTE", "3633 - SARAVENA", "3634 - ARAUQUITA", "3635 - FORTUL", "3636 - PTO RONDON", "3637 - TAME", "4683 - PANAMA", "4684 - PUEBLO NUEVO", "5241 - BOTALON", "6877 - TESORERIA_ARAUCA", "17984 - CANAL VIRTUAL ARAUCA", "45342 - EL OASIS", "300065 - CENTRO DE DIAGNOSTICO ARAUCA"]
  };

  centrosCostoFiltrados: string[] = [];

  ngOnInit() {
    this.datosContrato.fecha = new Date().toISOString().split('T')[0];
  }

  // --- PEGADO INTELIGENTE ---
  procesarPegado(event: any) {
    const input = event.target.value;
    const lineas = input.split('\n').map((l: string) => l.trim()).filter((l: string) => l !== '');
    if (lineas.length >= 3) {
      this.datosContrato.ticket = lineas[0];
      this.datosContrato.documento = lineas[1];
      this.datosContrato.usuario = lineas[2];
      event.target.value = ''; // Limpia el área
    }
  }

  // --- STEPPER LOGIC ---
  seleccionar(campo: string, valor: string) {
    this.datosContrato[campo] = valor;
    if (campo === 'zona') {
      this.centrosCostoFiltrados = this.relacionZonasCosto[valor] || [];
      this.datosContrato.c_costo = ''; // Reset CECO
    }
    this.siguiente();
  }

  siguiente() { if (this.pasoActual < this.totalPasos) this.pasoActual++; }
  anterior() { if (this.pasoActual > 1) this.pasoActual--; }

  guardar() {
    console.log("Contrato Final:", this.datosContrato);
    alert("¡Contrato enviado con éxito a la base de datos!");
  }
}