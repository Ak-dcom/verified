import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CertificateService } from '../services/certificate.service';

@Component({
  selector: 'app-generate',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="min-h-[calc(100vh-64px)] bg-slate-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-8">
        <div class="text-center mb-8">
          <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900">Issue New Certificate</h1>
          <p class="text-slate-500 text-sm mt-2">Enter the details below. Our AI will generate a professional citation and unique ID.</p>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Student Name</label>
            <input 
              type="text" 
              [(ngModel)]="name" 
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
              placeholder="e.g. Jane Doe"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Course / Achievement</label>
            <input 
              type="text" 
              [(ngModel)]="course" 
              class="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
              placeholder="e.g. Masterclass in Public Speaking"
            />
          </div>

          @if (isGenerating()) {
             <button disabled class="w-full bg-slate-100 text-slate-400 font-semibold py-3 rounded-lg flex items-center justify-center cursor-not-allowed">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-slate-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Drafting Certificate...
             </button>
          } @else {
             <button 
                (click)="generate()" 
                [disabled]="!name() || !course()"
                class="w-full bg-slate-900 text-white font-semibold py-3 rounded-lg hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">
                Generate & Issue
             </button>
          }
        </div>
        
        <div class="mt-6 text-center text-xs text-slate-400">
          This is a simulation. Certificates are stored locally in your browser.
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerateComponent {
  name = signal('');
  course = signal('');
  isGenerating = signal(false);

  private certService = inject(CertificateService);
  private router = inject(Router);

  async generate() {
    if (!this.name() || !this.course()) return;

    this.isGenerating.set(true);
    try {
      const id = await this.certService.generateCertificate(this.name(), this.course());
      this.router.navigate(['/verify', id]);
    } catch (e) {
      console.error(e);
      alert('Failed to generate certificate.');
    } finally {
      this.isGenerating.set(false);
    }
  }
}
