import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomerService {
  private apiUrl = 'http://localhost:4000/api/customers';

  constructor(private http: HttpClient) {}

  getCustomers(filters?: any): Observable<any[]> {
    let query = '';
    if (filters) {
      const params = new URLSearchParams(filters).toString();
      query = `?${params}`;
    }
    return this.http.get<any[]>(this.apiUrl + query);
  }

  getCustomer(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createCustomer(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateCustomer(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCustomer(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
