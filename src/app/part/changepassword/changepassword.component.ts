import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-changepassword',
  imports: [CommonModule, FormsModule],
  templateUrl: './changepassword.component.html',
  styleUrl: './changepassword.component.css'
})
export class ChangepasswordComponent {


  checkuser: any;
  Username: any;
  old_password: any;
  new_password: any;
  retype_password: any;

  constructor(private mydata: AuthService) { }



  passwordchange() {
    let checkpass: any;
    const data2 = sessionStorage.getItem('userdata');
    if (data2) {
      const UserId2 = JSON.parse(data2)
      this.checkuser = UserId2.userId;
      checkpass = UserId2.password;
    }


    this.mydata.getdata().subscribe((response) => {
      this.Username = response.findIndex((user: any) => user.userId === this.checkuser);
      const userinformetion = this.Username.password;

      if (this.Username !== -1) {

        const userData5 = response[this.Username];


        if (checkpass === this.old_password) {

          if (this.new_password === this.retype_password) {
            const payload = {
              action: "update",
              name: userData5.name,
              userId: userData5.userId,
              password: this.new_password,
              role: userData5.role,
              profileImages: userData5.profileImages || ""
            };

            this.mydata.updateUserPassword(payload).subscribe(
              (res) => {
                alert("Password updated successfully");
                console.log(res);
                this.old_password = '';
                this.new_password = '';
                this.retype_password = '';
              },
              (err) => {
                alert("Error while updating password");
                console.error(err);
              }
            );




          }
          else {
            alert("new password and retype password is Wrong");
          }
        }
        else {
          alert("old password is Wroung");
        }
      }

    });
  }

}
