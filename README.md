# Kindred

## Project Description
A simple REST API for a townhall/community app

## Repository Architecture

This monorepo implements Clean NestJs Architecture with Typescript (Controller, Service, and Data Layer).

## App Features

- Authentication, Req Validation
- Unit Test
- Containerization with Docker
- Postman Documentation
- Live Hosting on [fly.io]{fly.io} (check swagger)



## Postman Documentation

[https://documenter.getpostman.com/view/11044390/2sA35A7ji7](https://documenter.getpostman.com/view/11044390/2sA35A7ji7)


## Installation

```bash
$ yarn install
```

## Unit Tests

```bash
$ yarn test:unit
```

## Running the app

```bash
# with docker compose
$ docker-compose up

# development
$ yarn run start

# watch mode
$ yarn run start

# production mode
$ yarn run start:prod
```

## Limitations

- Posts, Comments