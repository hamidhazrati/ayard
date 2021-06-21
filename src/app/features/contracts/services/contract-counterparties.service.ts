import { Injectable } from '@angular/core';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { CounterpartyService } from '@app/features/contracts/services/counterparty.service';
import { CreateUpdateContract } from '@app/features/contracts/models/contract.model';
import { CreateUpdateCounterparty } from '@app/features/contracts/models/counterparty.model';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { Entity } from '@entities/models/entity.model';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ContractCounterPartiesService {
  constructor(
    private readonly contractService: ContractService,
    private readonly counterpartyService: CounterpartyService,
  ) {}

  public save({
    counterparties,
    ...createContractRequest
  }: CreateContractRequest): Observable<string> {
    const contract: CreateUpdateContract = {
      ...createContractRequest,
      channelReference: 'N/A',
    };

    return this.contractService.saveContract(contract).pipe(
      map(({ id }) => {
        counterparties.forEach((counterpartyRequest) => {
          const counterParty: CreateUpdateCounterparty = {
            name: counterpartyRequest.entity.name,
            entityId: counterpartyRequest.entity.id,
            role: counterpartyRequest.productCounterpartyRole.name,
            contractId: id,
            countryOfOperation: counterpartyRequest.entity.address?.country,
            // unique on the contract
            counterpartyReference:
              counterpartyRequest.reference ||
              counterpartyRequest.productCounterpartyRole.name + counterpartyRequest.entity.id,
          };

          this.counterpartyService.saveCounterparty(counterParty).subscribe(
            (counterpartyRes) => {
              console.log(`Counterparty saved: ${counterpartyRes.id}`);
            },
            (error) => {
              console.log(`Failed to save counterparty: ${error}`);
            },
          );
        });

        return id;
      }),
    );
  }
}

export interface CreateContractRequest extends CreateUpdateContract {
  counterparties: Counterparty[];
}

export interface Counterparty {
  entity: Entity;
  reference?: string;
  productCounterpartyRole: ProductCounterpartyRole;
}
