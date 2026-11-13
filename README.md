# mini-nest

A small, hand-built subset of NestJS ideas - decorators, dependency injection,
modules, routing, pipes, and validation - built with TypeScript and Express using
`reflect-metadata`. This is a learning project, not a replacement for NestJS:
each piece was implemented from scratch to see what problem it solves before
using NestJS's own abstraction for it.

## Stack

- TypeScript (experimental decorators + `emitDecoratorMetadata`)
- `reflect-metadata`
- Express (the HTTP layer underneath the routing decorators)

## Getting started

```sh
npm install
npm run start:dev
```

The server listens at `http://localhost:3000`. The dev script rebuilds the
TypeScript source and restarts the server when files in `src` change.

## Scripts

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run build`      | Compile `src` to `dist`.                         |
| `npm start`          | Run the compiled app; run `npm run build` first. |
| `npm run start:dev`  | Rebuild and restart on source changes.           |
| `npm run start:prod` | Run the compiled app in production; build first. |

## API

- `GET /users/` returns the in-memory users.
- `POST /users/` creates a user. The JSON body must include a non-empty
  `name`, a valid `email`, a `password` of at least 8 characters, and an
  integer `age` of at least 16. Validation errors return status `400` with an
  `errors` array.

Example request body:

```json
{
  "name": "Alex",
  "email": "alex@example.com",
  "password": "password123",
  "age": 18
}
```

The in-memory list starts with two sample users and resets when the server
restarts; no database connection is used.

## Implemented concepts

- `@Controller` and HTTP method decorators (`@Get`, `@Post`, `@Put`,
  `@Delete`, `@Patch`) register routes.
- `@Injectable` and `@Inject(token)` use a container for constructor
  dependency injection.
- `@Module` and `bootstrap()` register providers and controllers per module.
  A provider is only visible within its own module unless the module lists
  it in `exports`; an importing module gains access to exported providers
  via `imports`, not to a module's full provider list.
- Parameter decorators (`@Body`, `@Param`, `@Query`, `@Req`, `@Res`) provide
  handler arguments; `@Body(DtoClass)` runs the custom validation pipe before
  the handler executes.
- Property decorators such as `@Required`, `@MinLength`, and `@IsEmail`
  attach validation rules as metadata.

## Not implemented

Guards, interceptors, exception filters, request-scoped providers, and
circular-module resolution. Also, the instance cache is a single flat map
shared by the whole app rather than one per module, so an unexported
provider still resolves to the same shared instance everywhere instead of
a separate instance per encapsulated module, as real Nest would do. Some
of these are planned as further learning exercises.
