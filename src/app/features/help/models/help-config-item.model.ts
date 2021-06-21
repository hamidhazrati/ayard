import { HelpConfigNestedItemModel } from './help-config-nested-item.model';

export interface HelpConfigItemModel {
  path: string;
  title?: string;
  description?: string;
  route?: string;
  nestedItems: HelpConfigNestedItemModel[];
  isAvailableOnHomePage: boolean;
}
