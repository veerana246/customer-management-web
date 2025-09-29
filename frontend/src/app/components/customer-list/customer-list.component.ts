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
        if (!Array.isArray(data)) {
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
        this.resetAndLoad();
      }, err => {
        console.error(err);
        alert(err?.error?.message || 'Error deleting customer');
      });
    }
  }

  searchByCity(city: string) {
  this.filters.city = city.trim().toLowerCase(); // convert to lowercase
  this.resetAndLoad();
}

searchByState(state: string) {
  this.filters.state = state.trim().toLowerCase();
  this.resetAndLoad();
}

searchByPincode(pincode: string) {
  this.filters.pincode = pincode.trim().toLowerCase();
  this.resetAndLoad();
}

  clearFilters(cityInput?: HTMLInputElement, stateInput?: HTMLInputElement, pinInput?: HTMLInputElement) {
    this.filters = {};
    if (cityInput) cityInput.value = '';
    if (stateInput) stateInput.value = '';
    if (pinInput) pinInput.value = '';
    this.resetAndLoad();
  }
}
