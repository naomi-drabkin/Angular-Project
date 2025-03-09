import { Component } from '@angular/core';
import { ButtonsComponent } from '../ButtonsLoginRegister/buttons/buttons.component';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [ButtonsComponent
    ,RouterOutlet,MatToolbarModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

}
