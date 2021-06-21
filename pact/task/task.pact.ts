'use strict';

import { xpactWith } from 'jest-pact';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { noContent, ok, withPage } from '../helpers/response-helper';
import { getWithHttpParams, pageRequest, post } from '../helpers/request-helper';
import { TaskService } from '@app/features/exceptions/services/task.service';
import { getTaskBody, getTaskMatcher } from './responses/get-tasks';
import { withPageMatcher } from '../helpers/matcher-helper';

xpactWith({ consumer: 'operations-portal', provider: 'task', cors: true }, (provider) => {
  describe('Tasks API', () => {
    let service: TaskService;
    const configService = { getApiUrl: () => provider.mockService.baseUrl };

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientModule],
        providers: [TaskService, { provide: ConfigService, useValue: configService }],
      }).compileComponents();
    });

    beforeEach(() => {
      service = TestBed.inject(TaskService);
    });

    describe('GET Tasks', () => {
      const getTasksRequest = {
        uponReceiving: 'a request for tasks',
        withRequest: getWithHttpParams('/tasks', pageRequest()),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i have a list of tasks',
          ...getTasksRequest,
          willRespondWith: ok(withPageMatcher(getTaskMatcher)),
        });
      });

      it('returns a successful body', () => {
        return service
          .getTasksData(pageRequest())
          .toPromise()
          .then((r) => {
            expect(r).toEqual(withPage(getTaskBody));
          });
      });
    });

    describe('Change task status', () => {
      const postRequest = {
        uponReceiving: 'a request to update status of a task',
        withRequest: post('/tasks/change-status', {
          taskIds: ['id'],
          status: 'status',
          reason: 'reason',
        }),
      };

      beforeEach(() => {
        return provider.addInteraction({
          state: 'i can update a task',
          ...postRequest,
          willRespondWith: noContent(),
        });
      });

      it('returns a 200', () => {
        return service
          .updateTasks(['id'], 'status', 'reason')
          .toPromise()
          .then((r) => {
            expect(r).toBeNull();
          });
      });
    });
  });
});
