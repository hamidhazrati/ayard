# OperationsPortal

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.2.

Changes from the standard Angular Cli bootstrapping:

- Yarn is used for package management. Do not use npm in this repo
- Jest is used for testing

## Developer Guidelines

See [Development Guidelines](DEV.md)

## Run Local with Docker

```bash
# Create the verdi docker network and start up the platform services as per the 'partner-platform' repo README.
# Then start up any dependent services in that docker-network

# keycloak added to partner-platform for running locally
# test user:
#  - username = testuser
#  - password = Password1

$ docker-compose up --build -d
```

## Development server

Run `yarn start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `yarn build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `yarn test:unit` to execute the unit tests via [Jest](https://jestjs.io/).

## Running end-to-end tests

Run `yarn test:e2e` to execute the end-to-end tests via [Cypress](https://www.cypress.io/).

## Running pact tests

Run `yarn test:pact` to execute the pact tests via [Pact](https://github.com/pact-foundation/pact-js).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Yarn is the package manager
