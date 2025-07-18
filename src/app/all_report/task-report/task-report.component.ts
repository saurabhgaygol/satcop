import { Component } from '@angular/core';
import { DayliteamworkservicesService } from '../../services/dayliteamworkservices.service';
import { CommonModule } from '@angular/common';
import { format } from 'date-fns';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-task-report',
  imports: [CommonModule],
  templateUrl: './task-report.component.html',
  styleUrl: './task-report.component.css'
})
export class TaskReportComponent {
  loading: boolean = true;

  constructor(private taskdata: DayliteamworkservicesService) { }
  role: string | undefined;
  username: string | undefined;
  fachdata: any[] = [];

  ngOnInit() {

    const userid = sessionStorage.getItem('userdata');
    if (userid) {
      const tempuser = JSON.parse(userid);
      this.role = tempuser.role;
      this.username = tempuser.userId;

    }


    this.taskdata.getAllWorks().subscribe((res) => {
      this.fachdata = res.map((item: any) => {

        const formatDate = (datetime: string) => {
          if (!datetime) return '';
          const date = new Date(datetime);
          return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()} ${(date.getHours() % 12 || 12).toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')} ${date.getHours() >= 12 ? 'PM' : 'AM'}`;
        };

        return {
          ...item,
          handled_datetime: formatDate(item.handled_datetime),
          completed_datetime: formatDate(item.completed_datetime)
        };

      });
      this.loading = false;
      this.someMethod();

    });



  }

  donedata() {
    const tempdata = this.fachdata.filter(item => item.work_handled_by === this.username);
    this.fachdata = tempdata;
  }

  someMethod() {
    switch (this.role) {
      case 'Team':
        this.donedata();
        break;

      case 'HR':
        this.donedata();
        break;

      case 'Manager':
        break;

      default:

        break;
    }
  }



  exportToExcel(): void {
    const filteredData = this.fachdata.map(({ id, work_sent_by, sent_datetime, ...rest }) => rest);
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Work Report');

    const header = Object.keys(filteredData[0]);
    const headerRow = worksheet.addRow(header);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD3D3D3' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    });

    filteredData.forEach(item => {
      worksheet.addRow(Object.values(item));
    });

    worksheet.columns.forEach(column => {
      column.width = 20;
    });

    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, 'filtered_work_data.xlsx');
    });
  }



}
