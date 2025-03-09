import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../app/services/ApiAuth/auth.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  showChild: boolean = false;
  constructor(private router: Router, public authServic: AuthService) { }

  ngOnChanges() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof window !== 'undefined' && window.history.state) {
          const state = window.history.state;
          if (state.returnedValue) {
            this.showChild = state.returnedValue;
            console.log('🔹 קיבלנו מהבן:', this.showChild);
          }
        }
      }
    });
  }

  gotoChild(val: string) {
    this.showChild = !this.showChild;
    this.router.navigate(['/' + val]);
  }

  isAdmin() {
    return this.authServic.isAdmin();
  }
}
