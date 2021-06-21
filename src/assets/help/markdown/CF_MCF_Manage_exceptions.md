## Managing exceptions

When your cashflow file has been approved for processing, the approver will notify you that it has been done, so you can access the processed file and continue working with it.

Part of the processing which Verdi does is to validate cashflows against contracts and limits that have been set for the client. Valid cashflows are marked as such and will be ready to process, invalid cashflows are marked as invalid and Verdi allows you to work with them to make them valid if appropriate.

There are different types of invalid cashflows, which includes some that can be fixed and some that cannot. Some of the most common statuses are:
- **Cashflow Failure** – Cannot be fixed, most likely because there is no contract or the counterparty has not been assigned to the contract.
- **Invalid** – Cannot be fixed.
- **Rejected** – Some aspect of the cashflow does not meet the criteria required but may be fixable.

When you open an individual cashflow, a detail pane will open from the right-hand side of the screen. In that detail pane you will see:
- The **Cashflow details** tab, which displays entities, key dates, amount, status and the contract that it relates to.
- The **Exception** tab, which displays the time and date of the exception, the exception type, some explanatory text to help you to resolve the exception and the **Release**, **Override** and **Cancel** buttons.
