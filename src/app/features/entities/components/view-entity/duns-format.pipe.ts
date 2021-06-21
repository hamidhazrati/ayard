import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dunsFormat' })
export class DunsFormatPipe implements PipeTransform {
  transform(duns: string) {
    return duns && duns.length === 9
      ? [duns.substr(0, 2), duns.substr(2, 3), duns.substr(5)].join('-')
      : duns
      ? duns
      : '';
  }
}
