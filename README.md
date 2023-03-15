# WRITE HOUSE BACKEND API

## Description

The WriteHouse Backend is an API that serves a Web 3 blog web app

## Technologies used

- NestJS
- Postgres
- AWS


## Setup

- Clone the repo

```bash
$ npm install
```

## Running the app

- Make sure to have _Postgres_ installed
- Copy `.env.example` to `.env ` then set the port
- Setup database credential in `.env`
- Install packages: `npm install` or `yarn install`
- Migrate the database: `npm run migrate:run` or `yarn migrate:run`
- Run the app in dev mode: `npm run stat:dev` or `yarn start:dev`
- Run the app in prod mode: `npm run build && npm start:prod` or `yarn build && yarn start:prod`

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

