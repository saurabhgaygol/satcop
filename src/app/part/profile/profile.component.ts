import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  
})
export class ProfileComponent {
dropdownOpen = false;

  toggleDropdown(event: Event) {
    event.stopPropagation(); 
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    this.dropdownOpen = false;
  }

  changePassword() {
    console.log("Change Password clicked");
    
  }

  signOut() {
    console.log("Sign Out clicked");
    
  }
}
