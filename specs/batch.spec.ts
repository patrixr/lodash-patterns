import { matcher, when, otherwise, bad, good } from '../index'
import it from 'ava'

const isRecordValid = matcher(
  [when.not('isObject'),        bad],
  [when.not('has', 'username'), bad],
  [when.not('has', 'email'),    bad],
  [when('thru', (record) => (<any>record).username.length < 8), bad],
  otherwise(good)
)

it('[batch] validates all the records correctly', (t) => {
  t.is(isRecordValid({}), false)
  t.is(isRecordValid({ username: 'hi', email: 'foo@bar.com' }), false)
  t.is(isRecordValid("not an object"), false)
  t.is(isRecordValid({ username: 'avalidusername'}), false)
  t.is(isRecordValid({ email: 'foo@bar.com'}), false)
  t.is(isRecordValid({ username: 'jeffgoldblum', email: 'jeff@goldblum.com'}), true)
})
