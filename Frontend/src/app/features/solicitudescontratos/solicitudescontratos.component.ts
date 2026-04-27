import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SgpService, SolicitudContrato } from '../../core/services/sgp.service';

@Component({
  selector: 'app-solicitudescontratos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './solicitudescontratos.component.html',
  styleUrls: ['./solicitudescontratos.component.css']
})
export class SolicitudesContratosComponent implements OnInit {
  
  modoActual: string = 'vendedor';

  // Modelo de la solicitud (Asegúrate que coincida con la Interface en sgp.service.ts)
  solicitud: SolicitudContrato = {
    tipo_solicitud: 'VENDEDOR',
    fecha: '', 
    documento: '', 
    nombre: '', 
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
    planVirtual: '---'
  };

  // Listas dinámicas para los selects
  gruposVentaDisponibles: string[] = [];
  liquidacionesDisponibles: string[] = [];
  cecosDisponibles: string[] = [];
  planesVirtualesOpciones: string[] = [];

  // DATA MASTER
  readonly dataZonas: any = {
    "CASANARE": this.getCasanareData(),
    "GUAVIARE": this.getGuaviareData(),
    "GUAINIA": this.getGuainiaData(),
    "ARAUCA": this.getAraucaData(),
    "SAN ANDRES": this.getSanAndresData()
  };

  readonly relacionZonasCosto: any = {
    "SAN ANDRES": ["2569 - PROVIDENCIA", "2570 - SAN ANDRES", "6875 - TESORERIA_SANANDRES", "17993 - CANAL VIRTUAL SAN ANDRES", "300066 - CENTRO DE DIAGNOSTICO SAI"],
    "CASANARE": ["2581 - AGUAZUL", "2582 - CHAMEZA", "2583 - CHAPARRERA", "2584 - HATO COROZAL", "2585 - LA SALINA", "2586 - MANI", "2587 - MONTERREY", "2588 - NUNCHIA", "2589 - OROCUE", "2590 - PAZ DE ARIPORO", "2591 - PORE", "2594 - SACAMA", "2595 - SAN LUIS DE PALENQUE", "2596 - TAURAMENA", "2597 - TRINIDAD", "2599 - CENTRO YOPAL", "2601 - SABANALARGA", "2602 - VILLANUEVA CAS", "3290 - LA 29", "3306 - TAMARA", "3310 - CASIMENA YOPAL", "3516 - ALGARROBO", "3550 - EL MORRO", "3810 - LA CAMPINA NUEVO", "6871 - TESORERIA_YOPAL", "6879 - TESORERIA_EE_CONAPUESTAS", "8134 - CIUDADELA LA BENDICION", "9230 - BOCAS DEL PAUTO", "17646 - PRINCIPAL CASANARE", "17986 - CANAL VIRTUAL CASANARE", "19922 - CARIBAYONA", "40607 - MONTANAS DEL TOTUMO", "43600 - CUPIAGUA", "250437 - CENTRO DE DIAGNOSTICO", "250470 - MOVIL CHANCE CASANARE"],
    "GUAINIA": ["2600 - INIRIDA", "4675 - BARRANCOMINAS", "8014 - SAN FELIPE", "17989 - CANAL VIRTUAL GUAINIA"],
    "GUAVIARE": ["2603 - CALAMAR", "2604 - CAPRICHO", "2606 - LIBERTAD", "2607 - MIRAFLORES", "2608 - RETORNO", "2609 - SAN JOSE", "5463 - SAN JOSE TAT", "6873 - TESORERIA_GUAVIARE", "17991 - CANAL VIRTUAL GUAVIARE", "40474 - EL BOQUERON", "300067 - CENTRO DE DIAGNOSTICO GUAVIARE"],
    "ARAUCA": ["3631 - ARAUCA", "3632 - CRAVONORTE", "3633 - SARAVENA", "3634 - ARAUQUITA", "3635 - FORTUL", "3636 - PTO RONDON", "3637 - TAME", "4683 - PANAMA", "4684 - PUEBLO NUEVO", "5241 - BOTALON", "6877 - TESORERIA_ARAUCA", "17984 - CANAL VIRTUAL ARAUCA", "45342 - EL OASIS", "300065 - CENTRO DE DIAGNOSTICO ARAUCA"]
  };

  // INYECTAMOS EL SERVICIO AQUÍ
  constructor(private sgpService: SgpService) {}

  ngOnInit() {
    this.solicitud.fecha = new Date().toISOString().split('T')[0];
  }

  cambiarModo(nuevoModo: string) {
    this.modoActual = nuevoModo;
    // IMPORTANTE: Actualizar el tipo de solicitud para el Backend
    this.solicitud.tipo_solicitud = nuevoModo === 'vendedor' ? 'VENDEDOR' : 'PUNTO_VENTA';
    this.limpiarResultados();
  }

  onZonaChange() {
    const zona = this.solicitud.zona;
    this.gruposVentaDisponibles = zona ? Object.keys(this.dataZonas[zona]) : [];
    this.cecosDisponibles = zona ? this.relacionZonasCosto[zona] || [] : [];
    
    this.solicitud.grupoVenta = '';
    this.solicitud.liquidacion = '';
    this.solicitud.ceco = '';
    this.limpiarResultados();
  }

  onGrupoChange() {
    const { zona, grupoVenta } = this.solicitud;
    this.liquidacionesDisponibles = (zona && grupoVenta) ? Object.keys(this.dataZonas[zona][grupoVenta]) : [];
    this.solicitud.liquidacion = '';
    this.limpiarResultados();
  }

  onLiquidacionChange() {
    const { zona, grupoVenta, liquidacion } = this.solicitud;
    if (zona && grupoVenta && liquidacion) {
      const final = this.dataZonas[zona][grupoVenta][liquidacion];
      this.solicitud.codigoSF = final.sf;

      if (Array.isArray(final.vr)) {
        this.planesVirtualesOpciones = final.vr;
        this.solicitud.planVirtual = ''; 
      } else {
        this.planesVirtualesOpciones = [];
        this.solicitud.planVirtual = final.vr;
      }
    } else {
      this.limpiarResultados();
    }
  }

  limpiarResultados() {
    this.solicitud.codigoSF = '---';
    this.solicitud.planVirtual = '---';
    this.planesVirtualesOpciones = [];
  }

  enviarSolicitud() {
    if (!this.solicitud.documento || this.solicitud.planVirtual === '---' || this.solicitud.planVirtual === '') {
      alert("⚠️ Por favor completa los datos obligatorios.");
      return;
    }

    // LLAMADA REAL AL BACKEND
    this.sgpService.crearSolicitud(this.solicitud).subscribe({
      next: (res) => {
        alert("✅ Solicitud enviada con éxito al SGP");
        console.log("Respuesta servidor:", res);
      },
      error: (err) => {
        alert("❌ Error al enviar la solicitud. Revisa la consola.");
        console.error(err);
      }
    });
  }

  // --- MÉTODOS DE DATOS (Tus funciones originales pasadas a TS) ---
  private getCasanareData() {
    const vNomina = ["50499 - PLAN COMISION ASESOR A NOMINA CASANARE", "50899 - PLAN GIROS A DOMICILIO CASANARE"];
    const vAmbulante = "50199 - COMISION ASESOR MOVIL AMBULANTE CASANARE";
    const vPtoFijo = "50299 - PLAN PTO FIJO ASESOR COMISION CASANARE";
    const vFranquicia = ["50399 - PLAN COMISION FRANQUICIAS CASANARE", "50599 - PLAN COMISION FRANQUICIA REC BETPLAY 0%"];
    const vComercio = ["50099 - PLAN COMISION COMERCIOS CASANARE", "50999 - COMISION ASESOR MOVIL AMBULANTE 5M"];

    return {
      "RSOC ADMINISTRATIVOS CON VTA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
      "RSOC AMBULANTE NOMINA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
      "RSOC PUNTO FIJO COMIS": { "QUINCENAL": { sf: "530 - SFLEX RSOC COM PTO FIJO NO DIARIO 12%CH 8%DBC 1%AST", vr: vPtoFijo } },
      "RSOC FRANQUICIA": { "QUINCENAL": { sf: "534 - SFLEX RSOC COMERCIOS NO DIARIO 12%CH 8%DBC 1%AST", vr: vFranquicia } },
      "RSOC COMERCIO": { "DIARIO": { sf: "590 - SFLEX RSOC COMERCIOS DIARIO 12%CH 8%DBC 1%AST", vr: vComercio } },
      "RSOC AMBULANTE COMISION": { 
        "DIARIO": { sf: "536 - SFLEX RSOC AMB DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante },
        "QUINCENAL": { sf: "574 - SFLEX RSOC AMB NO DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante }
      }
    };
  }
  private getGuainiaData() {
    const vNomina = [
        "52499 - PLAN COMISION ASESOR A NOMINA GUAINIA",
        "52799 - PLAN GIROS A DOMICILIO GUAINIA"
    ];
    const vAmbulante = "52199 - COMISION ASESOR MOVIL AMBULANTE GUAINIA";
    const vPtoFijo = "52299 - PLAN PTO FIJO ASESOR COMISION GUAINIA";
    const vFranquicia = "52399 - PLAN COMISION FRANQUICIAS COMERCIOS GUAINIA";
    const vComercio = "52099 - PLAN COMISION COMERCIOS GUAINIA";

    return {
        "RSOC ADMINISTRATIVOS CON VTA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC AMBULANTE NOMINA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC OPERATIVOS CON VTA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC PUNTO FIJO NOMIN": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC DOMICILIARIO NOMINA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC PUNTO FIJO COMIS": { "QUINCENAL": { sf: "530 - SFLEX RSOC COM PTO FIJO NO DIARIO 12%CH 8%DBC 1%AST", vr: vPtoFijo } },
        "RSOC FRANQUICIA": { "QUINCENAL": { sf: "534 - SFLEX RSOC COMERCIOS NO DIARIO 12%CH 8%DBC 1%AST", vr: vFranquicia } },
        "RSOC COMERCIO": { "DIARIO": { sf: "590 - SFLEX RSOC COMERCIOS DIARIO 12%CH 8%DBC 1%AST", vr: vComercio } },
        "RSOC AMBULANTE COMISION": { 
            "DIARIO": { sf: "536 - SFLEX RSOC AMB DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante },
            "QUINCENAL": { sf: "574 - SFLEX RSOC AMB NO DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante }
        },
        "RSOC VENTAS ESPECIALES": { "DIARIO": { sf: "536 - SFLEX RSOC AMB DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante } },
        "RSOC VEREDAS PT FIJO COMIS": { "QUINCENAL": { sf: "530 - SFLEX RSOC COM PTO FIJO NO DIARIO 12%CH 8%DBC 1%AST", vr: vPtoFijo } }
    };
}

private getGuaviareData() {
    const vNomina = [
        "53499 - PLAN COMISION ASESOR A NOMINA GUAVIARE",
        "53699 - PLAN GIROS A DOMICILIO GUAVIARE"
    ];
    const vAmbulante = "53199 - COMISION ASESOR MOVIL AMBULANTE GUAVIARE";
    const vPtoFijo = "53299 - PLAN PTO FIJO ASESOR COMISION GUAVIARE";
    const vFranquicia = [
        "53399 - PLAN COMISION FRANQUICIAS GUAVIARE",
        "534399 - PLAN COMISION FRANQUICIAS RETIRO 5M GUAVIARE",
        "53999 - PLAN COMISION FRANQUICIAS REC BETPLAY 0% GUAVIARE"
    ];
    const vComercio = [
        "53099 - PLAN COMISION COMERCIOS GUAVIARE",
        "53799 - PLAN COMISION COMERCIOS SIN BETPLAY"
    ];

    return {
        "RSOC ADMINISTRATIVOS CON VTA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC AMBULANTE NOMINA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC OPERATIVOS CON VTA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC PUNTO FIJO NOMIN": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC DOMICILIARIO NOMINA": { "QUINCENAL": { sf: "561 - SFLEX RSOC NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC PUNTO FIJO COMIS": { "QUINCENAL": { sf: "530 - SFLEX RSOC COM PTO FIJO NO DIARIO 12%CH 8%DBC 1%AST", vr: vPtoFijo } },
        "RSOC FRANQUICIA": { "QUINCENAL": { sf: "534 - SFLEX RSOC COMERCIOS NO DIARIO 12%CH 8%DBC 1%AST", vr: vFranquicia } },
        "RSOC COMERCIO": { "DIARIO": { sf: "590 - SFLEX RSOC COMERCIOS DIARIO 12%CH 8%DBC 1%AST", vr: vComercio } },
        "RSOC AMBULANTE COMISION": { 
            "DIARIO": { sf: "536 - SFLEX RSOC AMB DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante },
            "QUINCENAL": { sf: "574 - SFLEX RSOC AMB NO DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante }
        },
        "RSOC VENTAS ESPECIALES": { "DIARIO": { sf: "536 - SFLEX RSOC AMB DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante } },
        "RSOC VEREDAS PT FIJO COMIS": { "QUINCENAL": { sf: "530 - SFLEX RSOC COM PTO FIJO NO DIARIO 12%CH 8%DBC 1%AST", vr: vPtoFijo } }
    };
}

private getSanAndresData() {
    const vNomina = [
        "51399 - PLAN COMISION ASESOR A NOMINA SAN ANDRES",
        "52599 - PLAN GIROS A DOMICILIO SAN ANDRES"
    ];
    const vAmbulante = "51099 - COMISION ASESOR MOVIL AMBULANTE SAN ANDRES";
    const vFranquicia = "51299 - PLAN COMISION FRANQUICIAS SAN ANDRES";
    const vComercio = "51199 - PLAN COMISION COMERCIOS SAN ANDRES";

    return {
        "RSOC ADMINISTRATIVOS CON VTA": { "QUINCENAL": { sf: "542 - SFLEX SAN ANDRES SIN COMISION", vr: vNomina } },
        "RSOC AMBULANTE NOMINA": { "QUINCENAL": { sf: "542 - SFLEX SAN ANDRES SIN COMISION", vr: vNomina } },
        "RSOC OPERATIVOS CON VTA": { "QUINCENAL": { sf: "542 - SFLEX SAN ANDRES SIN COMISION", vr: vNomina } },
        "RSOC PUNTO FIJO NOMIN": { "QUINCENAL": { sf: "542 - SFLEX SAN ANDRES SIN COMISION", vr: vNomina } },
        "RSOC DOMICILIARIO NOMINA": { "QUINCENAL": { sf: "542 - SFLEX SAN ANDRES SIN COMISION", vr: vNomina } },
        "RSOC FRANQUICIA": { "QUINCENAL": { sf: "569 - SFLEX SAI COMERCIOS NO DIARIO 12%CH 1%DBC 1%AST", vr: vFranquicia } },
        "RSOC COMERCIO": { "DIARIO": { sf: "524 - SFLEX SAI COMERCIOS DIARIO CH12% OTROS 8% ASTRO 1%", vr: vComercio } },
        "RSOC AMBULANTE COMISION": { "DIARIO": { sf: "540 - SFLEX SAI AMB DIARIO 20%CH 8%DBC 1%ASTR", vr: vAmbulante } },
        "RSOC VENTAS ESPECIALES": { "DIARIO": { sf: "536 - SFLEX RSOC AMB DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante } },
        "RSOC VEREDAS PT FIJO COMIS": { "QUINCENAL": { sf: "542 - SFLEX SAN ANDRES SIN COMISION", vr: vNomina } }
    };
}

// Arauca (No suministraste tabla virtual, mantengo la estructura por si la quieres llenar luego)
private getAraucaData() {
    const vNomina = [
        "54499 - PLAN COMISION ASESOR A NOMINA ARAUCA","54899 - PLAN GIROS A DOMICILIO ARAUCA"];
    const vAmbulante = ["54199 - COMISION ASESOR MOVIL AMBULANTE ARAUCA","544599 - COMISION AMBULANTE ARAUCA REC BETPLAY 3M"];
    const vPtoFijo = "54299 - PLAN PTO FIJO ASESOR COMISION ARAUCA";
    const vFranquicia = [
        "54399 - PLAN COMISION FRANQUICIAS - ARAUCA",
        "544399 - PLAN COMISION FRANQUICIAS CON RETIRO - ARAUCA",
        "544499 - PLAN COMISION FRANQUICIAS REC BETPLAY 0%",
        "73099 - PLAN COMISION FRANQUICIAS REC BETPLAY 2% - ARAUCA"
    ];
    const vComercio = [
        "54099 - PLAN COMISION COMERCIOS ARAUCA",
        "544299 - PLAN COMISION COMERCIOS BETPLAY 2%",
        "54599 -PLAN COMISION COMERCIOS 1.5 MILLONES ARAUCA",
        "54999 - PLAN COMISION COMERCION SIN BETPLAY"
    ];
    return {
        "RSOC ADMINISTRATIVOS CON VTA": { "QUINCENAL": { sf: "39 - SFLEX ARAUCA NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC AMBULANTE NOMINA": { "QUINCENAL": { sf: "39 - SFLEX ARAUCA NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC OPERATIVOS CON VTA": { "QUINCENAL": { sf: "39 - SFLEX ARAUCA NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC PUNTO FIJO NOMIN": { "QUINCENAL": { sf: "39 - SFLEX ARAUCA NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC DOMICILIARIO NOMINA": { "QUINCENAL": { sf: "39 - SFLEX ARAUCA NOMINA PTO FIJO AST 0.5%", vr: vNomina } },
        "RSOC PUNTO FIJO COMIS": { "QUINCENAL": { sf: "34 - SFLEX ARAUCA COM PTO FIJO NO DIARIO 12%CH 8%DBC 1%AST", vr: vPtoFijo } },
        "RSOC FRANQUICIA": { "QUINCENAL": { sf: "35 - SFLEX ARAUCA COMERCIOS NO DIARIO 12%CH 8%DBC 1%AST", vr: vFranquicia } },
        "RSOC COMERCIO": { "DIARIO": { sf: "32 - ARAUCA COMERCIOS DIARIO 12%CH 8%DBC 1%AST", vr: vComercio } },
        "RSOC AMBULANTE COMISION": { 
            "DIARIO": { sf: "537 - SFLEX ARAUCA AMB DIARIO 17%CH 8%DBC 1%ASTR", vr: vAmbulante },
            "QUINCENAL": { sf: "541 - SFLEX ARAUCA AMB NO DIARIO 17%CH 8%DBC 1%ASTR", vr: vAmbulante }
        },
        "RSOC VENTAS ESPECIALES": { "DIARIO": { sf: "536 - SFLEX RSOC AMB DIARIO 15%CH 8%DBC 1%ASTR", vr: vAmbulante } },
        "RSOC VEREDAS PT FIJO COMIS": { "QUINCENAL": { sf: "34 - SFLEX ARAUCA COM PTO FIJO NO DIARIO 12%CH 8%DBC 1%AST", vr: vPtoFijo } }
    };
}

}