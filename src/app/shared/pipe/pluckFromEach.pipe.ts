import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'pluckFromEach' })
export class PluckFromEachPipe implements PipeTransform {
  transform(input: any[], key: string): any {
    if (!input || !key) {
      return null;
    }
    return input.map((value) => value[key]);
  }
}
