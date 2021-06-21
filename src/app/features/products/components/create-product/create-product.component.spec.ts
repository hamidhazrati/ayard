import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MockComponent, MockHelper } from 'ng-mocks';
import { of } from 'rxjs';
import { ProductService } from '@app/features/products/services/product.service';
import { CreateProductFormComponent } from '@app/features/products/components/create-product/create-product-form/create-product-form.component';
import { createProductCrumb } from '@app/features/products/components/create-product/create-product.crumb';
import { CreateUpdateProduct } from '@app/features/products/models/product.model';
import { CreateProductComponent } from '@app/features/products/components/create-product/create-product.component';
import { SharedModule } from '@app/shared/shared.module';
import { MockService } from '@app/shared/utils/test/mock';
import Mocked = jest.Mocked;

describe('CreateProductComponent', () => {
  let component: CreateProductComponent;
  let fixture: ComponentFixture<CreateProductComponent>;

  let router: Mocked<Router>;
  let crumbService: Mocked<CrumbService>;
  let productService: Mocked<ProductService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        HttpClientTestingModule,
        SharedModule,
      ],
      declarations: [CreateProductComponent, MockComponent(CreateProductFormComponent)],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService),
        },
        { provide: Router, useValue: router = MockService(Router) },
        {
          provide: ProductService,
          useValue: productService = MockService(ProductService),
        },
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should set breadcrumbs', () => {
    expect(crumbService.setCrumbs).toHaveBeenCalledWith(createProductCrumb());
  });

  it('should redirect to created product ', () => {
    const value = {} as CreateUpdateProduct;

    productService.save.mockImplementation((save) => {
      expect(save).toBe(value);
      return of({ id: '123' });
    });

    const eventEmitter = MockHelper.findOrFail(fixture.debugElement, CreateProductFormComponent)
      .componentInstance.save;

    eventEmitter.emit(value);

    expect(productService.save).toHaveBeenCalledWith(value);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
