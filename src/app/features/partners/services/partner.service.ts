import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@app/services/config/config.service';
import { EMPTY, Observable, of } from 'rxjs';
import { Partner } from '@app/features/partners/model/partner.model';
import { expand, map, reduce } from 'rxjs/operators';
import { Page, PageRequestFactory } from '@app/shared/pagination';

@Injectable({
  providedIn: 'root',
})
export class PartnerService {
  private readonly host: string;
  private MAX_PAGE_SIZE = 2147483647;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  public getPartners(params: HttpParams, name: string = ''): Observable<Page<Partner>> {
    const url = `${this.host}/partner?name_starts_with=${name}`;
    return this.http.get<Page<Partner>>(url, { params });
  }

  createPartner(partnerRequest: PartnerRequest): Observable<PartnerCreated> {
    return this.http.post<PartnerCreated>(this.host + '/partner', partnerRequest);
  }

  getPartnerById(id: string): Observable<Partner> {
    return this.http.get<Partner>(this.host + '/partner/' + id);
  }

  isPartnerNameUnique(name: string): Observable<boolean> {
    if (!name) {
      return of(true);
    }
    return this.getAllPartners(name).pipe(map((results) => !results?.length));
  }

  getAllPartners(name = ''): Observable<Partner[]> {
    const params: HttpParams = new PageRequestFactory().createHttpParams({
      page: 0,
      pageSize: this.MAX_PAGE_SIZE,
    });

    return this.getPartners(params, name).pipe(
      expand((res) =>
        res.meta.paged.page < res.meta.paged.totalPages - 1
          ? this.getPartners(
              new PageRequestFactory().createHttpParams({
                page: res.meta.paged.page + 1,
                pageSize: this.MAX_PAGE_SIZE,
              }),
              name,
            )
          : EMPTY,
      ),
      reduce((acc, res) => acc.concat(res.data), []),
    );
  }
}

export interface PartnerRequest {
  name: string;
  id: string;
  entityId: string;
}

export interface PartnerCreated {
  id: string;
}
