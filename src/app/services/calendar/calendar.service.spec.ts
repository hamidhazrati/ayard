import { TestBed } from '@angular/core/testing';

import { CalendarService } from './calendar.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config/config.service';
import { MockService } from '@app/shared/utils/test/mock';
import { Calendar } from './calendar.model';
import Mocked = jest.Mocked;

describe('CalendarService', () => {
  const API_URL = 'http://localhost';
  let service: CalendarService;
  let httpMock: HttpTestingController;
  let configService: Mocked<ConfigService>;

  const stubCalendars: Calendar[] = [
    {
      reference: 'GBP',
      startDate: 'string',
      endDate: 'string',
      active: true,
      description: 'string',
    },
    {
      reference: 'EUR',
      startDate: 'string',
      endDate: 'string',
      active: true,
      description: 'string',
    },
    {
      reference: 'JPY',
      startDate: 'string',
      endDate: 'string',
      active: true,
      description: 'string',
    },
  ];

  beforeEach(() => {
    configService = MockService(ConfigService);
    configService.getApiUrl.mockReturnValue(API_URL);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CalendarService, { provide: ConfigService, useValue: configService }],
    });

    service = TestBed.inject(CalendarService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    service = TestBed.inject(CalendarService);
    expect(service).toBeTruthy();
  });
});
