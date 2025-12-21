import { Component, computed, inject } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, PercentPipe } from '@angular/common';
import { SalaryFrequency } from '../shared/enums/salary-frequency.enum';

@Component({
  selector: 'app-calculator',
  imports: [FormsModule, CurrencyPipe, PercentPipe],
  templateUrl: './calculator.component.html',
})
export class CalculatorComponent {
  protected readonly calculatorService = inject(CalculatorService);
  protected readonly SalaryFrequency = SalaryFrequency;
  protected currentTab = computed(() => this.calculatorService.salaryFrequency());

  onTabChange(tab: SalaryFrequency) {
    this.calculatorService.salaryFrequency.set(tab);
  }
}
