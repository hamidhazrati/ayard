import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { HelpService } from '@app/features/help/help.service';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, delay, distinctUntilChanged, filter, takeUntil, tap } from 'rxjs/operators';
import { FullScreenModalComponent } from './components/full-screen-modal/full-screen-modal.component';
import { HelpItemListComponent } from './components/help-item-list/help-item-list.component';
import { HelpPageComponent } from './components/help-page/help-page.component';
import { HelpHistoryItemModel } from './models/help-history-item.model';
import { HelpPageTypeEnum } from './models/help-page-type.enum';
import { NavigationService } from './services/navigation.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss'],
})
export class HelpComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(FullScreenModalComponent) modal: FullScreenModalComponent;
  @ViewChild('placeholder', { read: ViewContainerRef }) placeholder: ViewContainerRef;

  isOpened$ = this.helpService.isHelpShown$;
  showNavControls = false;

  imageSrc: string;

  destroyed$ = new Subject();

  constructor(
    private helpService: HelpService,
    private navigation: NavigationService,
    private componentFactoryResolver: ComponentFactoryResolver,
  ) {}

  ngOnInit(): void {
    this.helpService.fullScreenImageSrc$
      .pipe(
        filter((src) => !!src),
        takeUntil(this.destroyed$),
      )
      .subscribe((src) => {
        this.imageSrc = src;
        this.modal.open();
      });
  }

  ngAfterViewInit(): void {
    this.subscribeOnPageChanged();
  }

  subscribeOnPageChanged(): void {
    this.navigation.currentPage$.pipe(delay(0), takeUntil(this.destroyed$)).subscribe((item) => {
      this.renderPage(item);
      this.showNavControls = !!item.path;
    });
  }

  renderPage(item: HelpHistoryItemModel) {
    const componentType: Type<unknown> =
      item.page === HelpPageTypeEnum.home ? HelpItemListComponent : HelpPageComponent;

    const resolver = this.componentFactoryResolver.resolveComponentFactory(componentType);
    this.placeholder.clear();
    const componentRef = this.placeholder.createComponent(resolver);
    if (item.path && componentRef.instance instanceof HelpPageComponent) {
      const helpItemComponent = componentRef.instance as HelpPageComponent;
      helpItemComponent.url = item.path;
      helpItemComponent.nestedItems = item.nestedItems;
    }
  }

  onBackClicked(): void {
    this.navigation.back();
  }

  onHomeClicked(): void {
    this.navigation.home();
  }

  close(): void {
    this.helpService.toggleHelp();
  }

  ngOnDestroy(): void {
    this.helpService.ngOnDestroy();
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
