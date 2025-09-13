import { Component, OnInit } from '@angular/core';
import { CollectionsheetService } from '../../services/collectionsheet.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import FileSaver from 'file-saver';
import { Workbook } from 'exceljs';

@Component({
  selector: 'app-collectiondata',
  imports: [FormsModule, CommonModule],
  templateUrl: './collectiondata.component.html',
  styleUrl: './collectiondata.component.css'
})
export class CollectiondataComponent implements OnInit {
  toastPosition = { top: 0, left: 0 };

  tempteast: any[] = [];
  newComment: string = "";
  selectedCommentId: number | null = null;
  filteredComments: any[] = [];
  sarch: any;
  type: any;




  openCommentToast(event: MouseEvent, Uniq_Id: number) {
    const target = event.target as HTMLElement;
    const rect = target.getBoundingClientRect();

    // position row ke upar
    this.toastPosition = {
      top: rect.top - 60 + window.scrollY,
      left: rect.left - 300 + window.scrollX
    };

    this.selectedCommentId = Uniq_Id;
    this.filterdatacomment();
  }

  parseCustomDate(dateStr: string): Date | null {
    if (!dateStr || dateStr === '--') return null;

    const [datePart, timePart] = dateStr.split(', ');
    const [day, month, year] = datePart.split('/').map(Number);
    const [hours, minutes] = timePart.split(':').map(Number);

    return new Date(year, month - 1, day, hours, minutes);
  }

  filterdatacomment() {
    if (!this.selectedCommentId) {
      this.filteredComments = [];
      return;
    }

    // filter data by Uniq_Id aur "--" wale comments ignore karo
    this.filteredComments = this.tempteast.filter(
      (resp: any) =>
        resp.Uniq_Id === this.selectedCommentId &&
        resp.Comment && resp.Comment !== "--"
    );

    // sort by date (latest first)
    this.filteredComments.sort((a, b) => {
      const dateA = this.parseCustomDate(a.Last_Updated_Date);
      const dateB = this.parseCustomDate(b.Last_Updated_Date);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1;
      if (!dateB) return -1;

      return dateB.getTime() - dateA.getTime();
    });


  }


  loadComments() {
    this.googleSheetService.getData1().subscribe((res: any) => {
      this.tempteast = res.data || [];
      this.filterdatacomment(); // central function call
    });
  }



  addComment() {
    if (!this.newComment.trim()) {
      alert("Comment cannot be blank!");
      return;
    }

    // ✅ Custom date formatter (dd/MM/yyyy, HH:mm) - string
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate2: string = `${day}/${month}/${year}, ${hours}:${minutes}`;

    const newData = {
      Uniq_Id: this.selectedCommentId,
      Last_Updated_Date: formattedDate2,   // ✅ Always string
      Sales_Manager: this.username,
      Comment: this.newComment.trim(),
      Expected_Date_of_payment: ""
    };

    // 1. UI ko turant update karo
    this.tempteast.push(newData);
    this.filterdatacomment(); // local filter + sort

    const recodata = this.allcolectiondata.find(
      (item: any) => item.Uniq_Id === this.selectedCommentId
    );
    if (recodata) {
      recodata.Last_Updaed_Userid = newData.Sales_Manager;
      recodata.Last_Updated_Date = formattedDate2;
    }

    // 2. Backend pe async save karo
    this.googleSheetService.createData1(newData).subscribe({
      next: () => {
        alert("Saved on server!");
      },
      error: (err) => {
        alert("Failed to sync with server! (local update already done)");
      }
    });

    // 3. Input clear karo
    this.newComment = "";
  }











  role: any;
  username: any;

  allcolectiondata: any[] = [];
  lastupdated: any[] = [];

  selectedRecord: any = null;
  selectedIndex: number | null = null;

  constructor(private googleSheetService: CollectionsheetService) { }

  ngOnInit(): void {

    const userid = sessionStorage.getItem('userdata');
    if (userid) {
      const tempuser = JSON.parse(userid);
      this.role = tempuser.role;
      this.username = tempuser.userId;

    }

    this.getallcollectiondata();
    this.loadComments();


  }


  getallcollectiondata() {
    forkJoin({
      lastupdated: this.googleSheetService.getData1(),
      allcolectiondata: this.googleSheetService.readData()
    }).subscribe(({ lastupdated, allcolectiondata }) => {
      this.lastupdated = lastupdated.data || [];
      this.allcolectiondata = allcolectiondata.data || [];


      // ---- helpers ----
      const toISTString = (d: Date) =>
        new Intl.DateTimeFormat('en-GB', {
          day: '2-digit', month: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit',
          hour12: false, timeZone: 'Asia/Kolkata'
        }).format(d);

      const parseFlex = (val: any): Date | null => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (typeof val === 'number') return new Date(val);
        if (typeof val === 'string') {
          const s = val.trim();
          if (/\d{4}-\d{2}-\d{2}T/.test(s)) {
            const d = new Date(s);
            return isNaN(d.getTime()) ? null : d;
          }
          const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4}),\s*(\d{2}):(\d{2})$/);
          if (m) {
            const [, dd, MM, yyyy, HH, mm] = m;
            return new Date(+yyyy, +MM - 1, +dd, +HH, +mm);
          }
        }
        return null;
      };
      // ------------------

      // Har Uniq_Id ke liye sabse latest record nikaalo
      const latestById = new Map<
        string,
        { ts: number; Last_Updated_Date: string; Last_Updaed_Userid: string }
      >();

      ;

      this.lastupdated.forEach((row: any) => {
        const raw = row.Last_Updated_Date || row.LastUpdatedDate || row.lastUpdate || row.Last_Updated;
        const d = parseFlex(raw);
        if (!d) return;

        const uniqId = String(row.Uniq_Id);
        const ts = d.getTime();
        const prev = latestById.get(uniqId);

        if (!prev || ts > prev.ts) {
          latestById.set(uniqId, {
            ts,
            Last_Updated_Date: toISTString(d),
            Last_Updaed_Userid: row.Sales_Manager || row.Last_Updaed_Userid || row.updatedBy || '-'
          });
        }
      });

      // Merge karo collection data ke andar
      this.allcolectiondata = this.allcolectiondata.map((col: any) => {
        const upd = latestById.get(String(col.Uniq_Id));
        return {
          ...col,
          Last_Updated_Date: upd ? upd.Last_Updated_Date : '-',
          Last_Updaed_Userid: upd ? upd.Last_Updaed_Userid : '-'
        };
      });

      // Agar koi Uniq_Id collection me missing hai to add karo
      latestById.forEach((upd, uniqId) => {
        const exists = this.allcolectiondata.find((x: any) => String(x.Uniq_Id) === uniqId);
        if (!exists) {
          this.allcolectiondata.push({
            Uniq_Id: uniqId,
            Last_Updated_Date: upd.Last_Updated_Date,
            Last_Updaed_Userid: upd.Last_Updaed_Userid
          });
        }
      });

      this.datafilter();
    });
  }





  shortdata() {
    const temdata = this.allcolectiondata.filter(item => item.Sales_Manager === "kamini");
    this.allcolectiondata = temdata;
    this.sarchpart = this.allcolectiondata;


  }

  datafilter() {

    switch (this.role) {
      case 'Team':
        this.shortdata();
        break;

      case 'HR':
        this.shortdata();
        break;

      case 'collection':
        this.shortdata();
        break;

      case 'Manager':
        break;

      default:

        break;
    }

  }







  isToastVisible = false;

  onRowClick(work: any, index: number) {

    this.selectedRecord = { ...work }; // copy record
    this.selectedIndex = index;
    this.isToastVisible = true;

    console.log(this.selectedRecord.Payment_Status);


    if (!this.selectedRecord.Amount_Received) {
      this.selectedRecord.Amount_Received = 0;
    }




  }

  // Getter for Pending Amount (UI updates automatically)
  get pendingAmount(): number {
    if (!this.selectedRecord) return 0;
    const total = Number(this.selectedRecord.Total_Amount) || 0;
    const received = Number(this.selectedRecord.Amount_Received) || 0;
    return total - received;
  }

  get paymentstutas(): string {

    const total = Number(this.selectedRecord.Total_Amount) || 0;
    const received = Number(this.selectedRecord.Amount_Received) || 0;

    if (received === 0) return "Pending";
    if (received < total) return "Partially Paid";
    if (received >= total) return "Paid";

    return "Pending";

  }




  onDateChange(event: any) {
    const dateValue = event.target.value; // yyyy-MM-dd
    if (dateValue) {
      const [year, month, day] = dateValue.split('-');
      this.selectedRecord.Expected_Date_of_payment = `${day}/${month}/${year}`;
    }
  }




  closeToast() {
    this.isToastVisible = false;
    this.selectedRecord = null;
  }


  deleteRecord(uniqId: string) {
    if (confirm("Are you sure you want to delete this record?")) {
      this.googleSheetService.deleteData(uniqId).subscribe({
        next: (value) => {
          console.log("Deleted successfully:", value);

          this.allcolectiondata = this.allcolectiondata.filter(
            (record) => record.Uniq_Id !== uniqId
          );

        },
      });
    }

  }

  updateddata() {
    if (this.selectedRecord) {
      this.Commentnew();
      this.closeToast();

    }
  }

  Commentnew() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formattedDate: string = `${day}/${month}/${year}, ${hours}:${minutes}`;

    const newData = {
      Uniq_Id: this.selectedRecord.Uniq_Id,
      Last_Updated_Date: formattedDate,   // 👈 IST formatted date
      Sales_Manager: this.username,
      Comment: "",
      Expected_Date_of_payment: this.selectedRecord.Expected_Date_of_payment
    };

    // 🔹 Update local record
    const index = this.allcolectiondata.findIndex(
      (item: any) => item.Uniq_Id === this.selectedRecord.Uniq_Id
    );

    if (index !== -1) {
      this.allcolectiondata[index] = {
        ...this.allcolectiondata[index],
        Last_Updaed_Userid: this.username,
        Last_Updated_Date: formattedDate,
        Amount_Received: this.selectedRecord.Amount_Received,
        Expected_Date_of_payment: this.selectedRecord.Expected_Date_of_payment,
        Payment_Probability: this.selectedRecord.Payment_Probability,
        Discription: this.selectedRecord.Discription,
        Product_Category: this.selectedRecord.Product_Category,
        Payment_Status: this.selectedRecord.Payment_Status

      };

      // force Angular change detection
      this.allcolectiondata = [...this.allcolectiondata];
    }



    // 🔹 Backend update
    this.googleSheetService.updateData(this.selectedRecord).subscribe({
      next: () => alert("✅ Saved on server!"),
      error: () => alert("❌ Failed to sync with server! (local update already done)")
    });

    this.googleSheetService.createData1(newData).subscribe({
      next: () => alert("✅ Saved on server!"),
      error: () => alert("❌ Failed to sync with server! (local update already done)")
    });
  }




  async downloadExcel() {
    if (!this.allcolectiondata || this.allcolectiondata.length === 0) {
      return;
    }

    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Collection Sheet');

    // Keys se headers banaye
    const keys = Object.keys(this.allcolectiondata[0]);
    const headerRow = worksheet.addRow(keys);

    // Header styling
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, size: 12 };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'c4c0c0' }, //gree
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    // Data rows
    this.allcolectiondata.forEach((data) => {
      const row = keys.map((k) => data[k]);
      worksheet.addRow(row);
    });

    // Border for all cells
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
      });
    });

    // Auto column width
    worksheet.columns?.forEach((col) => {
      let maxLength = 15;

      // ✅ Non-null check lagana zaroori hai
      col.eachCell?.({ includeEmpty: true }, (cell) => {
        const length = cell.value ? cell.value.toString().length : 10;
        if (length > maxLength) {
          maxLength = length;
        }
      });

      col.width = maxLength + 2;
    });

    // Download Excel
    const buffer = await workbook.xlsx.writeBuffer();
    FileSaver.saveAs(
      new Blob([buffer], { type: 'application/octet-stream' }),
      'collection_sheet.xlsx'
    );
  }
































  //sarch code
  sarchpart: any[] = [];
  Sarchdata() {
    this.allcolectiondata = this.sarchpart;

    if (this.sarch) {

      const sarchvalue = this.sarch.toLowerCase().trim();

      const result = this.sarchpart.filter(item => Object.values(item).some(val => val?.toString().toLocaleLowerCase().includes(sarchvalue)));

      if (result.length === 0) {
        alert("no record found");
        this.allcolectiondata;
      }
      else {
        this.allcolectiondata = result;
      }

      this.sarch = '';

    }




  }

}