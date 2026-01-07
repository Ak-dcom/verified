import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen flex flex-col">
      <!-- Navigation -->
      <nav class="bg-slate-900 text-white shadow-lg sticky top-0 z-50 print:hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between h-16 items-center">
            <div class="flex items-center cursor-pointer" routerLink="/">
              <div class="h-8 w-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                <span class="text-slate-900 font-bold text-lg">P</span>
              </div>
              <span class="font-bold text-xl tracking-tight">Preppright</span>
            </div>
            <div class="flex space-x-4">
              <a routerLink="/" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">Verify</a>
              <a routerLink="/dashboard" class="px-3 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors">Dashboard</a>
              <a routerLink="/generate" class="px-3 py-2 rounded-md text-sm font-medium bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors shadow-sm">Issue Certificate</a>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="flex-grow">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-slate-50 border-t border-slate-200 mt-auto print:hidden">
        <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p class="text-center text-slate-500 text-sm">
            &copy; 2024 Preppright Verification Systems. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}