import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { DnbLookup } from './dnb-lookup.model';

@Injectable({
  providedIn: 'root',
})
export class DnbLookupService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  getByDunsNumber(dunsNumber: string): Observable<DnbLookup> {
    return this.http.get<DnbLookup>(this.host + `/dnb/duns-summary/${dunsNumber}`);
  }
}
