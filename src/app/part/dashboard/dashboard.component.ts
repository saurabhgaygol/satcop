import { Component } from '@angular/core';
import { DayliteamworkservicesService } from '../../services/dayliteamworkservices.service';
import { SgpsalldataService } from '../../services/sgpsalldata.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {





  role: any;
  username: any;
  lengthdata: any;
  totallengthdata: any;
  donelengthdata: any;
  sgpsvehical1: any;

  dataresive: any[] = [];

  managerdata: any[] = [];
  demoschoollist: any[] = [];
  liveschool: any[] = [];
  companyBranchCounts: { name: string; count: number; }[] | undefined;

  constructor(private report: DayliteamworkservicesService, private sgpsdata: SgpsalldataService) { }

  ngOnInit() {



    const userid = sessionStorage.getItem('userdata');
    if (userid) {
      const tempuser = JSON.parse(userid);
      this.role = tempuser.role;
      this.username = tempuser.userId;


    }

    this.report.getAllWorks().subscribe((res) => {
      const alldata = res;
      this.managerdata = res;
      this.dataresive = alldata.filter(item => item.work_handled_by === this.username);
      this.totallengthdata = this.dataresive.length;
      this.fiterdata();
      this.contionsionrole();
      this.sgpsdatashow();



    });


  }

  fiterdata() {

    const tempdata1 = this.dataresive.filter(item => item.status === 'Done');
    this.donelengthdata = tempdata1.length;


    const tempdata = this.dataresive.filter(item => item.status === 'Pending');
    this.lengthdata = tempdata.length;

  }

  contionsionrole() {
    switch (this.role) {
      case 'HR':
        this.fiterdata();
        break;

      case 'Team':
        this.fiterdata();
        break;

      case 'Manager':
        this.totallengthdata = this.managerdata.length;
        const tempdata1 = this.managerdata.filter(item => item.status === 'Done');
        this.donelengthdata = tempdata1.length;


        const tempdata = this.managerdata.filter(item => item.status === 'Pending');
        this.lengthdata = tempdata.length;
        break;
    }
  }

  async sgpsdatashow(): Promise<void> {
    return new Promise((resolve) => {
      this.sgpsdata.getData().subscribe(res => {
        const allData = res.data;
        this.sgpsvehical1 = allData.length;


        // 1. Create company + branch string
        const companyBranchList = allData.map(
          (item: { Company: any; Branch: any }) => `${item.Company}, ${item.Branch}`
        );

        // 2. Count repetitions
        const countMap: { [key: string]: number } = {};
        companyBranchList.forEach((entry: string | number) => {
          countMap[entry] = (countMap[entry] || 0) + 1;
        });

        // 3. Convert to array and sort
        this.companyBranchCounts = Object.entries(countMap)
          .map(([key, value]) => ({
            name: key,
            count: value
          }))
          .sort((a, b) => a.count - b.count);

        // 4. Clear old data
        this.demoschoollist = [];
        this.liveschool = [];

        // 5. Split into arrays
        this.companyBranchCounts.forEach(item => {
          if (item.count === 1) {
            if (item.name === "tics, tics") {
              this.liveschool.push(item);
            }
            else {
              this.demoschoollist.push(item);
            }

          } else {
            this.liveschool.push(item);
          }
        });


        const grendata = this.liveschool.length;
        const reddata = this.demoschoollist.length;

        this.greenPercent = (grendata / this.companyBranchCounts.length) * 100;
        this.redPercent = (reddata / this.companyBranchCounts.length) * 100;


        resolve(); // ✅ promise complete
      });
    });

  }


  greenPercent: any; // backend से set
  redPercent: any;   // backend से set

  r = 15.9155;
  circumference = 2 * Math.PI * this.r;

  get greenLength() {
    return (this.greenPercent / 100) * this.circumference;
  }





}
