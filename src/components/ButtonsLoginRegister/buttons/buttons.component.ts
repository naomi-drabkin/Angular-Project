import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { LoginRegisterComponent } from '../../Login&Register/login-register/login-register.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-buttons',
  standalone: true,
  imports: [LoginRegisterComponent,MatButtonModule,
    RouterOutlet
  ],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonsComponent implements OnChanges{
  userStatus?: string;
  h?: number;
  showPopup:boolean = false;
  ngOnChanges(changes: SimpleChanges): void {
  }
  onClick(val: string) {
    this.userStatus = val;
    this.showPopup = true;

    
  }
  user() {
    this.h = 1;
  }
  clear(){
    this.userStatus = '';
  }

  closePopup() {
    this.showPopup = false;
  }

}
