import { Component } from '@angular/core';
import { DayliteamworkservicesService } from '../../services/dayliteamworkservices.service';

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

  dataresive: any[] = [];

  constructor(private report: DayliteamworkservicesService) { }

  ngOnInit() {

    const userid = sessionStorage.getItem('userdata');
    if (userid) {
      const tempuser = JSON.parse(userid);
      this.role = tempuser.role;
      this.username = tempuser.userId;

    }

    this.report.getAllWorks().subscribe((res) => {
      const alldata = res;
      this.dataresive = alldata.filter(item => item.work_handled_by === this.username);
      this.totallengthdata = this.dataresive.length;
      this.fiterdata();
      this.contionsionrole();

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
        this.lengthdata = this.dataresive.length;
        break;
    }
  }



}
