import { matcher, when } from '../index'
import it from 'ava'

const guessErrorType = matcher(
  [when("has", "body.errors"), () => "ApiError"],
  [when("isString"), () => "ServerError"],
  [when("isMatch", { message: 'unknown' }), () => "UnknownError"],
  () => "Internal Error" // default
)

const guessMovie = matcher(
  [when("isEqual", "john travolta"), () => "Pulp Fiction"],
  [when("isEqual", "tom hanks"), () => "forrest gump"],
  [when("isEqual", "tom hanks"), () => "the terminal"],
  [when("isEqual", "morgan freeman"), () => "Shawshank"]
)

it('defaults to the fallback resolver without predicate', (t) => {
  t.is(guessErrorType(1), 'Internal Error');
})

it('returns null if no matchers worked and there is no fallback resolver', (t) => {
  t.is(guessMovie('keanu reeves'), null);
})

it('resolves on the first match', (t) => {
  t.is(guessMovie('tom hanks'), 'forrest gump');
})
