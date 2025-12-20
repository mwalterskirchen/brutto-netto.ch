import { Routes } from '@angular/router';
import { ImprintComponent } from '../pages/imprint';
import { IndexComponent } from '../pages/index';
import { PrivacyPolicyComponent } from '../pages/privacy-policy';
import { DisclaimerComponent } from '../pages/disclaimer';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'impressum', component: ImprintComponent },
  { path: 'datenschutz', component: PrivacyPolicyComponent },
  { path: 'haftungsausschluss', component: DisclaimerComponent },
];
