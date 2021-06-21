import { Component, OnInit } from '@angular/core';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { listProductsCrumb } from '@app/features/products/components/list-products/list-products.crumb';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss'],
})
export class ListProductsComponent implements OnInit {
  displayedColumns: string[] = ['name'];
  productRows: ProductRow[] = [];

  constructor(
    private productCategoryService: ProductCategoryService,
    private crumbService: CrumbService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.crumbService.setCrumbs(listProductsCrumb());
    this.refresh();
  }

  refresh() {
    this.productCategoryService.getCategories(true).subscribe((categories) => {
      this.productRows = [];
      for (const category of categories) {
        this.addProductCategoryRow(category.id, category.name);
        for (const product of category.products) {
          this.addProductRow(product.id, product.name);
        }
      }
    });
  }

  private addProductCategoryRow(id: string, name: string) {
    this.productRows.push({ id, name, isParent: true });
  }

  private addProductRow(id: string, name: string) {
    this.productRows.push({ id, name, isParent: false });
  }

  viewProductCategory(id: string) {
    this.router.navigate(['/product-categories', id]);
  }

  viewProduct(id: string) {
    this.router.navigate(['/products', id]);
  }
}

export interface ProductRow {
  id: string;
  name: string;
  isParent: boolean;
}
