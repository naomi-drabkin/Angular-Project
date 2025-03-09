import { Injectable } from '@angular/core';
import { Course } from '../../../models/Course';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiCoursesService {

  private apiUrl = 'http://localhost:3000/api/courses';
  private coursesSubject = new BehaviorSubject<Course[]>([]);
  courses$ = this.coursesSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCoursesByStudent(id: number): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl + '/student/' + id, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }

  CourseById(id: number): Observable<Course | null> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }



  postNewCourse(title: string, description: string, teacher: number): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, {
      title,
      description,
      teacherId: teacher
    }, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }

  putCourse(id: number, title: string, description: string, teacher: number): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, {
      title,
      description,
      teacherId: teacher
    }, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }

  joinAuth(userId: number, courseId: number) {
    return this.http.post<Course>(`${this.apiUrl}/${courseId}/enroll`, { userId }, {
      headers: { Authorization: `Bearer ${sessionStorage.getItem('userToken')}` }
    })
  }



  leaveAuth(userId: number, courseId: number) {
    return this.http.delete<Course>(`${this.apiUrl}/${courseId}/unenroll`,
      {
        body: { userId: userId },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('userToken')}`
        }
      }
    )
  }
}


