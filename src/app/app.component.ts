import { HttpClient} from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterModule,RouterOutlet,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

userId: string ='';
password: string = '';

constructor(private http: HttpClient, private router: Router) {}

login()
{
  const apiUrl='https://script.google.com/macros/s/AKfycbwvApBpjcyB29iQ3dX47M7LxweE36mR--I_EOotipcas5kfrC0F5unovFMr2BG2p4Pwpg/exec';

  this.http.get<any[]>(apiUrl).subscribe(users =>{
    const user=users.find(u => u.userId === this.userId && u.password === this.password);

    if (user) {
    
        localStorage.setItem('role', user.role);
        alert('Login Successful as ' + user.role);
        
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
 
}
