import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from '@app/services/config/config.service';
import {
  CreatedProduct,
  CreateUpdateProduct,
  Product,
  ProductSearch,
} from '@app/features/products/models/product.model';
import { map } from 'rxjs/operators';
import { Rule } from '../models/rule.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  save(product: CreateUpdateProduct): Observable<CreatedProduct> {
    return this.http.post<CreatedProduct>(this.host + '/product', product);
  }

  public validateProductRule(rule: Rule): Observable<Rule> {
    return this.http.post<Rule>(this.host + '/product/rule/validate', rule);
  }

  isProductNameUnique(productCategoryId: string, name: string): Observable<boolean> {
    if (!productCategoryId || !name) {
      return of(true);
    }
    return this.getProducts({ productCategoryId, name }).pipe(
      map((results) => {
        if (!results?.length) {
          return true;
        }

        return !results.find((product) => {
          if (name.length !== product?.name?.length) {
            return false;
          }

          return !name.localeCompare(product?.name, undefined, { sensitivity: 'base' });
        });
      }),
    );
  }

  getProducts(params?: ProductSearch): Observable<Product[]> {
    return this.http.get<Product[]>(this.host + '/product', { params });
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(this.host + `/product/${id}`);
  }

  getParameterDefinitions(): Observable<Product[]> {
    return this.http.get<any[]>(this.host + '/parameter-definitions');
  }
  updateParameter(id: string, parameterName: string, parameterObj: any): Observable<Product[]> {
    return this.http.post<any[]>(
      this.host + `/product/${id}/parameters/${parameterName}`,
      parameterObj,
    );
  }
}
