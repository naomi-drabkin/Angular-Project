import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { User } from '../../../models/User';
import { Observable } from 'rxjs';
import { AuthService } from '../../../app/services/ApiAuth/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';

import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-users-for-admin',
  standalone: true,
  imports: [ReactiveFormsModule,RouterOutlet,AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDialogModule,
    MatToolbarModule,
    MatButtonModule
  ],
  templateUrl: './users-for-admin.component.html',
  styleUrl: './users-for-admin.component.css'
})
export class UsersForAdminComponent{
  showChild: boolean = false;
  AllUsers$!: Observable<User[]>;
  user?: User;
  id!: number;
  Form_new_user!: FormGroup;
  receivedValue: boolean = false;
  newUser!:number;
  @Output() backToParent = new EventEmitter<void>();
  
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.Form_new_user = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', Validators.required],
      role: ['', Validators.required],
    });
    this.AllUsers$ = this.authService.getAllUsers();
  }

  getUsers() {
    this.AllUsers$ = this.authService.getAllUsers();
  }

  getById(id: number) {
    this.authService.getUserById(id).subscribe({
      next: (user) => {
        this.user = user as User;
      },
      error: (error) => alert(" לא קיים ID"),
    });
  }


  updateUser(id:number) {
    const model = this.Form_new_user.value;
    const userUpdate = {
      name: model['name'],
      password: model['password'],
      email: model['email'],
      role: model['role'],
    };

    this.authService.updateUser(userUpdate as User, id).subscribe({
      next: () => {
        this.AllUsers$ = this.authService.getAllUsers();
      },
      error: (error) => alert("לא ניתן לעדכן משתמש זה"),
    });
  }

  deleteUser(id: number) {
    this.authService.deleteUser(id).subscribe({
      next: () => {
        this.AllUsers$ = this.authService.getAllUsers();
      },
      error: (error) => alert("לא ניתן למחוק משתמש זה"),
    });
  }

  get formFields(): string[] {
    console.log(this.Form_new_user.value);
    return Object.keys(this.Form_new_user.value);
  }

  goBack() {
    this.backToParent.emit();

    this.router.navigate(['/'], { relativeTo: this.route, state: { returnedValue: false } }).then(()=>
      this.router.navigate(['/homepage'])
    );
  }

  
  isAdmin(){
    return this.authService.isAdmin();
  }
}