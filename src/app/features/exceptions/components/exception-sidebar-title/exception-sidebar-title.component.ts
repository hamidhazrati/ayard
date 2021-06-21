import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-exception-sidebar-title',
  templateUrl: './exception-sidebar-title.component.html',
  styleUrls: ['./exception-sidebar-title.component.scss'],
})
export class ExceptionSidebarTitleComponent {
  @Input() public title: string;
  @Input() public status: string;
  @Output() public closeDialogEvent = new EventEmitter();

  public emitCloseDialogEvent(): void {
    this.closeDialogEvent.emit();
  }
}
