import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NotificationComponent } from "../../part/notification/notification.component";
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [RouterLink, RouterModule, NotificationComponent, CommonModule],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {

  //veriable
  showNotification = false;
  userName: any;
  showchangepassword = false;



  //constracter
  constructor(private router: Router) { }

  //method to show user longin
  ngOnInit(): void {
    const data = sessionStorage.getItem('userdata');
    if (data) {
      const userObj = JSON.parse(data);
      this.userName = userObj.userId;

    }
  }


  //notification logic show
  toggleNotification() {
    this.showNotification = !this.showNotification;

  }

  //notification logic close
  closeNotification() {
    this.showNotification = false;
  }

  // method to logout page
  signOut() {
    sessionStorage.clear();
    localStorage.clear();
    this.router.navigate(['/login']);
  }



  openModal() {
    const modalElement = document.getElementById('changePasswordModal');
    const modal = new (window as any).bootstrap.Modal(modalElement);
    modal.show();
  }

}







