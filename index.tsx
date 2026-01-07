import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withHashLocation, Routes } from '@angular/router';
import { AppComponent } from './src/app.component';

// Define routes here to avoid circular dependency issues in small projects
// or complex file structures.
import { HomeComponent } from './src/components/home.component';
import { CertificateViewComponent } from './src/components/certificate-view.component';
import { GenerateComponent } from './src/components/generate.component';
import { CertificateListComponent } from './src/components/certificate-list.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'verify/:id', component: CertificateViewComponent },
  { path: 'generate', component: GenerateComponent },
  { path: 'dashboard', component: CertificateListComponent },
  { path: '**', redirectTo: '' }
];

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes, withHashLocation())
  ]
}).catch((err) => console.error(err));

// AI Studio always uses an `index.tsx` file for all project types.