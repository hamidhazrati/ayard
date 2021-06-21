import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '@app/services/config/config.service';
import { EntityMatchResult } from '@entities/models/entity-match-result.model';

@Injectable({
  providedIn: 'root',
})
export class MatchRequestService {
  private readonly host: string;

  constructor(private http: HttpClient, private configService: ConfigService) {
    this.host = this.configService.getApiUrl();
  }

  getMatchingCandidates(matchRequestId: string): Observable<EntityMatchResult> {
    return this.http.get<EntityMatchResult>(this.host + `/match-request/${matchRequestId}`);
  }

  resolve(matchRequestId: string, matchCandidateId: string): Observable<EntityMatchResult> {
    return this.http.put<EntityMatchResult>(
      this.host + `/match-request/${matchRequestId}/resolve/${matchCandidateId}`,
      null,
    );
  }
}
