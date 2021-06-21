import { Injectable } from '@angular/core';
import { list } from './country-codes';

/**
 * Purpose of this service is to have
 * a place where common functions can
 * be utilized.
 */

interface ICountry {
  code: string;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  private countryCodes: ICountry[];

  constructor() {
    this.countryCodes = Object.keys(list).map((code) => ({
      code,
      name: list[code],
    }));
  }

  getCountryCodes(): ICountry[] {
    return this.countryCodes;
  }

  getCountryName(code: string): string {
    const country = this.countryCodes.find((item: ICountry) => item.code === code);
    return !!country ? country.name : '';
  }

  capitalize(text: string): string {
    if (!text) {
      return '';
    }

    return text
      .split(' ')
      .map((word) => {
        const firstCharacter = `${word.substring(0, 1).toUpperCase()}`;
        const remainingCharacters = `${word.substring(1, word.length)}`.toLowerCase();
        return `${firstCharacter + remainingCharacters}`;
      })
      .join(' ');
  }

  isNegative(num: number): boolean {
    return Math.sign(num) === -1;
  }
}
