import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AlertAction } from '@app/shared/model/model-helpers';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AlertComponent {
  @Input() description: string;
  @Input() showActions = false;
  @Input() showClose = false;
  @Input() status: 'alert' | 'info' | 'success' | 'warning' = 'warning';
  @Input() title: string;
  @Output() whenActioned: EventEmitter<AlertAction> = new EventEmitter<AlertAction>();
  @Output() whenClosed: EventEmitter<void> = new EventEmitter<void>();

  onApprove(): void {
    this.whenActioned.emit('approved');
  }

  onClose(): void {
    this.whenClosed.emit();
  }

  onReject(): void {
    this.whenActioned.emit('rejected');
  }
}
