# Lodash Patterns

Mini pattern matching tool leveraging lodash methods. Written in typescript

## Installation

Note: Lodash is not included in the module, and has to be installed separately

```bash
npm install --save lodash-patterns lodash
```

## Usage

```typescript
import { when, matcher } from 'lodash-patterns'

const guessErrorType = matcher(
  [when("has", "body.errors"), () => "ApiError"],
  [when("isString"), () => "ServerError"],
  [when("isMatch", { message: "unknown error" }), () => "UnknownError"],
  () => "Internal Error" // fallback resolver
)

const errorType = guessErrorType({ message: 'unknown error' })
```

## Development

### Install dependencies

```bash
npm install
```
### Running tests

```bash
npm run test
```
