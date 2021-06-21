import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cashflow, CashflowFile, CashflowTotal, Entity } from '@app/features/cashflows/models';
import { ConfigService } from '@app/services/config/config.service';
import { Page } from '@app/shared/pagination';
import { CashflowFailure } from '@cashflows/models/cashflow-failure';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CashflowFileFacility, CashflowStatusUpdate } from '../models/cashflow-file';
import { CashflowSummary } from '@cashflows/models';
import { UploadCashflowFileResponse } from './upload-cashflow-file-response';

@Injectable({
  providedIn: 'root',
})
export class CashflowDataService {
  public isCashflowFileExported: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  getCashflows(): Observable<Cashflow[]> {
    return this.http.get<Cashflow[]>(`${this.host}/cashflow`);
  }

  getCashflowSummaries(params: CashflowSummariesParams): Observable<CashflowSummary[]> {
    let queryParams: HttpParams = new HttpParams();
    if (params.currency) {
      queryParams = queryParams.set('currency', params.currency);
    }
    if (params.cashflowFileId) {
      queryParams = queryParams.set('cashflowFileId', params.cashflowFileId);
    }
    if (params.contractId) {
      queryParams = queryParams.set('contractId', params.contractId);
    }

    if (params.includeAllFailuresInFile !== undefined)
      queryParams = queryParams.set(
        'includeAllFailuresInFile',
        params.includeAllFailuresInFile + '',
      );

    if (params.excludedStates)
      params.excludedStates.forEach((excludedState) => {
        queryParams = queryParams.append('states.not', excludedState);
      });

    return this.http
      .get<CashflowSummary[]>(`${this.host}/cashflow/cashflow-summary`, {
        params: queryParams,
      })
      .pipe(
        map((response: CashflowSummary[]) => {
          response.forEach((item: CashflowSummary) => {
            item.entityOneTransformed = this.transformEntity(item.entityOne);
            item.entityTwoTransformed = this.transformEntity(item.entityTwo);
            item.invalidReason = this.getInvalidReason(item.reasonForFailure);
          });
          return response;
        }),
      );
  }

  public getInvalidReason(reasonForFailure: CashflowFailure[]): string {
    if (!reasonForFailure.length) {
      return 'Unknown';
    }

    if (reasonForFailure.length > 1) {
      let tooltip = '';
      reasonForFailure.forEach((item: CashflowFailure) => (tooltip += item.message + '\n'));

      return `
        <div matTooltipClass="custom-tooltip" [matTooltip]="${tooltip}">
          <u>${reasonForFailure.length} failures</u>
        </div>
      `;
    } else {
      return reasonForFailure[0].message;
    }
  }

  private transformEntity(entity: Entity): string {
    return `
      <div>
        <div>${entity?.name}</div>
        <div class="table__text--gray">${entity?.role}</div>
      </div>
    `;
  }

  getCashflowFile(id: string): Observable<CashflowFile> {
    return this.http.get<CashflowFile>(`${this.host}/cashflowfiles/${id}`);
  }

  public getCashflowFiles(params: HttpParams): Observable<Page<CashflowFile>> {
    return this.http.get<Page<CashflowFile>>(`${this.host}/cashflowfiles`, {
      params,
    });
  }

  getCashflowTotals(excludedStates: string[]): Observable<CashflowTotal[]> {
    let queryParams: HttpParams = new HttpParams();

    excludedStates.forEach((excludedState) => {
      queryParams = queryParams.append('state.not', excludedState);
    });

    return this.http.get<CashflowTotal[]>(`${this.host}/cashflow/cashflow-totals`, {
      params: queryParams,
    });
  }

  getCashflowTotalsByCashflowFileId(
    cashflowFileId: string,
    excludedStates: string[],
  ): Observable<CashflowTotal[]> {
    let queryParams: HttpParams = new HttpParams();
    queryParams = queryParams.append('cashflowFileId', cashflowFileId);
    excludedStates.forEach((excludedState) => {
      queryParams = queryParams.append('state.not', excludedState);
    });

    return this.http.get<CashflowTotal[]>(`${this.host}/cashflow/cashflow-totals`, {
      params: queryParams,
    });
  }

  uploadCashflowFile(formData): Observable<HttpEvent<UploadCashflowFileResponse>> {
    return this.http.post<UploadCashflowFileResponse>(`${this.host}/cashflowfiles`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  updateCashflowStatus(id: string, formData: CashflowStatusUpdate): Observable<CashflowFile> {
    return this.http.post<CashflowFile>(
      `${this.host}/cashflowfiles/${id}/processing-status`,
      formData,
    );
  }

  rejectCashflows(formData: RejectCashflow[]): Observable<Cashflow[]> {
    return this.http.post<Cashflow[]>(`${this.host}/cashflow/reject-batch`, formData);
  }

  // TODO Rename getExposureForCashflowFile
  getFacilitiesForCashflowFile(cashflowFileId: string): Observable<CashflowFileFacility[]> {
    return this.http.get<CashflowFileFacility[]>(
      `${this.host}/cashflowfiles/${cashflowFileId}/cashflowfile-exposure`,
    );
  }

  downloadCashflowFileExport(id: string): Observable<CashflowFileExport> {
    return this.http
      .get(`${this.host}/cashflowfiles/${id}/export`, { responseType: 'blob', observe: 'response' })
      .pipe(
        map((response) => {
          const contentType = response.headers.get('content-type');
          const contentDispositionHeader = response.headers.get('content-disposition');
          const filename = contentDispositionHeader.substring(
            contentDispositionHeader.indexOf('filename="') + 10,
            contentDispositionHeader.length - 1,
          );

          return {
            filename,
            data: new Blob([response.body], { type: contentType }),
          };
        }),
      );
  }

  submitToTrade(id: string, formData): Observable<HttpEvent<CashflowFile>> {
    return this.http.post<CashflowFile>(
      `${this.host}/cashflowfiles/${id}/submit-to-trade`,
      formData,
      {
        reportProgress: true,
        observe: 'events',
      },
    );
  }
}

export interface CashflowFileExport {
  filename: string;
  data: Blob;
}

export interface CashflowSummariesParams {
  cashflowFileId?: string;
  currency?: string;
  contractId?: string;
  includeAllFailuresInFile?: boolean;
  excludedStates?: string[];
}

export interface RejectCashflow {
  id: string;
  message: string;
}
