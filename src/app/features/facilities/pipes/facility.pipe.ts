import { Pipe, PipeTransform } from '@angular/core';
import { isGuarantorLimit } from '@app/features/facilities/models/limit.model';

@Pipe({ name: 'facility' })
export class FacilityPipe implements PipeTransform {
  transform(object): any {
    const [firstResult] = object.exposure.results;

    return {
      credit: firstResult?.creditResult,
      contracts: object?.facility.contracts,
      insurance: firstResult?.insuranceResult,
      guarantors: firstResult?.results.filter((result) => isGuarantorLimit(result.limit)),
    };
  }
}
