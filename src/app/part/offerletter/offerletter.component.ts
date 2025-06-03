
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toWords } from 'number-to-words';

@Component({
  selector: 'app-offerletter',
  imports: [FormsModule],
  templateUrl: './offerletter.component.html',
  styleUrls: ['./offerletter.component.css']
})
export class OfferletterComponent {
  showError = false;
  submitted = false;

  form = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    joiningDate: '',
    ctc: '',
    address: '',
    company: '',

  };
  ctcInWords: string | undefined;
  formattedDate: string | undefined;


  submitForm() {
    const isFormValid = Object.values(this.form).every(value => value !== '');

    if (!isFormValid) {
      alert('Please fill all the fields');
      return;
    }

    this.submitted = true;
    this.ctcInWords = toWords(this.form.ctc);
    const today = new Date();
    this.formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const tempDate = this.form.joiningDate;
    const formattedJoinDate = this.formatDateReadable(tempDate);
    this.form.joiningDate = formattedJoinDate;

  }

  formatDateReadable(tempDate: string) {
    const date = new Date(tempDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleString('en-GB', { month: 'short' }); // "Jun"
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }


  validateAmount(event: any) {
    const value = parseFloat(event.target.value);
    this.showError = isNaN(value) || value <= 0;
  }

  async downloadPDF() {
    const element = document.getElementById('preview');
    if (!element) return;

    const originalMargin = element.style.margin;
    const originalPadding = element.style.padding;

    element.style.margin = '0';
    element.style.padding = '0';

    try {
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
      });

      // Reset styles to avoid UI side effects
      element.style.margin = originalMargin;
      element.style.padding = originalPadding;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = 210;
      const pdfHeight = 297;

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      const heightToUse = imgHeight > pdfHeight ? pdfHeight : imgHeight;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, heightToUse);

      pdf.save(`${this.form.firstName}_OfferLetter.pdf`);

      // Send form data to Google Script endpoint
      const response = await fetch('https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec', {
        method: 'POST',
        body: JSON.stringify(this.form),
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      console.log('Google Script response:', result);

    } catch (error) {
      console.error('Error generating or sending PDF:', error);
      // Optionally show user-friendly message
    }
  }
}










