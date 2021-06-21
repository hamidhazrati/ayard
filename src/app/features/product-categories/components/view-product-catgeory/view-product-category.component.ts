import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { ActivatedRoute } from '@angular/router';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { ProductCategory } from '@app/features/product-categories/models/product-category.model';
import { viewProductCategoryCrumb } from '@app/features/product-categories/components/view-product-catgeory/view-product-category.crumb';

@Component({
  selector: 'app-view-product-category',
  templateUrl: './view-product-category.component.html',
  styleUrls: ['./view-product-category.component.scss'],
})
export class ViewProductCategoryComponent implements OnInit {
  productCategory: ProductCategory;

  constructor(
    private route: ActivatedRoute,
    private productCategoryService: ProductCategoryService,
    private crumbService: CrumbService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    this.productCategoryService.getProductCategoryById(id).subscribe((data: ProductCategory) => {
      this.productCategory = data;
      this.crumbService.setCrumbs(viewProductCategoryCrumb(data));
    });
  }
}
