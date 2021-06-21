import { Inject, Injectable } from '@angular/core';
import { HelpIntroModal } from '@app/features/help/models/help-intro-modal';
import { Observable } from 'rxjs/internal/Observable';
import { HelpModuleConfig } from '@app/features/help/models/help-module-config.model';
import { HelpConfigModel } from '@app/features/help/models/help-config.model';
import { tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HelpConfigItemModel } from '../models/help-config-item.model';

@Injectable()
export class HelpConfigService {
  config: HelpConfigModel;
  private homePath = new BehaviorSubject('');
  private introModalConfig = new BehaviorSubject<HelpIntroModal>(null);

  constructor(
    private http: HttpClient,
    @Inject(HelpModuleConfig) private moduleConfig: HelpModuleConfig,
  ) {}

  loadConfig(): Observable<HelpConfigModel> {
    return this.http.get<HelpConfigModel>(this.moduleConfig.configPath).pipe(
      tap((config) => {
        this.config = config;
        this.homePath.next(this.config.homeItem.path);
        this.introModalConfig.next(this.config.introModal);
      }),
    );
  }

  get items(): HelpConfigItemModel[] {
    return this.config.items;
  }

  get homeItems(): HelpConfigItemModel[] {
    return this.config.items.filter((item) => item.isAvailableOnHomePage);
  }

  get homePath$(): Observable<string> {
    return this.homePath.asObservable();
  }

  get introModalConfig$(): Observable<HelpIntroModal> {
    return this.introModalConfig.asObservable();
  }

  getPageBasedOnRoute(routeUrl: string): HelpConfigItemModel {
    return this.config.items.find((item) => this.isHelpItemCompatibleWithUrl(item, routeUrl));
  }

  getPageBasedOnMarkdownPath(mdPath: string): HelpConfigItemModel {
    return this.config.items.find((item) => item.path === mdPath.slice(1));
  }

  private isHelpItemCompatibleWithUrl(helpItem: HelpConfigItemModel, url: string): boolean {
    if (helpItem.route) {
      const strRegExPattern = this.escapeNonRegExpChar(helpItem.route);
      return new RegExp(strRegExPattern + '$').test(url);
    }

    return false;
  }

  private escapeNonRegExpChar(text: string): string {
    return text.replace(/\$/g, '\\$');
  }
}
