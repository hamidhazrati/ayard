import { HelpConfigNestedItemModel } from './help-config-nested-item.model';
import { HelpPageTypeEnum } from './help-page-type.enum';

export interface HelpHistoryItemModel {
  page: HelpPageTypeEnum;
  path?: string;
  nestedItems?: HelpConfigNestedItemModel[];
}
