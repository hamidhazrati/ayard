import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { Observable, of } from 'rxjs';
import { Calendar } from './calendar.model';

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  getCalendars(): Observable<Calendar[]> {
    return this.http.get<Calendar[]>(`${this.host}/calendars`);
  }
}
