import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HelpConfigNestedItemModel } from '../models/help-config-nested-item.model';
import { HelpHistoryItemModel } from '../models/help-history-item.model';
import { HelpPageTypeEnum } from '../models/help-page-type.enum';

@Injectable()
export class NavigationService {
  private history: HelpHistoryItemModel[] = [
    {
      page: HelpPageTypeEnum.home,
    },
  ];

  private get actualPage(): HelpHistoryItemModel {
    return this.history[this.history.length - 1];
  }

  private page$: BehaviorSubject<HelpHistoryItemModel> = new BehaviorSubject(this.actualPage);

  get currentPage$(): Observable<HelpHistoryItemModel> {
    return this.page$.asObservable();
  }

  home(): void {
    this.history.push({ page: HelpPageTypeEnum.home });
    this.onPageChanged();
  }

  open(path: string, nestedItems: HelpConfigNestedItemModel[] = []): void {
    this.history.push({ page: HelpPageTypeEnum.item, path, nestedItems });
    this.onPageChanged();
  }

  reset(notify: boolean = true): void {
    this.history = [{ page: HelpPageTypeEnum.home }];

    if (notify) {
      this.onPageChanged();
    }
  }

  back(): void {
    if (this.history.length > 1) {
      this.history.pop();
      this.onPageChanged();
    }
  }

  private onPageChanged(page = this.actualPage): void {
    this.page$.next(page);
  }
}
