import { Injectable } from '@angular/core';
import { Subject } from '../models/subject.interface';
import { Video } from '../models/video.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SubjectVideosService {
  private subjectsUrl = `${environment.apiUrl}/subjects`;
  private videosUrl = `${environment.apiUrl}/videos`;

  constructor(private http: HttpClient) {}

  // Attach the JWT from localStorage so authMiddleware lets the request through
  // private get authHeaders(): HttpHeaders {  // get -> reads fresh from localStorage every time it's accessed unlike plain variable
  //   const token = localStorage.getItem('token') ?? '';
  //   return new HttpHeaders({ Authorization: `Bearer ${token}` });
  // }

  // Subjects
  getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.subjectsUrl, {
      // headers: this.authHeaders,
    });
  }

  createSubject(formData: FormData): Observable<Subject> {
    return this.http.post<Subject>(this.subjectsUrl, formData, {
      // headers: this.authHeaders,
    });
  }

  updateSubject(id: number, formData: FormData): Observable<Subject> {
    return this.http.put<Subject>(`${this.subjectsUrl}/${id}`, formData, {
      // headers: this.authHeaders,
    });
  }

  deleteSubject(id: number): Observable<any> {
    return this.http.delete(`${this.subjectsUrl}/${id}`, {
      // headers: this.authHeaders,
    });
  }

  // Videos
  getVideosBySubjectId(id: number): Observable<Video[]> {
    return this.http.get<Video[]>(`${this.videosUrl}?subjectId=${id}`, {
      // headers: this.authHeaders,
    });
  }

  createVideo(video: Partial<Video>): Observable<Video> {
    return this.http.post<Video>(this.videosUrl, video, {
      // headers: this.authHeaders,
    });
  }

  updateVideo(id: number, video: Partial<Video>): Observable<Video> {
    return this.http.put<Video>(`${this.videosUrl}/${id}`, video, {
      // headers: this.authHeaders,
    });
  }

  deleteVideo(id: number): Observable<any> {
    return this.http.delete(`${this.videosUrl}/${id}`, {
      // headers: this.authHeaders,
    });
  }
}
