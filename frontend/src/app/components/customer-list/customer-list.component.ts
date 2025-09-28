// src/app/components/customer-list/customer-list.component.ts
import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  customers: any[] = [];
  filters: any = {};
  page = 1;
  pageSize = 20;
  loading = false;
  totalLoaded = 0;
  finished = false; // no more pages

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.resetAndLoad();
  }

  private resetAndLoad() {
    this.page = 1;
    this.customers = [];
    this.finished = false;
    this.loadCustomers();
  }

  loadCustomers(): void {
    if (this.loading || this.finished) return;
    this.loading = true;
    const params: any = { ...this.filters, page: this.page, pageSize: this.pageSize };
    this.customerService.getCustomers(params).subscribe(
      (data: any[]) => {
        // backend returns an array (possibly empty)
        if (!Array.isArray(data)) {
          // defensive: if backend wrapped results, adjust here
          console.warn('Unexpected customers payload', data);
          this.loading = false;
          return;
        }
        if (data.length === 0) {
          this.finished = true;
        } else {
          this.customers = [...this.customers, ...data];
          this.totalLoaded = this.customers.length;
        }
        this.loading = false;
      },
      (err) => { console.error(err); this.loading = false; }
    );
  }

  loadMore(): void {
    if (this.loading || this.finished) return;
    this.page += 1;
    this.loadCustomers();
  }

  viewCustomer(id: string) { this.router.navigate(['/customers/view', id]); }
  editCustomer(id: string) { this.router.navigate(['/customers/edit', id]); }

  deleteCustomer(id: string) {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        // after delete, reset listing to be safe
        this.resetAndLoad();
      }, err => {
        console.error(err);
        alert(err?.error?.message || 'Error deleting customer');
      });
    }
  }

  searchByCity(city: string) { this.filters.city = city; this.resetAndLoad(); }
  searchByState(state: string) { this.filters.state = state; this.resetAndLoad(); }
  searchByPincode(pincode: string) { this.filters.pincode = pincode; this.resetAndLoad(); }
  clearFilters() { this.filters = {}; this.resetAndLoad(); }
}
