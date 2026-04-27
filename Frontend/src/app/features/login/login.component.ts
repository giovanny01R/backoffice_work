import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Servicios corregidos
import { ApiService } from '../../core/services/api.service'; // Visitas (Puerto 3000)
import { SgpService } from '../../core/services/sgp.service'; // SGP (Puerto 3001)

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="bg-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>

      <div class="login-wrapper">
        <div class="login-card">
          <div class="brand">
            <div class="brand-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="10" rx="2" fill="white"/>
                <path d="M8 11V7a4 4 0 018 0v4" stroke="white" stroke-width="2.2" stroke-linecap="round" fill="none"/>
                <circle cx="12" cy="16" r="1.6" fill="#4361ee"/>
              </svg>
            </div>
            <h1>Backoffice RSOC</h1>
            <p>Sistema de herramientas Corporativas</p>
          </div>

          <div class="divider"></div>

          <form (ngSubmit)="onLogin()" autocomplete="off" #loginForm="ngForm">
            <div class="field">
              <label>Usuario</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                </svg>
                <input type="text" [(ngModel)]="username" name="username" placeholder="Ingrese su usuario" required [class.has-error]="error">
              </div>
            </div>

            <div class="field">
              <label>Contraseña</label>
              <div class="input-wrap">
                <svg class="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.8"/>
                  <path d="M8 11V7a4 4 0 018 0v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
                </svg>
                <input type="password" [(ngModel)]="password" name="password" placeholder="••••••••" required [class.has-error]="error">
              </div>
            </div>

            <div *ngIf="error" class="error-msg">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ error }}
            </div>

            <button type="submit" class="btn-login" [disabled]="cargando || !loginForm.valid">
              <span *ngIf="!cargando">Ingresar al sistema</span>
              <span *ngIf="cargando" class="btn-loading">
                <svg class="spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="white" stroke-width="2.5" stroke-dasharray="40 20" stroke-linecap="round"/>
                </svg>
                Verificando...
              </span>
            </button>
          </form>

          <p class="footer-text">Red Orinoquía y Caribe &nbsp;·&nbsp; v1.0</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Tu CSS de partículas y diseño moderno se mantiene igual */
    .login-page { min-height: 100vh; background: linear-gradient(135deg, #0d0d1a 0%, #131d35 50%, #0a2040 100%); display: flex; align-items: center; justify-content: center; font-family: 'Segoe UI', system-ui, sans-serif; position: relative; overflow: hidden; }
    .bg-shapes { position: absolute; inset: 0; pointer-events: none; }
    .shape { position: absolute; border-radius: 50%; opacity: 0.06; }
    .shape-1 { width: 500px; height: 500px; background: #4361ee; top: -200px; right: -100px; }
    .shape-2 { width: 300px; height: 300px; background: #7b8cde; bottom: -100px; left: -80px; }
    .shape-3 { width: 200px; height: 200px; background: #4361ee; bottom: 120px; right: 80px; }
    .login-wrapper { position: relative; z-index: 1; width: 100%; max-width: 400px; padding: 0 20px; }
    .login-card { background: rgba(255, 255, 255, 0.97); border-radius: 20px; padding: 40px 36px 32px; box-shadow: 0 32px 64px rgba(0,0,0,0.4); }
    .brand { text-align: center; margin-bottom: 24px; }
    .brand-icon { width: 60px; height: 60px; border-radius: 16px; background: linear-gradient(135deg, #4361ee, #3451d1); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; box-shadow: 0 8px 24px rgba(67,97,238,0.35); }
    .brand h1 { font-size: 1.25rem; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
    .brand p { font-size: 0.8rem; color: #888; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, #e0e0e0, transparent); margin-bottom: 24px; }
    .field { margin-bottom: 16px; }
    .field label { display: block; font-size: 0.75rem; font-weight: 600; color: #555; text-transform: uppercase; margin-bottom: 6px; }
    .input-wrap { position: relative; }
    .input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #aaa; }
    .input-wrap input { width: 100%; padding: 11px 14px 11px 40px; font-size: 0.9rem; color: #1a1a2e; background: #f8f9fc; border: 1.5px solid #e8eaf0; border-radius: 10px; outline: none; }
    .input-wrap input:focus { border-color: #4361ee; background: white; box-shadow: 0 0 0 3px rgba(67,97,238,0.1); }
    .input-wrap input.has-error { border-color: #e53e3e; }
    .error-msg { display: flex; align-items: center; gap: 7px; background: #fff5f5; color: #c53030; border: 1px solid #feb2b2; border-radius: 8px; padding: 9px 12px; font-size: 0.82rem; margin-bottom: 14px; }
    .btn-login { width: 100%; padding: 13px; background: linear-gradient(135deg, #4361ee, #3451d1); color: white; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 16px rgba(67,97,238,0.35); }
    .btn-loading { display: flex; align-items: center; justify-content: center; gap: 8px; }
    .spin { animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .footer-text { text-align: center; font-size: 0.72rem; color: #bbb; margin-top: 20px; }
  `]
})
export class LoginComponent {
  username = '';
  password = '';
  cargando = false;
  error = '';

  constructor(
    private apiService: ApiService, // Visitas (Corregido)
    private sgpService: SgpService, // SGP
    private router: Router
  ) {}

  onLogin(): void {
    if (!this.username || !this.password) return;

    this.cargando = true;
    this.error = '';

    /**
     * 1. LIDER: Intentamos el login en Visitas (Puerto 3000)
     * Enviamos los parámetros por separado como pide tu ApiService
     */
    this.apiService.login(this.username, this.password).subscribe({
      next: (resVisitas) => {
        console.log('✅ Acceso concedido a Visitas');
        
        // Guardamos el token de visitas (opcional si el servicio no lo hace)
        localStorage.setItem('token', resVisitas.token);
        localStorage.setItem('usuario', JSON.stringify(resVisitas.usuario));

        /**
         * 2. SEGUIDOR: Intentamos el login en SGP (Puerto 3001) de forma silenciosa
         */
        this.sgpService.loginSgp({ username: this.username, password: this.password }).subscribe({
          next: () => console.log('✅ Acceso concedido al SGP (Token guardado)'),
          error: () => console.log('ℹ️ Usuario sin cuenta en SGP o servidor 3001 apagado')
        });

        this.cargando = false;
        this.router.navigate(['/inicio']); // Navegamos al Home
      },
      error: (err) => {
        this.cargando = false;
        this.error = 'Usuario o contraseña inválidos.';
        console.error('Error en ApiService:', err);
      }
    });
  }
}