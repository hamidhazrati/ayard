import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '@app/services/config/config.service';
import { Page } from '@app/shared/pagination';
import { formatTitleCase } from '@app/shared/pipe/titlecase-format.pipe';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task } from '../models/task.model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public updateTasksEvent$: BehaviorSubject<boolean> = new BehaviorSubject(null);
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  private transformTask(task: Task): Task {
    task.attributes.cashflowFileId = this.getCombinedId(task.attributes);
    task.primaryEntity = task.attributes.primaryEntity;
    task.attributes.primaryEntity = this.getEntity(
      task.attributes.primaryEntity,
      task.attributes.primaryEntityRole,
    );
    task.relatedEntity = task.attributes.relatedEntity;
    task.attributes.relatedEntity = this.getEntity(
      task.attributes.relatedEntity,
      task.attributes.relatedEntityRole,
    );
    task.status = task.statusInfo.status;
    task.statusInfo.status = this.getStatus(task.statusInfo.status);
    return task;
  }

  // TODO use gds TagComponent once the gds table cell component is able to display child components
  // ideal usage: return `<gds-tag [color]="'red'" [label]="${formatTitleCase(status)}"></gds-tag>`;
  private getStatus(status: string): string {
    return `<span class="capsule">${formatTitleCase(status)}</span>`;
  }

  private getEntity(entity: string, role: string): string {
    return `<div>${entity}<br /><div class="gray-text">${role}</div></div>`;
  }

  private getCombinedId(attributes: any): string {
    const cashFlowFileId: string = attributes.cashflowFileId
      ? `${attributes.cashflowFileId} / `
      : '';
    return `${cashFlowFileId}${attributes.resourceId}`;
  }

  public getTasksData(params: HttpParams, groupedColumnProps?: string[]): Observable<Page<Task>> {
    let url = `${this.host}/tasks`;

    if (groupedColumnProps) {
      url = `${url}?&groupBy=${groupedColumnProps[0]}&groupBy=${groupedColumnProps[1]}&groupBy=${groupedColumnProps[2]}&groupBy=${groupedColumnProps[3]}`;
    }

    return this.http.get<Page<Task>>(url, { params });
  }

  public getTasks(params: HttpParams, groupedColumnProps?: string[]): Observable<Page<Task>> {
    return this.getTasksData(params, groupedColumnProps).pipe(
      map((response: Page<Task>) => {
        response.data.forEach((task: Task) => this.transformTask(task));
        return response;
      }),
    );
  }

  public updateTasks(ids: string[], status: string, reason: string) {
    return this.http.post(this.host + `/tasks/change-status`, {
      taskIds: ids,
      status,
      reason,
    });
  }
}
