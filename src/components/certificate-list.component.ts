import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CertificateService, Certificate } from '../services/certificate.service';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  template: `
    <!-- DASHBOARD VIEW (Hidden on Print) -->
    <div class="min-h-[calc(100vh-64px)] bg-slate-50 p-6 print:hidden">
      <div class="max-w-7xl mx-auto">
        <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-bold text-slate-900 font-serif-header">Certificate Dashboard</h1>
            <p class="text-slate-500">Manage and verify all issued credentials.</p>
          </div>
          <button 
            (click)="printRoster()"
            class="flex items-center bg-slate-900 text-white px-5 py-2.5 rounded-lg hover:bg-slate-800 transition-colors shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print Verification Roster
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-slate-600">
              <thead class="bg-slate-50 text-slate-900 uppercase font-bold border-b border-slate-200">
                <tr>
                  <th class="px-6 py-4">Student Name</th>
                  <th class="px-6 py-4">Course</th>
                  <th class="px-6 py-4">Issue Date</th>
                  <th class="px-6 py-4">ID</th>
                  <th class="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (cert of certificates(); track cert.id) {
                  <tr class="hover:bg-slate-50 transition-colors">
                    <td class="px-6 py-4 font-medium text-slate-900">{{ cert.studentName }}</td>
                    <td class="px-6 py-4">{{ cert.courseName }}</td>
                    <td class="px-6 py-4">{{ cert.issueDate | date:'mediumDate' }}</td>
                    <td class="px-6 py-4 font-mono text-xs">{{ cert.id }}</td>
                    <td class="px-6 py-4 text-right">
                      <a [routerLink]="['/verify', cert.id]" class="text-yellow-600 hover:text-yellow-700 font-medium">
                        View Certificate
                      </a>
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-slate-400">
                      No certificates issued yet.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- ROSTER PRINT VIEW (Visible only on Print) -->
    <div class="hidden print:block p-8 bg-white text-slate-900">
      <div class="mb-8 border-b-2 border-slate-900 pb-4">
        <div class="flex justify-between items-end">
          <div>
            <h1 class="text-4xl font-serif-header font-bold mb-2">Verification Roster</h1>
            <p class="text-sm uppercase tracking-widest text-slate-500">Preppright Academy Official Records</p>
          </div>
          <div class="text-right">
            <p class="text-sm text-slate-500">Generated on {{ today | date:'mediumDate' }}</p>
          </div>
        </div>
      </div>

      <table class="w-full text-left">
        <thead>
          <tr class="border-b border-slate-300">
            <th class="py-2 w-1/3">Student Details</th>
            <th class="py-2 w-1/3">Course Information</th>
            <th class="py-2 w-1/3 text-center">Scan to Verify</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
           @for (cert of certificates(); track cert.id) {
             <tr class="break-inside-avoid">
               <td class="py-4 align-middle">
                 <p class="text-xl font-bold">{{ cert.studentName }}</p>
                 <p class="font-mono text-xs text-slate-500 mt-1">ID: {{ cert.id }}</p>
               </td>
               <td class="py-4 align-middle">
                 <p class="font-medium">{{ cert.courseName }}</p>
                 <p class="text-xs text-slate-500">Issued: {{ cert.issueDate | date:'shortDate' }}</p>
               </td>
               <td class="py-4 align-middle text-center">
                 <div class="inline-block p-1 border border-slate-200">
                   <img [src]="getQrUrl(cert.id)" class="w-24 h-24" alt="QR Code" />
                 </div>
               </td>
             </tr>
           }
        </tbody>
      </table>
      
      <div class="mt-12 text-center text-xs text-slate-400 border-t border-slate-200 pt-4">
        &copy; Preppright Verification Systems. This document contains secure verification links.
      </div>
    </div>
  `
})
export class CertificateListComponent {
  private certService = inject(CertificateService);
  certificates = this.certService.certificates;
  today = new Date();

  printRoster() {
    window.print();
  }

  getQrUrl(id: string): string {
    const verifyUrl = `${window.location.origin}${window.location.pathname}#/verify/${id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;
  }
}
