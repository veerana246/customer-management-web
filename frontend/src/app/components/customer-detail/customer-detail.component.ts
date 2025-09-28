import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-detail',
  templateUrl: './customer-detail.component.html',
  styleUrls: ['./customer-detail.component.css']
})
export class CustomerDetailComponent implements OnInit {
  customer: any = null;
  loading = false;

  constructor(private route: ActivatedRoute, private router: Router, private customerService: CustomerService) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => { if(params['id']) this.loadCustomer(params['id']); });
  }

  loadCustomer(id: string) {
    this.loading = true;
    this.customerService.getCustomer(id).subscribe(c => { this.customer = c; this.loading = false; }, () => this.loading = false);
  }

  editCustomer() { this.router.navigate(['/customers/edit', this.customer.id]); }
  backToList() { this.router.navigate(['/customers']); }
}
