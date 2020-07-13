import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { ProductService } from './../product.service';
import { Product } from './../product.model';

@Component({
  selector: 'app-product-update',
  templateUrl: './product-update.component.html',
  styleUrls: ['./product-update.component.css']
})
export class ProductUpdateComponent implements OnInit {
  product: Product = {
    name: '',
    price: null,
    description: '',
    discount: null,
    priceWithDiscount: null
  };

  form: FormGroup = this.formBuilder.group({
    'name': ['', Validators.required],
    'price': ['', Validators.required],
    'description': ['', Validators.required],
    'discount': ['', Validators.required],
    'priceWithDiscount': [{value: '', disabled: true}, Validators.required]
  });

  constructor(
    private productService: ProductService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.readById(id).subscribe(product => {
      this.product = product;

      /* When retrieving form data from a backend API or service, the setValue() 
       * method should be used - instead of patchValue() - to update the control 
       * to its new value, replacing the old value entirely. Therefore, if any 
       * property or subset collections are missing, it will throw an exception. 
       */
      this.form.setValue({
        name: this.product.name,
        price: this.product.price,
        description: this.product.description,
        discount: this.product.discount,
        priceWithDiscount: this.product.priceWithDiscount,
      });
    });
  }

  descriptionChanged(): void {
    this.product.description = this.form.get('description').value;
  }

  priceChanged(): void {
    const price = this.form.get('price').value;
    this.product.price = this.productService.validatePrice(price);
    this.form.patchValue({ price: this.product.price});
    this.updatePriceWithDiscount();
  }
  
  discountChanged(): void {
    const discount = this.form.get('discount').value;
    this.product.discount = this.productService.validateDiscount(discount);
    this.form.patchValue({ discount: this.product.discount });
    this.updatePriceWithDiscount();
  }

  updatePriceWithDiscount(): void {
    this.product.priceWithDiscount = this.productService.calculatePriceWithDiscount(this.product.price, this.product.discount);
    this.form.patchValue({ priceWithDiscount: this.product.priceWithDiscount });
  }

  updateProduct(): void {
    this.productService.update(this.product).subscribe(() => {
      this.productService.showMessage('Produto alterado com sucesso!');
      this.router.navigate(['/products']);
    });
  }

  cancel(): void {
    this.router.navigate(['/products']);
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.product.name = this.form.get('name').value;

    if (this.product.name.length != 0 && this.product.price != null && this.product.description.length != 0 && this.product.discount != null) {
      if (this.product.discount == 100) {
        this.productService.openDiscountDialog().subscribe((confirmation) => {
          if (confirmation) this.updateProduct();
        });
      } else {
        this.updateProduct();
      }
    }
  }

}
