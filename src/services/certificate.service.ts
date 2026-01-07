import { Injectable, signal, computed } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  issueDate: string; // ISO string
  citation: string;
  quote: string;
  issuer: string;
}

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  private readonly STORAGE_KEY = 'preppright_certificates';
  
  // Initialize with a demo certificate
  private initialData: Certificate[] = [
    {
      id: 'PREP-2024-DEMO',
      studentName: 'Alex Johnson',
      courseName: 'Advanced Angular Architecture',
      issueDate: new Date().toISOString(),
      citation: 'For demonstrating exceptional mastery in building scalable, performant web applications and adhering to strict architectural patterns.',
      quote: '"Excellence is not a skill. It is an attitude." - Ralph Marston',
      issuer: 'Preppright Academy'
    }
  ];

  // Signal to hold all certificates
  private certificatesSignal = signal<Certificate[]>(this.loadCertificates());

  constructor() {}

  get certificates() {
    return this.certificatesSignal.asReadonly();
  }

  private loadCertificates(): Certificate[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : this.initialData;
  }

  getCertificate(id: string): Certificate | undefined {
    return this.certificatesSignal().find(c => c.id === id);
  }

  async generateCertificate(name: string, course: string): Promise<string> {
    try {
      const apiKey = process.env['API_KEY'];
      if (!apiKey) {
        throw new Error('API Key missing');
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
        Create a professional certificate citation and an inspiring short quote for a student named "${name}" who completed the course "${course}".
        
        Return ONLY a JSON object with this schema:
        {
          "citation": "A 1-2 sentence formal citation of their achievement.",
          "quote": "A short, relevant inspiring quote (attributed)."
        }
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
      });
      
      const text = response.text || '{}';
      const data = JSON.parse(text);

      const newCert: Certificate = {
        id: `PREP-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        studentName: name,
        courseName: course,
        issueDate: new Date().toISOString(),
        citation: data.citation || `For successfully completing ${course}.`,
        quote: data.quote || '"The expert in anything was once a beginner."',
        issuer: 'Preppright Academy'
      };

      this.addCertificate(newCert);
      return newCert.id;

    } catch (error) {
      console.error('AI Generation failed, falling back to basic.', error);
      // Fallback if AI fails
      const fallbackCert: Certificate = {
        id: `PREP-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
        studentName: name,
        courseName: course,
        issueDate: new Date().toISOString(),
        citation: `For successfully completing the requirements of ${course}.`,
        quote: '"Education is the passport to the future."',
        issuer: 'Preppright Academy'
      };
      this.addCertificate(fallbackCert);
      return fallbackCert.id;
    }
  }

  private addCertificate(cert: Certificate) {
    this.certificatesSignal.update(certs => [cert, ...certs]);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.certificatesSignal()));
  }
}