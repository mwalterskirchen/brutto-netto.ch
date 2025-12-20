import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  template: `
    <footer class="footer footer-center p-4 bg-base-300 text-base-content flex flex-col gap-4">
      <div class="flex gap-4">
        <a [routerLink]="['/impressum']">Impressum</a>
        <a [routerLink]="['/datenschutz']">Datenschutz</a>
        <a [routerLink]="['/haftungsausschluss']">Haftungsausschluss</a>
      </div>
      <div>
        <p>Mit ❤️ us Züri für d'Schwiz 🇨🇭</p>
      </div>
    </footer>
  `,
})
export class Footer {}
