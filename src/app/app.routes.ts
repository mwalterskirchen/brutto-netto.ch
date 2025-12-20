import { Routes } from '@angular/router';
import { ImprintComponent } from './imprint/imprint.component';
import { HomeComponent } from './home/home.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DisclaimerComponent } from './disclaimer/disclaimer.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'impressum', component: ImprintComponent },
  { path: 'datenschutz', component: PrivacyPolicyComponent },
  { path: 'haftungsausschluss', component: DisclaimerComponent },
];
