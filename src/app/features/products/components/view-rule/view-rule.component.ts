import { Component, Input, OnInit } from '@angular/core';
import { Contract, ContractStatus } from '@app/features/contracts/models/contract.model';
import { ContractService } from '@app/features/contracts/services/contract.service';
import { ResolutionType, Rule } from '@app/features/products/models/rule.model';

@Component({
  selector: 'app-view-rule',
  templateUrl: './view-rule.component.html',
  styleUrls: ['./view-rule.component.scss'],
})
export class ViewRuleComponent implements OnInit {
  @Input() rule: Rule;
  @Input() contract: Contract;
  resolutionTypeEnum = ResolutionType;
  updateError = null;

  constructor(public contractService: ContractService) {}

  isContractRuleEditable = false;
  isEditingRules = false;
  bkpResolutionType: ResolutionType;

  ngOnInit() {
    this.bkpResolutionType = this.rule.resolutionType;
    if (this.contract && this.contract.partnerId && this.contract.status === 'PENDING_APPROVAL') {
      this.isContractRuleEditable = true;
    }
  }
  cancelRuleChanges() {
    this.updateError = null;
    this.isEditingRules = false;
    this.rule.resolutionType = this.bkpResolutionType;
  }

  updateRule() {
    this.updateError = null;
    this.contractService.updateContractRuleException(this.contract, this.rule).subscribe(
      (resp) => {
        this.isEditingRules = false;
        this.bkpResolutionType = this.rule.resolutionType;
      },
      (err) => {
        this.updateError = 'Update Error: See Logs.';
        console.log(err);
      },
    );
  }

  getRule() {
    return this.rule;
  }
}
