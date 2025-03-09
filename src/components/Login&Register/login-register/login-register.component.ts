import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../../models/User';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../app/services/ApiAuth/auth.service';
import { Router, RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';


@Component({
  selector: 'app-login-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule, MatDialogModule, MatIconModule,
  ],
  templateUrl: './login-register.component.html',
  styleUrl: './login-register.component.css'
})
export class LoginRegisterComponent implements OnInit {
  @Input() userStatus!: string;
  Login_Register_form!: FormGroup;
  router = inject(Router);
  private location = inject(Location);
  cancle: boolean = true;
  @Output() closePopup = new EventEmitter<void>();


  isPopupOpen = true;
  constructor(private fb: FormBuilder,
    private cookiesService: CookieService,
    private http: HttpClient,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.Login_Register_form = this.fb.group({
      password: ['', Validators.required],
      email: ['', Validators.email]
    })

    if (this.userStatus === 'register') {
      this.Login_Register_form.addControl('name', new FormControl('', Validators.required));
      this.Login_Register_form.addControl('role', new FormControl('', Validators.required));
    }

  }
  get formFields(): string[] {
    return Object.keys(this.Login_Register_form.controls);
  }

  async onSubmit() {
    try {
      const data = this.Login_Register_form.value;
      type userPartial = Partial<User>;

      let user: userPartial = {
        email: data['email'],
        password: data['password'],
      }

      if (this.userStatus === 'register') {
        user['name'] = data['name'],
          user['role'] = data['role']
      }
      console.log(user);
      this.authService.postLoginOrRegister(this.userStatus, user).subscribe({
        next: (res) => {
          console.log("Response:", res);
          sessionStorage.setItem('userToken', res.token);
          console.log(res.userId.toString());

          sessionStorage.setItem('userId', res.userId.toString());

          this.router.navigate(["/homepage"]);
        },
        error: (err) => {
          alert("תקלה בהתחברות - בדוק שוב את הפרטים המוכנסים")
        }
      });
    }
    catch (error) {
      alert("ארעה תקלה  - הכנס שוב")

    }
  }
  enter() {
    this.closePopup.emit();
  }
}

