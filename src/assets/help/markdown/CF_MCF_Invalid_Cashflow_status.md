Invalid cashflow statuses will be displayed in the **Invalid Cashflows** tab at the bottom of the cashflow file details screen.  
The invalid cashflow statuses are:

| Status | Description|
| ------ | -----------|
| **Rejected**                  | Cashflow has been rejected because of a recoverable exception. Corrective action can be taken and the cashflow re-verified |
| **Invalid**                   | Cashflow has been invalidated due to an irrecoverable exception or user action. This is a terminal state and the cashflow will have to be resubmitted if it is required |
| **Cashflow processing error** | Usually caused by technical errors and timeouts from supporting services |
| **Cashflow failure**          | The cashflow could not be created e.g. because it couldn’t be linked to a contract |
