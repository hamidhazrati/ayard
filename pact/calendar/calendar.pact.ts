'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CalendarService } from '@app/services/calendar/calendar.service';
import { ConfigService } from '@app/services/config/config.service';
import { getCalendersBody, getCalendersMatcher } from './responses/get-calendars';
import { ok } from '../helpers/response-helper';
import { get } from '../helpers/request-helper';

// GA: Disabled as requires URL updates here and in BFF
xpactWith({ consumer: 'operations-portal', provider: 'calendar', cors: true }, (provider) => {
  describe('Calendar API', () => {
    let service: CalendarService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [CalendarService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(CalendarService);
    });

    const getCalendarsRequest = {
      uponReceiving: 'a request for calendars',
      withRequest: get('/calendars'),
    };

    beforeEach(() => {
      return provider.addInteraction({
        state: 'i have a list of calendars',
        ...getCalendarsRequest,
        willRespondWith: ok(getCalendersMatcher),
      });
    });

    it('returns a successful body', () => {
      return service
        .getCalendars()
        .toPromise()
        .then((r) => {
          expect(r).toEqual(getCalendersBody);
        });
    });
  });
});
