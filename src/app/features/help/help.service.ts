import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Event, NavigationEnd, Router } from '@angular/router';

import { filter, first, map, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { SearchService } from './services/search.service';
import { HelpConfigItemModel } from './models/help-config-item.model';
import { NavigationService } from './services/navigation.service';
import { HelpConfigService } from '@app/features/help/services/help-config.service';

@Injectable({
  providedIn: 'root',
})
export class HelpService implements OnDestroy {
  isHelpShown$ = new BehaviorSubject<boolean>(false);

  private helpItems = new BehaviorSubject<HelpConfigItemModel[]>([]);
  private unsubscribe: Subject<boolean> = new Subject();
  private items: HelpConfigItemModel[] = [];
  private mdCache: Map<string, string> = new Map();
  private fullScreenImageSrc = new BehaviorSubject<string>(null);

  constructor(
    private router: Router,
    private http: HttpClient,
    private searchService: SearchService,
    private navigation: NavigationService,
    private helpConfigService: HelpConfigService,
  ) {
    this.loadConfig();
  }

  get helpItems$(): Observable<HelpConfigItemModel[]> {
    return this.helpItems.asObservable();
  }

  get fullScreenImageSrc$(): Observable<string> {
    return this.fullScreenImageSrc.asObservable();
  }

  toggleHelp(): void {
    const currentState = this.isHelpShown$.getValue();
    this.isHelpShown$.next(!currentState);
  }

  searchBy(term: string): void {
    if (term === '') {
      this.helpItems.next(this.items);
    }

    combineLatest(
      this.items.map((helpItem) =>
        this.getMarkdown(helpItem).pipe(
          map((content) => ({
            helpItem,
            content,
          })),
        ),
      ),
    )
      .pipe(
        first(),
        map((data) =>
          data
            .filter((item) => this.searchService.search(item.helpItem, item.content, term))
            .map((item) => item.helpItem),
        ),
        takeUntil(this.unsubscribe),
      )
      .subscribe((items) => {
        this.helpItems.next(items);
      });
  }

  getMarkdown(item: HelpConfigItemModel): Observable<string> {
    if (this.mdCache.has(item.path)) {
      return of(this.mdCache.get(item.path));
    }

    return this.http
      .get(item.path, { responseType: 'text' })
      .pipe(tap((content) => this.mdCache.set(item.path, content)));
  }

  openImageInFullScreen(src: string) {
    this.fullScreenImageSrc.next(src);
  }

  ngOnDestroy(): void {
    this.mdCache.clear();
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }

  private handleRouteChanges(): Observable<Event> {
    return this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      tap(() => this.updateHelpPageBasedOnRoute()),
    );
  }

  private updateHelpPageBasedOnRoute(): void {
    const targetHelpItem = this.helpConfigService.getPageBasedOnRoute(this.router.url);
    this.navigation.reset();

    if (targetHelpItem) {
      this.navigation.open(targetHelpItem.path, targetHelpItem.nestedItems);
    }
  }

  private loadConfig(): void {
    this.helpConfigService
      .loadConfig()
      .pipe(
        tap(() => {
          this.items = this.helpConfigService.homeItems;
          this.helpItems.next(this.items);
          this.updateHelpPageBasedOnRoute();
        }),
        mergeMap(() => this.handleRouteChanges()),
        takeUntil(this.unsubscribe),
      )
      .subscribe();
  }
}
