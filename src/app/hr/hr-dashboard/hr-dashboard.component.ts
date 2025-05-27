import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NotificationComponent } from "../../part/notification/notification.component";
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [RouterLink, RouterModule, NotificationComponent,CommonModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {
  showNotification = false;
  userName: any;

  constructor(private router: Router) {}

   ngOnInit(): void {
    const data = sessionStorage.getItem('userdata');
    if (data) {
      const userObj = JSON.parse(data);
      this.userName = userObj.userId;
      
    }
  }

    


 

  toggleNotification() {//ye notification ki method hai
   this.showNotification = !this.showNotification;
  
  }

  closeNotification() {
  this.showNotification = false;
}


  signOut() {
  sessionStorage.clear();
  localStorage.clear();
  this.router.navigate(['/login']);
    }
}
