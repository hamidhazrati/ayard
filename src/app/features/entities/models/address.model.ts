export interface Address {
  line1: string;
  line2: string;
  city: string;
  region?: string;
  regionName?: string;
  country: string;
  countryName?: string;
  postalCode: string;
  postalCodeExtension?: string;
}

export function formatAddress(address: Address) {
  return [
    address?.line1,
    address?.line2,
    address?.city,
    address?.postalCode,
    address?.regionName,
    address?.countryName,
  ]
    .filter((part) => part)
    .join(', ');
}
