import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [FooterComponent, RouterOutlet, RouterLink],
  template: `
    <div class="container mx-auto p-4 min-h-screen flex flex-col gap-6">
      <header class="text-center mb-2">
        <a [routerLink]="['/']">
          <picture>
            <source srcset="/logo_white.svg" media="(prefers-color-scheme: dark)" />
            <img src="/logo.svg" alt="Brutto Netto Rechner Schweiz 🇨🇭" class="w-72 mx-auto" />
          </picture>
        </a>
        <h1 class="sr-only">Brutto Netto Lohnrechner Schweiz 2026</h1>
        <p class="text-lg max-w-3xl mx-auto mb-4">
          Wieviel bleibt von Ihrem Lohn? <br />
          Berechnen Sie Ihren <strong>Nettolohn</strong>: schnell, präzise und ohne Datenweitergabe.
        </p>
        <div class="flex flex-wrap justify-center gap-2 text-sm">
          <span class="badge badge-outline p-4 gap-1">🔒 100% privat</span>
          <span class="badge badge-outline p-4 gap-1">📖 Open Source</span>
          <span class="badge badge-outline p-4 gap-1">✨ Kostenlos</span>
        </div>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class App {}
