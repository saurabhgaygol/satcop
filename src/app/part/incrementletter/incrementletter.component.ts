import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toWords } from 'number-to-words';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-incrementletter',
  imports: [FormsModule],
  templateUrl: './incrementletter.component.html',
  styleUrl: './incrementletter.component.css'
})
export class IncrementletterComponent {
  showError = false;
  submitted = false;

  form = {
    firstName: '',
    lastName: '',
    Previous_Salary: '',
    New_Salary: '',
    Effective_Date: '',
    company: ''
  };
  NsalaryInWords: string | undefined;
  formattedDate: string | undefined;


  submitForm() {
    const isFormValid = Object.values(this.form).every(value => value !== '');

    if (!isFormValid) {
      alert('Please fill all the fields');
      return;
    }

    this.submitted = true;
    this.NsalaryInWords = toWords(this.form.New_Salary);
    const today = new Date();
    this.formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });

    const tempDate = this.form.Effective_Date;
    const formattedJoinDate = this.formatDateReadable(tempDate);
    this.form.Effective_Date = formattedJoinDate;

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
        scale: 25,
        useCORS: true,
      });

      // Reset styles to avoid UI side effects
      element.style.margin = originalMargin;
      element.style.padding = originalPadding;

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
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


      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

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

  openModal() {
    const modalElement = document.getElementById('bulkuplod');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

}












