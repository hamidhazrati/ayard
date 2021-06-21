import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HelpService } from '../../help.service';
import { IsMarkdownFile } from '../../helpers/is-markdown-file';
import { HelpConfigNestedItemModel } from '../../models/help-config-nested-item.model';
import { HelpConfigService } from '../../services/help-config.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-help-page',
  templateUrl: './help-page.component.html',
  styleUrls: ['./help-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HelpPageComponent {
  @Input() url: string;
  @Input() nestedItems: HelpConfigNestedItemModel[];

  constructor(
    private navigation: NavigationService,
    private helpService: HelpService,
    private configService: HelpConfigService,
  ) {}

  onClick(event: MouseEvent): void {
    const anchor = this.getClosestAnchor(event);
    const image = this.getClosestImage(event);
    if (anchor) {
      this.handleLinkClick(anchor, event);
    } else if (image) {
      this.showFullScreenImage(image);
    }
  }

  handleLinkClick(anchor: HTMLAnchorElement, event: MouseEvent): void {
    if (IsMarkdownFile(anchor.href)) {
      event.preventDefault();
      const helpItem = this.configService.getPageBasedOnMarkdownPath(anchor.pathname);
      this.navigation.open(anchor.pathname, helpItem?.nestedItems);
    }
  }

  showFullScreenImage(image: HTMLImageElement): void {
    this.helpService.openImageInFullScreen(image.src);
  }

  private getClosestAnchor(event: MouseEvent): HTMLAnchorElement {
    return (event.target as HTMLElement).closest('a');
  }

  private getClosestImage(event: MouseEvent): HTMLImageElement {
    return (event.target as HTMLImageElement).closest('img');
  }
}
