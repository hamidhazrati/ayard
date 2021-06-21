import { Injectable } from '@angular/core';
import {
  CreatedProductCategory,
  CreateUpdateProductCategory,
  ProductCategory,
} from '@app/features/product-categories/models/product-category.model';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  save(product: CreateUpdateProductCategory): Observable<CreatedProductCategory> {
    return this.http.post<ProductCategory>(this.host + '/product-category', product);
  }

  getByName(name: string): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.host + '/product-category', {
      params: new HttpParams().set('name', name),
    });
  }

  isUnique(name: string): Observable<boolean> {
    return this.getByName(name).pipe(
      map((productCategories) => !productCategories || productCategories.length === 0),
    );
  }

  getCategories(includeProducts: boolean = false): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(this.host + '/product-category', {
      params: { includeProducts: includeProducts.toString() },
    });
  }

  getProductCategoryById(id: string): Observable<ProductCategory> {
    return this.http.get<ProductCategory>(this.host + `/product-category/${id}`);
  }
}
