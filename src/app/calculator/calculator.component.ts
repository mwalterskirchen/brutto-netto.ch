import { Component, inject } from '@angular/core';
import { CalculatorService } from './calculator.service';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe, PercentPipe } from '@angular/common';

@Component({
  selector: 'app-calculator',
  imports: [FormsModule, CurrencyPipe, PercentPipe],
  templateUrl: './calculator.component.html',
})
export class CalculatorComponent {
  protected readonly calculatorService = inject(CalculatorService);
}
