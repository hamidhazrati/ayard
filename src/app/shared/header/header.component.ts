import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { HelpService } from '@app/features/help/help.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  title = 'Verdi';

  constructor(private keycloakService: KeycloakService, private helpService: HelpService) {}

  logout() {
    this.keycloakService.logout();
  }

  toggleHelp() {
    this.helpService.toggleHelp();
  }
}
