import { ApplicationConfig, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeDeCH from '@angular/common/locales/de-CH';

import { routes } from './app.routes';

registerLocaleData(localeDeCH);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'CHF',
    },
    {
      provide: LOCALE_ID,
      useValue: 'de-CH',
    },
  ],
};
