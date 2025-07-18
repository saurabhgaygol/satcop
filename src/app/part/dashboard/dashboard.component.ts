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

  dataresive: any[] = [];

  constructor(private report: DayliteamworkservicesService) { }

  ngOnInit() {

    const userid = sessionStorage.getItem('userdata');
    if (userid) {
      const tempuser = JSON.parse(userid);
      this.role = tempuser.role;
      this.username = tempuser.userId;
      console.log(this.username);

    }

    this.report.getAllWorks().subscribe((res) => {
      const alldata = res;
      this.dataresive = alldata.filter(item => item.status === 'Pending');
      console.log(this.dataresive);
      this.fiterdata();
      this.contionsionrole();

    });


  }

  fiterdata() {

    const tempdata = this.dataresive.filter(item => item.work_handled_by === this.username);
    this.lengthdata = tempdata.length;

  }

  contionsionrole() {
    switch (this.role) {
      case 'HR':
        this.fiterdata();
        console.log(this.lengthdata);
        break;

      case 'Team':
        this.fiterdata();
        console.log(this.lengthdata);
        break;

      case 'Manager':

        this.lengthdata = this.dataresive.length;
        console.log(this.lengthdata);
        break;
    }
  }



}
