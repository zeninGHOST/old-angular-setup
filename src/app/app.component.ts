import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFiller = false;
  opened = true;
  searchQuery = '';

  menuItems = [
    { icon: 'home', label: 'Home' },
    { icon: 'settings', label: 'Settings' },
    { icon: 'info', label: 'About' },
    { icon: 'mail', label: 'Messages' },
    { icon: 'list', label: 'Tasks'},
    { icon: 'account_circle', label: 'Profile'}
  ];
}
