import { Component, EventEmitter, Inject, inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { ApiCoursesService } from '../../../app/services/ApiCourses/api-courses.service';
import { Course } from '../../../models/Course';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '../../../app/services/ApiAuth/auth.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    { provide: MatDialogRef, useValue: {} }
  ],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  showChild: boolean = false;
  Courses: Course[] = [];
  CoursesUser: Course[] = [];
  c!: Course;
  CourseToShow?: Course;
  btn!: boolean;
  Form_mew_course!: FormGroup;
  newCourse: number = 0;
  router = inject(Router);
  enrolledCourses!: Course[];
  courses$!: Observable<Course[]>;
  receivedValue: boolean = false;
  @Output() backToParent = new EventEmitter<void>();
  showPopup!: boolean;
  closeDialog: number = 0;
  getByIdMode!: boolean;

  constructor(public CourseService: ApiCoursesService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {
    this.Form_mew_course = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      teacher: ['', Validators.required]
    });
  }

  ngOnInit() {

    this.CourseService.getCoursesByStudent(this.getUserID()).subscribe(
      (courses) => { this.enrolledCourses = courses }
    )
    this.courses$ = this.CourseService.getAllCourses();
  }

  isEnrolled(course: Course) {
    return this.enrolledCourses.find(c => c.id === course.id) !== undefined;
  }

  ngOnChanges() {
    () => this.reset();
  }
  reset = () => {
    console.log("return father");

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

  goToChild(c: number) {
    this.showChild = !this.showChild;
    this.router.navigate(["/courses", c, 'lessons']);
  }

  goBack() {
    this.backToParent.emit();
    this.router.navigate(['/'], { relativeTo: this.route, state: { returnedValue: false } }).then(() =>
      this.router.navigate(['/homepage'])
    );
  }
  handleChildReturn(value: boolean) {
    this.receivedValue = value;
    this.showChild = false;
  }
  async getCourses() {
    (await this.CourseService.getAllCourses())
      .subscribe(courses => { this.Courses = courses; },
        error => alert("לא ניתן להציג את השיעורים"))
  };


  get formFields(): string[] {
    console.log(this.Form_mew_course.value);
    return Object.keys(this.Form_mew_course.value);
  }


  getById(id: number) {
    this.CourseService.CourseById(+id).subscribe({
      next: (course) => {
        this.CourseToShow = course || {} as Course;
      },
      error: (error) => alert(" לא קיים id")
    });
  }
  getByStudentId() {
    this.CourseService.getCoursesByStudent(this.getUserID()).subscribe({

      next: (course) => {
        this.CoursesUser = course || {} as Course;
      },
      error: (error) => alert("לא ניתן להציג את רשימת הקורסים שלך")
    });
  }

  postNewCourse() {
    const model = this.Form_mew_course.value;

    this.CourseService.postNewCourse(model['title'], model['description'], +model['teacher'])
      .subscribe({
        next: (course) => {
          console.log("Received course from server:", course);
          this.courses$ = this.CourseService.getAllCourses(); // לאחר עדכון, נטען מחדש את הקורסים
          this.Form_mew_course.reset();
        },
        error: (error) => alert("לא ניתן להוסיף קורס זה")
      });
      this.Form_mew_course.reset();

  }

  deleteCourse(id: any) {
    const courseId = Number(id);
    this.CourseService.deleteCourse(courseId).subscribe({
      next: () => {
        this.courses$ = this.CourseService.getAllCourses();
      },
      error: (error) => alert("לא ניתן למחוק קורס זה")
    });
  }

  updateCourse(id: number) {
    const model = this.Form_mew_course.value;

    this.CourseService.putCourse(id, model['title'], model['description'], +model['teacher'])
      .subscribe({
        next: () => {
          this.courses$ = this.CourseService.getAllCourses();
        },
        error: (error) => alert("לא ניתן לעדכן קורס זה")
      });
      this.Form_mew_course.reset();
  }

  getUserID(): number {
    const ID = sessionStorage.getItem('userId');
    if (ID) {
      return +ID;
    }
    return -1;

  }


  joinAuth(course: Course) {
    this.CourseService.joinAuth(this.getUserID(), course.id).subscribe(
      () => { this.enrolledCourses.push(course); }
    )
  }

  leaveAuth(course: Course) {
    this.CourseService.leaveAuth(this.getUserID(), course.id).subscribe(() => {
      this.enrolledCourses = this.enrolledCourses.filter(c => c.id !== course.id);
    });
  }
}
