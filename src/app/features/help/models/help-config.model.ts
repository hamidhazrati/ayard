import { HelpConfigItemModel } from './help-config-item.model';
import { HelpIntroModal } from '@app/features/help/models/help-intro-modal';

export interface HelpConfigModel {
  items: HelpConfigItemModel[];
  homeItem: HelpConfigItemModel;
  introModal: HelpIntroModal;
}
