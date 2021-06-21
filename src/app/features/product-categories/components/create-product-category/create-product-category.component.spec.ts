import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CrumbService } from '@app/services/crumb/crumb.service';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { MockComponent, MockHelper, MockService } from 'ng-mocks';
import { of } from 'rxjs';
import Mocked = jest.Mocked;
import { CreateProductCategoryComponent } from '@app/features/product-categories/components/create-product-category/create-product-category.component';
import { CreateUpdateProductCategory } from '@app/features/product-categories/models/product-category.model';
import { createProductCategoryCrumb } from '@app/features/product-categories/components/create-product-category/create-product-category.crumb';
import { ProductCategoryService } from '@app/features/product-categories/services/product-category.service';
import { CreateProductCategoryFormComponent } from '@app/features/product-categories/components/create-product-category/create-product-category-form/create-product-category-form.component';

describe('WHEN CreateProductCategoryComponent is created', () => {
  let component: CreateProductCategoryComponent;
  let fixture: ComponentFixture<CreateProductCategoryComponent>;

  let router: Mocked<Router>;
  let crumbService: Mocked<CrumbService>;
  let productCategoryService: Mocked<ProductCategoryService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatCardModule,
        MatInputModule,
        MatSelectModule,
        HttpClientTestingModule,
      ],
      declarations: [
        CreateProductCategoryComponent,
        MockComponent(CreateProductCategoryFormComponent),
      ],
      providers: [
        { provide: FormBuilder, useValue: new FormBuilder() },
        {
          provide: CrumbService,
          useValue: crumbService = MockService(CrumbService) as Mocked<CrumbService>,
        },
        { provide: Router, useValue: router = MockService(Router) as Mocked<Router> },
        {
          provide: ProductCategoryService,
          useValue: productCategoryService = MockService(ProductCategoryService) as Mocked<
            ProductCategoryService
          >,
        },
        HttpClientTestingModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('THEN breadcrumbs should be set', () => {
    expect(crumbService.setCrumbs).toHaveBeenCalledWith(createProductCategoryCrumb());
  });

  it('THEN should redirect to list of products in case of emitted "save" event', () => {
    const createUpdateProductCategory = {} as CreateUpdateProductCategory;

    productCategoryService.save.mockImplementation((save) => {
      expect(save).toBe(createUpdateProductCategory);
      return of({ id: '123' });
    });

    const eventEmitter = MockHelper.findOrFail(
      fixture.debugElement,
      CreateProductCategoryFormComponent,
    ).componentInstance.save;

    eventEmitter.emit(createUpdateProductCategory);

    expect(productCategoryService.save).toHaveBeenCalledWith(createUpdateProductCategory);
    expect(router.navigate).toHaveBeenCalledWith(['/products']);
  });
});
