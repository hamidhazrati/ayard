import { Pipe, PipeTransform } from '@angular/core';

export function formatTitleCase(titleCase: string) {
  return titleCase
    ? titleCase
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : titleCase;
}

@Pipe({ name: 'titlecaseFormat' })
export class TitleCaseFormatPipe implements PipeTransform {
  transform(titleCase: string) {
    return formatTitleCase(titleCase);
  }
}
