import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { TaxCalculatorService } from '../services/tax-calculator.service';

@Component({
  selector: 'app-index',
  imports: [FormsModule, CurrencyPipe, PercentPipe],
  template: `
    <!-- Calculator Section -->
    <section class="max-w-md mx-auto mb-8" aria-label="Lohnrechner">
      <div class="max-w-md mx-auto">
        <label for="grossSalary">Bruttolohn in CHF pro Monat</label>
        <input
          type="number"
          id="grossSalary"
          class="input input-bordered w-full"
          [(ngModel)]="taxCalculatorService.grossSalary"
          placeholder="CHF pro Monat"
        />
        <label for="age">Alter</label>
        <input
          type="number"
          id="age"
          placeholder="Alter in Jahren"
          class="input input-bordered w-full"
          [(ngModel)]="taxCalculatorService.age"
        />
        <div class="form-control mt-4">
          <label class="label cursor-pointer flex items-center gap-2 w-full justify-between">
            <span class="label-text">13. Monatslohn</span>
            <input
              type="checkbox"
              class="toggle"
              [(ngModel)]="taxCalculatorService.thirteenthSalaryEnabled"
            />
          </label>
        </div>
        <div class="form-control mt-4">
          <label class="label cursor-pointer flex items-center gap-2 w-full justify-between">
            <span class="label-text">Krankentaggeldversicherung</span>
            <input type="checkbox" class="toggle" [(ngModel)]="taxCalculatorService.ktgEnabled" />
          </label>
        </div>
      </div>
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <p class="text-2xl font-bold text-center">
          Nettolohn:
          {{ taxCalculatorService.netSalary() | currency }}
        </p>
      </div>
      <div class="mt-4 p-4 bg-base-200 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">
          Summe der Abzüge: @if (taxCalculatorService.totalContributions() > 0) {
          {{ taxCalculatorService.totalContributions() | currency }} ({{
            taxCalculatorService.totalContributionsPercentage() | percent : '1.2-2'
          }}) }
        </h3>
        <table class="table table-zebra text-sm">
          <tbody>
            <tr>
              <th>AHV/IV/EO Beiträge</th>
              <td>
                {{
                  taxCalculatorService.ahvIvEoContributions() === 0 ||
                  taxCalculatorService.ahvIvEoContributions() == null
                    ? '-'
                    : (taxCalculatorService.ahvIvEoContributions() | currency)
                }}
              </td>
            </tr>
            <tr>
              <th>Pensionskasse (BVG) Beiträge</th>
              <td>
                {{
                  taxCalculatorService.bvgContributions() === 0 ||
                  taxCalculatorService.bvgContributions() == null
                    ? '-'
                    : (taxCalculatorService.bvgContributions() | currency)
                }}
              </td>
            </tr>
            <tr>
              <th>ALV Beiträge</th>
              <td>
                {{
                  taxCalculatorService.alvContributions() === 0 ||
                  taxCalculatorService.alvContributions() == null
                    ? '-'
                    : (taxCalculatorService.alvContributions() | currency)
                }}
              </td>
            </tr>
            <tr>
              <th>NBU Beiträge</th>
              <td>
                {{
                  taxCalculatorService.nbuContributions() === 0 ||
                  taxCalculatorService.nbuContributions() == null
                    ? '-'
                    : (taxCalculatorService.nbuContributions() | currency)
                }}
              </td>
            </tr>
            <tr>
              <th>KTG Beiträge</th>
              <td>
                {{
                  taxCalculatorService.ktgContributions() === 0 ||
                  taxCalculatorService.ktgContributions() == null
                    ? '-'
                    : (taxCalculatorService.ktgContributions() | currency)
                }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SEO Content Section -->
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

    <!-- FAQ Section with Schema Markup -->
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

    <!-- Additional Schema Markup for FAQ -->
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
