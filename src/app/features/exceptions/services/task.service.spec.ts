import { HttpParams } from '@angular/common/http';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { TaskService } from './task.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ConfigService } from '@app/services/config/config.service';
import { MockService } from 'ng-mocks';
import { PageRequestFactory } from '@app/shared/pagination';
import Mocked = jest.Mocked;

const API_URL = 'http://localhost:8080';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  const mockConfigService: Mocked<ConfigService> = MockService(ConfigService) as Mocked<
    ConfigService
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService, { provide: ConfigService, useValue: mockConfigService }],
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
    mockConfigService.getApiUrl.mockReturnValue(API_URL);
  });

  describe('GIVEN the TaskService is initialised', () => {
    test('THEN it should be created', () => {
      expect(service).toBeTruthy();
    });

    describe('getTasks', () => {
      test('THEN it should call the API correctly and return an observable', fakeAsync(() => {
        const params: HttpParams = new PageRequestFactory().createHttpParams();
        service.getTasks(params).subscribe();

        tick();

        const req = httpMock.expectOne(`${API_URL}/tasks?page=0&size=10`);

        expect(req.request.method).toEqual('GET');
        expect(req.request.urlWithParams).toEqual(`${API_URL}/tasks?page=0&size=10`);
      }));
    });

    describe('updateTask', () => {
      test('THEN it should call the post api correctly and return an observable', fakeAsync(() => {
        service.updateTasks(['1234'], 'IN_REVIEW_RELEASE', 'valid reason').subscribe();
        tick();

        const req = httpMock.expectOne(`${API_URL}/tasks/change-status`);

        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual({
          taskIds: ['1234'],
          status: 'IN_REVIEW_RELEASE',
          reason: 'valid reason',
        });
      }));
    });
  });
});
