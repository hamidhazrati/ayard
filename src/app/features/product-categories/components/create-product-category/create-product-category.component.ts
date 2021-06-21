import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { CreateUpdateProductCategory } from '@app/features/product-categories/models/product-category.model';
import { createProductCategoryCrumb } from '@app/features/product-categories/components/create-product-category/create-product-category.crumb';

@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
  styleUrls: ['./create-product-category.component.scss'],
})
export class CreateProductCategoryComponent implements OnInit {
  serverError?: any;

  constructor(
    private productCategoryService: ProductCategoryService,
    private crumbService: CrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(createProductCategoryCrumb());
  }

  handleSubmit(productCategory: CreateUpdateProductCategory) {
    this.productCategoryService.save(productCategory).subscribe(
      (res) => {
        this.router.navigate([`/products`]);
      },
      (error) => {
        this.serverError = error.error;
      },
    );
  }
}
