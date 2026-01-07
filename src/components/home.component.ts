import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  searchId = signal('');
  error = signal('');

  constructor(private router: Router) {}

  onVerify() {
    const id = this.searchId().trim();
    if (!id) {
        this.error.set('Please enter a Certificate ID');
        return;
    }
    
    // We navigate to the verify page regardless. The verify page handles validation.
    this.router.navigate(['/verify', id]);
  }
}
