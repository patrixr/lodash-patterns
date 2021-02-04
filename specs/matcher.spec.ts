import { matcher, when, otherwise, use } from '../index'
import it from 'ava'

const detectErrorType = matcher(
  [when("has", "body.errors"), () => "ApiError"],
  [when("isString"), () => "ServerError"],
  [when("isMatch", { message: 'unknown' }), () => "UnknownError"],
  otherwise(() => "Internal Error")
)

const movieOf = matcher(
  [when("isEqual", "john travolta"), use("pulp fiction")],
  [when("isEqual", "tom hanks"), use("forrest gump")],
  [when("isEqual", "tom hanks"), use("the terminal")],
  [when("isEqual", "morgan freeman"), use("shawshank")]
)

it('defaults to the fallback resolver without predicate', (t) => {
  t.is(detectErrorType(1), 'Internal Error');
})

it('returns null if no matchers worked and there is no fallback resolver', (t) => {
  t.is(movieOf('keanu reeves'), null);
})

it('resolves on the first match', (t) => {
  t.is(movieOf('tom hanks'), 'forrest gump');
})

it('matches the negative with when.not', (t) => {
  const describeNumber = matcher(
    [when('gte', 1000), () => ">= thousand"],
    [when.not('lte', 0), () => "somewhere between 0 and 1000"]
  )

  t.is(describeNumber(10), "somewhere between 0 and 1000");
})
