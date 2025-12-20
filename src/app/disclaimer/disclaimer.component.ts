import { Component } from '@angular/core';

@Component({
  selector: 'app-disclaimer',
  imports: [],
  template: `
    <div class="max-w-3xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">Haftungsausschluss</h2>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Keine Gewährleistung</h3>
        <p class="text-base-content/80 leading-relaxed">
          Die Berechnungen des Brutto-Netto-Rechners dienen ausschliesslich zu Informationszwecken
          und stellen keine rechtsverbindliche Auskunft dar. Obwohl wir uns bemühen, die
          Berechnungen so genau wie möglich durchzuführen, können wir keine Gewähr für die
          Richtigkeit, Vollständigkeit und Aktualität der Ergebnisse übernehmen.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Haftungsausschluss</h3>
        <p class="text-base-content/80 leading-relaxed">
          Der Betreiber dieser Website haftet nicht für Schäden, die durch die Nutzung oder
          Nichtnutzung der bereitgestellten Informationen und Berechnungen entstehen. Dies gilt
          insbesondere für finanzielle Entscheidungen, die auf Grundlage der hier angezeigten
          Ergebnisse getroffen werden.
        </p>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Abweichungen möglich</h3>
        <p class="text-base-content/80 leading-relaxed">
          Die tatsächlichen Steuer- und Sozialversicherungsabzüge können von den berechneten Werten
          abweichen. Dies kann unter anderem folgende Gründe haben:
        </p>
        <ul class="list-disc list-inside mt-2 text-base-content/80 space-y-1">
          <li>Änderungen der Steuergesetze oder Abgabesätze</li>
          <li>Kantonale und kommunale Unterschiede</li>
          <li>Individuelle Faktoren, die nicht berücksichtigt werden</li>
          <li>Rundungsdifferenzen</li>
        </ul>
      </section>

      <section class="mb-6">
        <h3 class="text-lg font-semibold mb-2">Empfehlung</h3>
        <p class="text-base-content/80 leading-relaxed">
          Für verbindliche Auskünfte wenden Sie sich bitte an Ihre zuständige Steuerbehörde, Ihre
          Ausgleichskasse oder einen qualifizierten Steuerberater. Die Ergebnisse dieses Rechners
          ersetzen keine professionelle Beratung.
        </p>
      </section>
    </div>
  `,
})
export class DisclaimerComponent {}
