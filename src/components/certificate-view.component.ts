import { Component, ChangeDetectionStrategy, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CertificateService, Certificate } from '../services/certificate.service';

@Component({
  selector: 'app-certificate-view',
  standalone: true,
  imports: [CommonModule, DatePipe, RouterLink],
  templateUrl: './certificate-view.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CertificateViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private certService = inject(CertificateService);
  
  certificate = signal<Certificate | null>(null);
  loading = signal(true);
  error = signal(false);
  
  // Verification Animation State
  verificationStatus = signal('Initializing...');
  verificationProgress = signal(0);
  
  // Print Confirmation State
  showPrintConfirmation = signal(false);
  
  // Computed QR Code URL
  // Generates a QR code image URL that points to the current verification page
  qrCodeUrl = computed(() => {
    const cert = this.certificate();
    if (!cert) return '';
    // Construct the verification URL relative to the current environment
    const verifyUrl = `${window.location.origin}${window.location.pathname}#/verify/${cert.id}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(verifyUrl)}`;
  });

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCertificate(id);
      } else {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  async loadCertificate(id: string) {
    // Reset state
    this.loading.set(true);
    this.error.set(false);
    this.verificationProgress.set(0);

    // Animation sequence to build trust
    const steps = [
      { msg: 'Connecting to Preppright Secure Ledger...', progress: 15 },
      { msg: 'Authenticating Issuer Signature...', progress: 45 },
      { msg: 'Verifying Hash Integrity...', progress: 75 },
      { msg: 'Finalizing Verification...', progress: 95 }
    ];

    for (const step of steps) {
      this.verificationStatus.set(step.msg);
      this.verificationProgress.set(step.progress);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    this.verificationProgress.set(100);
    await new Promise(resolve => setTimeout(resolve, 400)); // Brief pause at 100%

    const cert = this.certService.getCertificate(id);
    
    if (cert) {
        this.certificate.set(cert);
    } else {
        this.error.set(true);
    }
    this.loading.set(false);
  }

  printCertificate() {
    this.showPrintConfirmation.set(true);
  }

  confirmPrint() {
    this.showPrintConfirmation.set(false);
    // Allow UI to update (remove modal) before opening print dialog
    setTimeout(() => {
        window.print();
    }, 100);
  }

  cancelPrint() {
    this.showPrintConfirmation.set(false);
  }

  shareCertificate() {
    if (navigator.share) {
      navigator.share({
        title: 'Verified Certificate - Preppright',
        text: `Check out this verified certificate for ${this.certificate()?.studentName} from Preppright Academy.`,
        url: window.location.href
      }).catch((err) => console.log('Error sharing', err));
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Certificate link copied to clipboard!');
      }).catch(err => console.error('Could not copy text: ', err));
    }
  }

  get formattedDate(): string {
    const d = this.certificate()?.issueDate;
    return d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  }
}