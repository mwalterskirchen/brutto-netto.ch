import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-root',
  imports: [Footer, RouterOutlet, RouterLink],
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
        <p class="text-lg max-w-3xl mx-auto">
          Berechnen Sie Ihren <strong>Nettolohn</strong> aus dem <strong>Bruttolohn</strong> mit
          allen Schweizer Abzügen (AHV, IV, EO, ALV, BVG, NBU). Kostenloser Online-Lohnrechner
          <strong>2026</strong>.
        </p>
      </header>

      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
    </div>
  `,
})
export class App {}
