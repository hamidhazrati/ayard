import { Pipe, PipeTransform } from '@angular/core';

const ordinals: string[] = ['th', 'st', 'nd', 'rd'];

/*
 * Append ordinal to number (e.g. "1st" position)
 * Usage:
 * Example:
 *   {{ 23 |  ordinal}}
 *   formats to: '23rd'
 */
@Pipe({ name: 'ordinalFormat' })
export class OrdinalFormatPipe implements PipeTransform {
  transform(n: number) {
    if (!n) {
      return '';
    }
    const v = n % 100;
    return n + (ordinals[(v - 20) % 10] || ordinals[v] || ordinals[0]);
  }
}
