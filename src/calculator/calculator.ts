import { Component, inject } from '@angular/core';
import { TaxCalculatorService } from '../services/tax-calculator.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-calculator',
  imports: [FormsModule, CurrencyPipe, PercentPipe],
  template: `
    <section class="max-w-md mx-auto mb-8" aria-label="Lohnrechner">
      <div class="max-w-md mx-auto">
        <fieldset class="space-y-2">
          <label for="grossSalary">Bruttolohn in CHF pro Monat</label>
          <input
            type="number"
            id="grossSalary"
            class="input input-bordered w-full"
            min="1"
            [(ngModel)]="taxCalculatorService.grossSalary"
            placeholder="CHF pro Monat"
          />
          <label for="age">Alter</label>
          <input
            type="number"
            id="age"
            placeholder="Alter in Jahren"
            min="18"
            max="65"
            class="input input-bordered w-full"
            [(ngModel)]="taxCalculatorService.age"
          />
        </fieldset>
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
        <p class="net-salary text-2xl font-bold text-center">
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
  `,
})
export class CalculatorComponent {
  protected readonly taxCalculatorService = inject(TaxCalculatorService);
}
