import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { NotificationComponent } from "../../part/notification/notification.component";
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangepasswordComponent } from "../../part/changepassword/changepassword.component";


@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [RouterLink, RouterModule, NotificationComponent, CommonModule, ChangepasswordComponent],
  templateUrl: './hr-dashboard.component.html',
  styleUrls: ['./hr-dashboard.component.css']
})
export class HrDashboardComponent implements OnInit {

  //veriable
  showNotification = false;
  userName: any;
  profileimage!: SafeUrl;



  //constracter
  constructor(private router: Router, private sanitizer: DomSanitizer) { }

  //method to show user longin
  ngOnInit(): void {
    const data = sessionStorage.getItem('userdata');
    if (data) {
      const userObj = JSON.parse(data);
      this.userName = userObj.userId;
      const originalUrl = userObj.profileImages;

      let fileId = '';
      if (originalUrl.includes('id=')) {
        fileId = originalUrl.split('id=')[1];
      } else if (originalUrl.includes('/d/')) {
        fileId = originalUrl.split('/d/')[1]?.split('/')[0];
      }

      const imageUrl = `https://drive.google.com/thumbnail?id=${fileId}`;
      this.profileimage = imageUrl;
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







