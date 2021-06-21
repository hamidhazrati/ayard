import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HelpService } from '@app/features/help/help.service';
import { HelpConfigItemModel } from '@app/features/help/models/help-config-item.model';
import { NavigationService } from '../../services/navigation.service';
import { HelpConfigService } from '@app/features/help/services/help-config.service';

@Component({
  selector: 'app-help-item-list',
  templateUrl: './help-item-list.component.html',
  styleUrls: ['./help-item-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpItemListComponent {
  helpList$ = this.helpService.helpItems$;
  homePath$ = this.helpConfigService.homePath$;

  constructor(
    private helpService: HelpService,
    private helpConfigService: HelpConfigService,
    private navigation: NavigationService,
  ) {}

  onHelpItemClick(item: HelpConfigItemModel): void {
    this.navigation.open(item.path, item.nestedItems);
  }
}
