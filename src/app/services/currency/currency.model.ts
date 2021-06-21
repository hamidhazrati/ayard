export interface Currency {
  code: string;
  decimalPlaces: number;
  dayCountConventionCode: string;
}

export interface ReferenceRate {
  rateType: string;
  description: string;
}
