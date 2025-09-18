import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URLS, environment } from '@monorepo-bb-app/shared';

@Injectable({
  providedIn: 'root',
})
export class ForgotPasswordService {
    private readonly BASE_URL = `${environment.API_URL}${API_URLS.FORGOT_PASSWORD}`;

  constructor(private http: HttpClient) {}

  resetPassword(payload: any): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/reset`, payload);
  }

  validateOtp(email: string, otp: string): Observable<any> {
    return this.http.post<any>(`${this.BASE_URL}/validate`, {
      email,
      code: otp.toString(),
      userTypeId: 1,
    });
  }
}