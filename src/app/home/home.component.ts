import { Component, inject } from '@angular/core';
import { CalculatorService } from '../calculator/calculator.service';
import { CalculatorComponent } from '../calculator/calculator.component';
import { FaqComponent } from '../faq/faq.component';

@Component({
  selector: 'app-home',
  imports: [CalculatorComponent, FaqComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly calculatorService = inject(CalculatorService);
}
