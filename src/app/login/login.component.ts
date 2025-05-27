import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule} from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterModule,FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  
userId: string ='';
password: string = '';

constructor(private http: HttpClient, private router: Router) {}

login()
{
  const apiUrl='https://script.google.com/macros/s/AKfycbyCO2NNWAuNvloO_6wI1hYLqODs63li8-Am3tAL6gzC4rV3xGczoduH7oyIWQKoZdTx_Q/exec';
 

  this.http.get<any[]>(apiUrl).subscribe(users =>{
    const user=users.find(u => u.userId === this.userId && u.password === this.password);

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
 

}
