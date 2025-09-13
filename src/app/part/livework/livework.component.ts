import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { DayliteamworkservicesService } from '../../services/dayliteamworkservices.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';

@Component({
  selector: 'app-livework',
  imports: [],
  templateUrl: './livework.component.html',
  styleUrl: './livework.component.css'
})
export class LiveworkComponent {
  userdata: any[] = [];
  reportdata2: any[] = [];

  constructor(private http: HttpClient, private reportdata: DayliteamworkservicesService) { }



  ngOnInit() {
    const userApiUrl = 'https://script.google.com/macros/s/AKfycbzYI8TauE28bNIqbJqJ5hY_o62GbaTnZd3EGotyvmVrs4p_JUYt6yo5M3zmppDgNvJJPg/exec';

    forkJoin({
      users: this.http.get<any[]>(userApiUrl),
      reports: this.reportdata.getAllWorks()
    }).subscribe(result => {
      this.userdata = result.users;
      this.reportdata2 = result.reports;

      console.log('User Data:', this.userdata);
      console.log('Report Data:', this.reportdata2);

      this.combaindata();
    });

  }

  combaindata() {
    const margedata = this.reportdata2.map(res2 => {
      const matchdata = this.userdata.find(res1 => res1.userId === res2.work_handled_by);
      return {
        ...res2,
        role: matchdata ? matchdata.role : null
      };
    });

    console.log(margedata);
  }









}
