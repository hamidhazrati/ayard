import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { CreateUpdateProduct } from '@app/features/products/models/product.model';
import { ProductService } from '@app/features/products/services/product.service';
import { createProductCrumb } from '@app/features/products/components/create-product/create-product.crumb';

@Component({
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss'],
})
export class CreateProductComponent implements OnInit {
  serverError?: any;

  @ViewChild('sideBarContainer', { static: true })
  public sideBarContainerRef: ElementRef;

  constructor(
    private productService: ProductService,
    private crumbService: CrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(createProductCrumb());
  }

  handleSubmit(product: CreateUpdateProduct) {
    this.productService.save(product).subscribe(
      (res) => {
        this.router.navigate(['/products']);
      },
      (error) => {
        this.serverError = error.error;
      },
    );
  }
}
