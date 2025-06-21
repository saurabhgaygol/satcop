import { Injectable } from '@angular/core';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class ExclefileserviceService {

  async exportSampleExcel(): Promise<void> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('SampleSheet');

    // 👉 Row 1: Instruction text (merged across A1:E1)
    const instructionText = 'Please enter First Name and Last Name as text, Salary fields as numbers, and Effective Date in dd-mm-yyyy format.';
    const instructionRow = worksheet.addRow([instructionText]);
    worksheet.mergeCells('A1:E1');

    const instructionCell = worksheet.getCell('A1');
    instructionCell.font = { bold: true };
    instructionCell.border = {
      top: { style: 'thin' },
      bottom: { style: 'thin' },
      left: { style: 'thin' },
      right: { style: 'thin' }
    };
    instructionCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF3F3F3' } // light gray background
    };
    instructionCell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    // 👉 Row 2: Column headers
    const headerRow = worksheet.addRow([
      'First Name',
      'Last Name',
      'Previous Salary',
      'New Salary',
      'Effective Date'
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFDDEEFF' } // light blue background
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // 👉 Adjust column widths
    worksheet.columns = [
      { width: 20 },
      { width: 20 },
      { width: 18 },
      { width: 18 },
      { width: 25 }
    ];

    // 👉 Row 3: Sample empty row
    worksheet.addRow(['', '', '', '', '']);

    // 👉 Create Excel and download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, 'Bulk Increment Letter.xlsx');
  }
}









