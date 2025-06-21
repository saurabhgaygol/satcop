import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toWords } from 'number-to-words';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import { ExclefileserviceService } from '../../services/exclefileservice.service';
import { routes } from '../../app.routes';
import { RouterLink } from '@angular/router';


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
  companyName: any;


  async submitForm(): Promise<void> {
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


    await new Promise(resolve => setTimeout(resolve, 100));
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

  async downloadPDF(): Promise<void> {
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

      await new Promise(resolve => setTimeout(resolve, 500));

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

  constructor(private excelServicefile: ExclefileserviceService) { }

  downloadSample() {
    this.excelServicefile.exportSampleExcel();
  }

  //bulk excle read code//

  handleSubmit() {
    this.BulkDownload();

  }

  parsedData: any[] = [];

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      console.error('Please select a single file.');
      return;
    }

    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const allRows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

      if (allRows.length < 2) {
        console.warn('Not enough rows in file.');
        return;
      }

      const headers = allRows[1]; // Second row
      const dataRows = allRows.slice(2); // From third row onwards

      this.parsedData = dataRows.map(row => {
        const rowObj: any = {};
        headers.forEach((header: any, i: number) => {
          rowObj[header] = row[i] ?? '';
        });
        return rowObj;
      });

      console.log('Final Data:', this.parsedData);
    };

    reader.readAsBinaryString(target.files[0]);
  }

  async BulkDownload() {
    const excledata = this.parsedData;


    for (const exc of excledata) {
      this.form.firstName = exc["First Name"];
      this.form.lastName = exc["Last Name"];
      this.form.Previous_Salary = exc["Previous Salary"];
      this.form.New_Salary = exc["New Salary"];
      this.form.Effective_Date = exc["Effective Date"];


      this.form.company = this.companyName;

      await this.submitForm();
      await new Promise(resolve => setTimeout(resolve, 100));
      await this.downloadPDF();
    }


    this.form.firstName = '';
    this.form.lastName = '';
    this.form.Previous_Salary = '';
    this.form.New_Salary = '';
    this.form.Effective_Date = '';

    location.reload();

  }




}















