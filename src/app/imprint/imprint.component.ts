import { Component } from '@angular/core';

@Component({
  selector: 'app-imprint',
  imports: [],
  template: `
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Impressum</h2>
      <address>
        <strong>Maximilian Walterskirchen</strong><br />
        c/o F2BII E-Commerce#296<br />
        Hintergoldingerstrasse 30<br />
        8638 Goldingen<br />
      </address>
      <a href="mailto:contact@mwalterskirchen.dev" class="link link-primary"
        >contact@mwalterskirchen.dev</a
      >
    </div>
  `,
})
export class ImprintComponent {}
