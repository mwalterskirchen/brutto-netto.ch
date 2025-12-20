import { Component, inject } from '@angular/core';
import { TaxCalculatorService } from '../services/tax-calculator.service';
import { CalculatorComponent } from '../calculator/calculator';

@Component({
  selector: 'app-index',
  imports: [CalculatorComponent],
  template: `
    <app-calculator />

    <section class="max-w-4xl mx-auto mt-12 mb-8 prose prose-sm">
      <h2 class="text-2xl font-bold mb-4">Brutto Netto Rechner Schweiz – So funktioniert's</h2>
      <p>
        Der <strong>Brutto Netto Rechner</strong> ist ein kostenloser Online-Lohnrechner und
        Gehaltsrechner für die Schweiz. Er berechnet präzise Ihren <strong>Nettolohn</strong> aus
        dem <strong>Bruttolohn</strong> unter Berücksichtigung aller relevanten Schweizer Abzüge.
      </p>
      <p>Unser Rechner berücksichtigt folgende Sozialversicherungsabzüge:</p>
      <ul class="list-disc pl-6 mb-4">
        <li>
          <strong>AHV/IV/EO</strong> (Alters- und Hinterlassenenversicherung, Invalidenversicherung,
          Erwerbsersatzordnung)
        </li>
        <li><strong>ALV</strong> (Arbeitslosenversicherung)</li>
        <li><strong>BVG</strong> (Pensionskasse / 2. Säule)</li>
        <li><strong>NBU</strong> (Nichtberufsunfallversicherung)</li>
        <li><strong>KTG</strong> (Krankentaggeldversicherung, optional)</li>
      </ul>
      <p>
        Ideal für Arbeitnehmer und Arbeitgeber in allen Kantonen der Schweiz – ob Zürich, Basel,
        Bern, Luzern, St.Gallen oder Genf. Der Lohnrechner ist aktuell für das Jahr
        <strong>2026</strong>
        und verwendet die neuesten Beitragssätze.
      </p>
    </section>

    <section class="max-w-4xl mx-auto mt-8 mb-8">
      <h2 class="text-2xl font-bold mb-6 text-center">Häufig gestellte Fragen (FAQ)</h2>
      <div class="space-y-4">
        <details class="collapse collapse-plus bg-base-200">
          <summary class="collapse-title text-lg font-medium">
            Was ist der Unterschied zwischen Brutto und Netto Lohn?
          </summary>
          <div class="collapse-content">
            <p class="pt-2">
              Der <strong>Bruttolohn</strong> ist Ihr Gehalt vor Abzügen. Der
              <strong>Nettolohn</strong>
              ist der Betrag, der nach Abzug aller Sozialversicherungsbeiträge (AHV, IV, EO, ALV,
              BVG, NBU) auf Ihr Bankkonto überwiesen wird.
            </p>
          </div>
        </details>

        <details class="collapse collapse-plus bg-base-200">
          <summary class="collapse-title text-lg font-medium">
            Welche Abzüge werden in der Schweiz vom Lohn abgezogen?
          </summary>
          <div class="collapse-content">
            <p class="pt-2">
              In der Schweiz werden folgende Sozialversicherungsbeiträge vom Bruttolohn abgezogen:
              AHV/IV/EO (ca. 5.3%), ALV (1.1% bis 148'200 CHF Jahreslohn), BVG/Pensionskasse
              (altersabhängig), NBU (ca. 1-3%) und optional KTG (Krankentaggeldversicherung).
            </p>
          </div>
        </details>

        <details class="collapse collapse-plus bg-base-200">
          <summary class="collapse-title text-lg font-medium">
            Ist der Brutto Netto Rechner kostenlos?
          </summary>
          <div class="collapse-content">
            <p class="pt-2">
              Ja, unser Brutto Netto Rechner ist <strong>100% kostenlos</strong> und kann ohne
              Registrierung oder Anmeldung genutzt werden. Sie können beliebig viele Berechnungen
              durchführen.
            </p>
          </div>
        </details>

        <details class="collapse collapse-plus bg-base-200">
          <summary class="collapse-title text-lg font-medium">
            Gilt der Rechner für alle Kantone in der Schweiz?
          </summary>
          <div class="collapse-content">
            <p class="pt-2">
              Ja, die <strong>Sozialversicherungsbeiträge</strong> (AHV, IV, ALV, BVG) sind in der
              ganzen Schweiz einheitlich. Der Rechner gilt für alle Kantone wie Zürich, Basel, Bern,
              Luzern, Aargau, St.Gallen, Genf, Waadt und alle weiteren Kantone. Beachten Sie jedoch,
              dass Steuern kantonal unterschiedlich sind und hier nicht berücksichtigt werden.
            </p>
          </div>
        </details>

        <details class="collapse collapse-plus bg-base-200">
          <summary class="collapse-title text-lg font-medium">Was ist der 13. Monatslohn?</summary>
          <div class="collapse-content">
            <p class="pt-2">
              Der <strong>13. Monatslohn</strong> ist eine zusätzliche Lohnzahlung, die viele
              Schweizer Arbeitgeber Ende Jahr ausrichten. Er entspricht in der Regel einem vollen
              Monatslohn und ist ebenfalls sozialversicherungspflichtig. In unserem Rechner können
              Sie aktivieren, ob Sie einen 13. Monatslohn erhalten.
            </p>
          </div>
        </details>
      </div>
    </section>

    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Was ist der Unterschied zwischen Brutto und Netto Lohn?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Der Bruttolohn ist Ihr Gehalt vor Abzügen. Der Nettolohn ist der Betrag, der nach Abzug aller Sozialversicherungsbeiträge (AHV, IV, EO, ALV, BVG, NBU) auf Ihr Bankkonto überwiesen wird."
            }
          },
          {
            "@type": "Question",
            "name": "Welche Abzüge werden in der Schweiz vom Lohn abgezogen?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In der Schweiz werden folgende Sozialversicherungsbeiträge vom Bruttolohn abgezogen: AHV/IV/EO (ca. 5.3%), ALV (1.1% bis 148'200 CHF Jahreslohn), BVG/Pensionskasse (altersabhängig), NBU (ca. 1-3%) und optional KTG (Krankentaggeldversicherung)."
            }
          },
          {
            "@type": "Question",
            "name": "Ist der Brutto Netto Rechner kostenlos?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, unser Brutto Netto Rechner ist 100% kostenlos und kann ohne Registrierung oder Anmeldung genutzt werden."
            }
          },
          {
            "@type": "Question",
            "name": "Gilt der Rechner für alle Kantone in der Schweiz?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja, die Sozialversicherungsbeiträge (AHV, IV, ALV, BVG) sind in der ganzen Schweiz einheitlich. Der Rechner gilt für alle Kantone."
            }
          },
          {
            "@type": "Question",
            "name": "Was ist der 13. Monatslohn?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Der 13. Monatslohn ist eine zusätzliche Lohnzahlung, die viele Schweizer Arbeitgeber Ende Jahr ausrichten. Er entspricht in der Regel einem vollen Monatslohn und ist ebenfalls sozialversicherungspflichtig."
            }
          }
        ]
      }
    </script>
  `,
})
export class IndexComponent {
  protected readonly taxCalculatorService = inject(TaxCalculatorService);
}
