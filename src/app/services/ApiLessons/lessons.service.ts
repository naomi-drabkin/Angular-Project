import { Injectable, Input } from '@angular/core';
import { Course } from '../../../models/Course';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { lessons } from '../../../models/Lesson';
import { ActivatedRoute } from '@angular/router';
import { ApiCoursesService } from '../ApiCourses/api-courses.service';

@Injectable({
  providedIn: 'root'
})
export class LessonsService {

private lessonsSubject = new BehaviorSubject<lessons[]>([]);
lessons$ = this.lessonsSubject.asObservable();
coursesList!:Observable<Course[]>;
private apiUrl = 'http://localhost:3000/api/courses';

constructor(private http: HttpClient, private route: ActivatedRoute,
  private CourseApi:ApiCoursesService
) {
 

}

getAllLessons(courseId:number):Observable<lessons[]>{
  return this.http.get<lessons[]>(`${this.apiUrl}/${courseId}/lessons`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}`}
  });

  
}

getLessonById(id: number,courseId:number): Observable<lessons> {
  return this.http.get<lessons>(`${this.apiUrl}/${courseId}/lessons/${id}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
  });
}

postLesson(title: string, content: string,courseId:number): Observable<lessons> {  
  return this.http.post<lessons>(`${this.apiUrl}/${courseId}/lessons`, { title, content }, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
  }).pipe(
    tap(lesson => {     
      this.lessonsSubject.next([...this.lessonsSubject.value, lesson]);
      this.getAllLessons(courseId);
    })
  );
}

putLesson(id: number, title: string, content: string,courseId:number): Observable<lessons> {
  return this.http.put<lessons>(`${this.apiUrl}/${courseId}/lessons/${id}`, {
    title:title,
    content:content,
    courseId:courseId
  }, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
  });
}

deleteLesson(id: number,courseId:number): Observable<void> {
  return this.http.delete<void>(`${this.apiUrl}/${courseId}/lessons/${id}`, {
    headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
  });
}

}
