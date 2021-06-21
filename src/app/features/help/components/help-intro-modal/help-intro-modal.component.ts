import {
  AfterViewInit,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { GdsModalRef, GdsModalService, GdsModalSize } from '@greensill/gds-ui/modal';
import { HelpService } from '@app/features/help/help.service';
import { SHOULD_SHOWN_HELP_INTRO_KEY } from '@app/features/help/components/help-intro-modal/should-show-help-intro-key.constant';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { HelpConfigService } from '@app/features/help/services/help-config.service';

@Component({
  selector: 'app-help-intro-modal',
  templateUrl: './help-intro-modal.component.html',
  styleUrls: ['./help-intro-modal.component.scss'],
})
export class HelpIntroModalComponent implements OnInit, AfterViewInit {
  @ViewChild('mediumModalTemplate') mediumModalTemplate: TemplateRef<null>;
  introModal: GdsModalRef;
  introModalConfig$ = this.helpConfigService.introModalConfig$;

  constructor(
    private helpService: HelpService,
    private helpConfigService: HelpConfigService,
    private gdsModalService: GdsModalService,
    private viewContainerRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    localStorage.setItem(SHOULD_SHOWN_HELP_INTRO_KEY, 'false');
  }

  ngAfterViewInit() {
    const shouldShown = localStorage.getItem(SHOULD_SHOWN_HELP_INTRO_KEY);
    if (shouldShown !== 'false') {
      this.createAndOpenModal();
    }
  }

  learnMore(): void {
    this.introModal.close();
    this.helpService.toggleHelp();
  }

  changeShouldShown(value: MatCheckboxChange) {
    localStorage.setItem(SHOULD_SHOWN_HELP_INTRO_KEY, JSON.stringify(!value.checked));
  }

  private createAndOpenModal() {
    this.introModal = this.gdsModalService.create(this.mediumModalTemplate, this.viewContainerRef, {
      size: GdsModalSize.Large,
    });
    this.introModal.open();
  }
}
