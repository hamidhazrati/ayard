import { ProductCounterpartyRole } from '@app/features/products/models/product-counterparty-role.model';
import { Product } from '@app/features/products/models/product.model';

export const counterpartyRoles: ProductCounterpartyRole[] = [
  {
    name: 'BUYER',
    description: null,
    required: false,
    type: 'PRIMARY',
  },
  {
    name: 'OBLIGOR',
    description: null,
    required: false,
    type: 'PRIMARY',
  },
  {
    name: 'SELLER',
    description: null,
    required: false,
    type: 'RELATED',
  },
];

export const product: Product = {
  id: 'BP_99',
  status: null,
  productCategoryId: null,
  name: null,
  description: null,
  productGuideLink: null,
  counterpartyRoles: counterpartyRoles,
  rules: [],
};

describe('Contract View', () => {
  describe('GIVEN a contract', () => {
    const sampleContract = {
      id: '2e57be46-07fa-4486-8e80-dd4282b74be0',
      name: 'AR_Test Hogcat Industries Base',
      channelReference: 'N/A',
      partnerId: 'abc-123',
      created: '2020-06-18',
      status: 'Active',
      pricing: null,
      productId: 'productId',
      product: 'AR_Test Hogcat Industries Base',
      rules: [],
      currencies: {
        GBP: {
          referenceRateType: 'string',
          dayCountConvention: 'string',
          decimals: 2,
          minPaymentAmount: 1,
          maxPaymentAmount: 10,
          paymentDate: { calendars: [], adjustmentType: 'string' },
          acceptanceDate: { calendars: [], adjustmentType: 'string' },
          maturityDate: { calendars: [], adjustmentType: 'string', bufferDays: 2, setDay: 1 },
        },
      },
    };
    const counterparties = [
      {
        name: 'CP A',
        role: 'BUYER',
        roleType: 'PRIMARY',
        id: 'id_A',
        entityId: null,
        counterpartyReference: 'CP_A',
        verificationStatus: 'ACTIVE',
      },
    ];
    const banks = [
      {
        id: '123',
        currency: 'GBP',
        bankName: 'ABCDE',
        branch: {
          name: 'Some Other Bank',
          address: {
            line1: 'Some Other Bank',
            line2: 'Some Other Horsey Way',
            line3: 'some other line 3',
            line4: 'Some other line 45',
            city: 'London',
            region: 'London',
            country: 'GB',
            postalCode: '12345',
          },
          bic: 'NWBKGB2LZZZ',
          domesticBranchId: 'some-other-dom-branch-id',
        },
        account: {
          name: 'Some Other Account Holder',
          iban: 'GB95BARC20039534897718',
          domesticAccountId: 'some-other-account-id',
        },
      },
    ];

    describe('WHEN we visit the view contract screens', () => {
      it('THEN it should have option to Manage Bank Details and Add Bank', () => {
        cy.server();
        cy.route('GET', '/contract/2e57be46-07fa-4486-8e80-dd4282b74be0', sampleContract).as(
          'viewContract',
        );
        cy.route(
          'GET',
          '/contract-counterparty/list/2e57be46-07fa-4486-8e80-dd4282b74be0',
          counterparties,
        ).as('getContractCounterpartiesById');
        cy.route('GET', '/product/productId', product).as('getProduct');

        cy.route('GET', '/contract-counterparty/id_A/banks', []).as('getBanksByCounterpartyId');

        cy.kcFakeLogin('user', 'contracts/2e57be46-07fa-4486-8e80-dd4282b74be0');

        cy.get('[data-testid="contract-details-selector"]')
          .click()
          .get('[data-testid="contract-details-selector-option"]')
          .contains('Counterparties')
          .click();
        cy.get('[data-testid="test-data-elipse"]')
          .scrollIntoView()
          .click({ force: true })
          .get('[data-testid="test-ManageBankDetailsOptionButton"]')
          .scrollIntoView()
          .should('be.visible')
          .click({ force: true });

        cy.get('[data-testid="title"]').contains('Bank details for CP A');
        cy.get('[data-testid="add-counterparty-bank"]').should('be.visible').click();
        cy.get('[data-testid="title"]').contains('Add new bank details for CP A');

        cy.get('[data-testid="currency"]')
          .click()
          .get('[data-testid="currency-option"]')
          .contains('GBP')
          .click();

        cy.get('[data-testid="country"]')
          .click()
          .get('[data-testid="country-option"]')
          .contains('United Kingdom')
          .click();

        cy.get('[data-testid="accountName"]').type('Account Name');
        cy.get('[data-testid="bic"]').type('NWBKGB2LZZZ');
        cy.get('[data-testid="iban"]').type('GB95BARC20039534897718');
        cy.get('[data-testid="bankName"]').type('Bank Name');

        cy.route('POST', '/contract-counterparty/id_A/banks', {}).as('addBank');
        cy.route('GET', '/contract-counterparty/id_A/banks', banks).as('getBanksByCounterpartyId');
        cy.get('[data-testid="save-counterparty-bank"]').should('be.visible').click();

        cy.wait('@addBank').then((xhr) => {
          const expectedRequest = {
            currency: 'GBP',
            bankName: 'Bank Name',
            branch: {
              name: null,
              address: {
                line1: null,
                line2: null,
                line3: null,
                line4: null,
                city: null,
                region: null,
                country: 'GB',
                postalCode: null,
              },
              bic: 'NWBKGB2LZZZ',
              domesticBranchId: null,
            },
            account: {
              name: 'Account Name',
              iban: 'GB95BARC20039534897718',
              domesticAccountId: null,
            },
          };

          expect(xhr.request.body).to.eql(expectedRequest);
        });
        cy.get('[data-testid="title"]').contains('Bank details for CP A');
        cy.get('[data-testid="add-counterparty-bank"]').should('not.be.visible');
      });
    });
  });
});
