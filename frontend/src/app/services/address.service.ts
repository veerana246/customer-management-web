import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AddressService {
  private apiUrl = 'http://localhost:4000/api/addresses';

  constructor(private http: HttpClient) {}

  getAddresses(customerId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?customerId=${customerId}`);
  }

  updateAddress(id: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  createAddress(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  deleteAddress(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
