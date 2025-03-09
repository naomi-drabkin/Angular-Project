import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LessonsService } from '../../app/services/ApiLessons/lessons.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { lessons } from '../../models/Lesson';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../app/services/ApiAuth/auth.service';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-lessons',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet,AsyncPipe
    ,MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  templateUrl: './lessons.component.html',
  styleUrl: './lessons.component.css'
})
export class LessonsComponent {
  @Input() showChild!: boolean;
  @Output() backToParent = new EventEmitter<void>();

  Lessons: lessons[] = [];
  l?: lessons;
  Form_mew_lessons!: FormGroup;
  newLessons!: number;
  lessons$!: Observable<lessons[]>;
  courseId!: number;

  constructor(
    private lessonService: LessonsService, private fb: FormBuilder, private router: Router,
    private route: ActivatedRoute
    , private authService:AuthService
   ) {
    console.log(this.router.url);

    this.Form_mew_lessons = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
   
  }
  

  reset = () => {

    this.route.paramMap.subscribe(params => {
      console.log(this.router.url);

      console.log("******" + params.get('courseId'));
      const id = params.get('courseId');
      if (id) {
        this.lessons$ = this.lessonService.getAllLessons(+id);
        this.courseId = +id; // המרה למספר ועדכון השירות
      }
    });
  }

  async getLessons() {
    await this.reset();
    this.lessonService.getAllLessons(this.courseId).subscribe({
      next: (lessons) => {
        this.Lessons = lessons;
      },
      error: (error) => alert("לא ניתן להציג את רשימת השיעורים")
    });
  }

  getById(id: number) {
    this.lessonService.getLessonById(id, this.courseId).subscribe({
      next: (lesson) => {
        this.l = lesson || {} as lessons;
      },
      error: (error) => alert("לא קיים ID")
    });
  }

  get formFields(): string[] {
    console.log(this.Form_mew_lessons.value);
    return Object.keys(this.Form_mew_lessons.value);
  }

  postNewLesson() {
    const model = this.Form_mew_lessons.value;    
    this.lessonService.postLesson(model['title'], model['content'], this.courseId).subscribe(
      {
        next: () => {
          this.lessons$ = this.lessonService.getAllLessons(this.courseId);
        },
        error: (error) => alert("לא ניתן להוסיף שיעור זה")
      }
    );
    this.Form_mew_lessons.reset();
  }

  deleteLesson(id: any) {
    const lessonId = Number(id);
    this.lessonService.deleteLesson(lessonId, this.courseId).subscribe({
      next: () => {
        this.lessons$ =  this.lessonService.getAllLessons(this.courseId);
      },
      error: (error) => alert("לא ניתן למחוק שיעור זה")
    });
  }

  updateLesson(id: number) {
    const model = this.Form_mew_lessons.value;
    this.lessonService.putLesson(id, model['title'], model['content'], this.courseId).subscribe({
      next: () => {
        this.lessons$ = this.lessonService.getAllLessons(this.courseId);
      },
      error: (error) => alert("לא ניתן לעדכן שיעור זה")
    });
    this.Form_mew_lessons.reset();
  }
  goBack() {
    this.backToParent.emit();
    this.router.navigate(['/'], { relativeTo: this.route, state: { returnedValue: false } }).then(()=>
      this.router.navigate(['/courses'])
    );
   
  }

  isTeacher(){
    return this.authService.isTeacher();
  }
}
