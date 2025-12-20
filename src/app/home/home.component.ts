import { Component, inject } from '@angular/core';
import { CalculatorService } from '../calculator/calculator.service';
import { CalculatorComponent } from '../calculator/calculator.component';

@Component({
  selector: 'app-home',
  imports: [CalculatorComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly calculatorService = inject(CalculatorService);
}
