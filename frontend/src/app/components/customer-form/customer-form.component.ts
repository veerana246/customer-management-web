import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CustomerService } from '../../services/customer.service';
import { AddressService } from '../../services/address.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  customerForm!: FormGroup;
  isEdit = false;
  customerId!: string;

  constructor(
    private fb: FormBuilder,
    private customerService: CustomerService,
    private addressService: AddressService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      addresses: this.fb.array([])
    });

    this.route.params.subscribe(params => {
      if(params['id']) {
        this.isEdit = true;
        this.customerId = params['id'];
        this.loadCustomer(params['id']);
      } else this.addAddress();
    });
  }

  get addresses(): FormArray { return this.customerForm.get('addresses') as FormArray; }

  addAddress(): void {
    this.addresses.push(this.fb.group({
      address_line: ['', Validators.required],
      city: [''],
      state: [''],
      pincode: [''],
      country: ['IN'],
      is_primary: [false]
    }));
  }

  removeAddress(index: number) { this.addresses.removeAt(index); }

  loadCustomer(id: string) {
    this.customerService.getCustomer(id).subscribe(c => {
      this.customerForm.patchValue(c);
      this.addresses.clear();
      if(c.addresses?.length) {
  c.addresses.forEach((a: any) => this.addresses.push(this.fb.group(a)));
}
      else this.addAddress();
    });
  }

  submit() {
    if(this.customerForm.invalid) return;
    if(this.isEdit) {
      this.customerService.updateCustomer(this.customerId, this.customerForm.value)
        .subscribe(() => this.router.navigate(['/customers']));
    } else {
      this.customerService.createCustomer(this.customerForm.value)
        .subscribe(() => this.router.navigate(['/customers']));
    }
  }
}
