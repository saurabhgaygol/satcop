import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {


  userId: string = '';
  password: string = '';
  selectedFile: File | null = null;

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const apiUrl = 'https://script.google.com/macros/s/AKfycbzYI8TauE28bNIqbJqJ5hY_o62GbaTnZd3EGotyvmVrs4p_JUYt6yo5M3zmppDgNvJJPg/exec';

    this.http.get<any[]>(apiUrl).subscribe(users => {
      const user = users.find(u => u.userId === this.userId && u.password === this.password);

      if (user) {
        sessionStorage.setItem('userdata', JSON.stringify(user));
        alert('Login Successful as ' + user.name);

        // Clear inputs
        this.userId = '';
        this.password = '';

        // Navigate based on role
        if (user.role === 'HR') {
          this.router.navigate(['/hr-dashboard']);
        } else if (user.role === 'Manager') {
          this.router.navigate(['/manager-dashboard']);
        } else if (user.role === 'Team') {
          this.router.navigate(['/team-dashboard']);
        } else {
          alert('Unknown role');
        }

      } else {
        alert('Invalid User ID or Password');
      }
    });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  uploadImage(userId: string) {
    if (!this.selectedFile) {
      alert('Please select an image first.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]; // Strip prefix

      const body = {
        action: 'uploadImage',
        userId: userId,
        image: base64,
        filename: this.selectedFile!.name
      };

      const apiUrl = 'https://script.google.com/macros/s/AKfycbxr_cA9eqE9OpQdhIRXJtmForpDXdNekN1dw-gOcIVVgAVgO3hezcs4HgH2nTlNQlwn/exec';

      this.http.post(apiUrl, body).subscribe({
        next: (res: any) => {
          alert('Image uploaded successfully!');
          if (res.url) {
            let userdata = JSON.parse(sessionStorage.getItem('userdata') || '{}');
            userdata.profileImages = res.url;
            sessionStorage.setItem('userdata', JSON.stringify(userdata));
          }
        },
        error: (err) => {
          alert('Image upload failed.');
          console.error(err);
        }
      });
    };

    reader.readAsDataURL(this.selectedFile);
  }




















































  /*
    userId: string = '';
    password: string = '';
  
    constructor(private http: HttpClient, private router: Router) { }
  
    login() {
      const apiUrl = 'https://script.google.com/macros/s/AKfycbyCO2NNWAuNvloO_6wI1hYLqODs63li8-Am3tAL6gzC4rV3xGczoduH7oyIWQKoZdTx_Q/exec';
  
  
      this.http.get<any[]>(apiUrl).subscribe(users => {
        const user = users.find(u => u.userId === this.userId && u.password === this.password);
  
        if (user) {
  
  
          sessionStorage.setItem('userdata', JSON.stringify(user));
          alert('Login Successful as ' + user.Name);
  
  
          this.userId = '';
          this.password = '';
  
          if (user.role === 'HR') {
            this.router.navigate(['/hr-dashboard']);
          } else if (user.role === 'Manager') {
            this.router.navigate(['/manager-dashboard']);
          } else if (user.role === 'Team') {
            this.router.navigate(['/team-dashboard']);
          } else {
            alert('Unknown role');
          }
        } else {
          alert('Invalid User ID or Password');
        }
      });
    }
  
  */
}
