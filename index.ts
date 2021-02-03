import _, { LoDashStatic } from 'lodash'

type PredicateMethod = (
  'includes'          | 'startsWith'    |
  'endsWith'          | 'some'          |
  'eq'                | 'inRange'       |
  'lt'                | 'lte'           |
  'gt'                | 'gte'           |
  'has'               | 'hasIn'         |
  'isArguments'       | 'isArray'       |
  'isArrayBuffer'     | 'isArrayLike'   |
  'isArrayLikeObject' | 'isBoolean'     |
  'isBuffer'          | 'isDate'        |
  'isElement'         | 'isEmpty'       |
  'isEqual'           | 'isEqualWith'   |
  'isError'           | 'isFinite'      |
  'isFunction'        | 'isInteger'     |
  'isLength'          | 'isMap'         |
  'isMatch'           | 'isMatchWith'   |
  'isNaN'             | 'isNative'      |
  'isNil'             | 'isNull'        |
  'isNumber'          | 'isObject'      |
  'isObjectLike'      | 'isPlainObject' |
  'isRegExp'          | 'isSafeInteger' |
  'isSet'             | 'isString'      |
  'isSymbol'          | 'isTypedArray'  |
  'isUndefined'       | 'isWeakMap'     |
  'isWeakSet' 
) & keyof LoDashStatic

// -----------------------------
//  Type definitions
// -----------------------------

type AnyFunction = (...args: any[]) => any;

type ArgumentsOf<F extends AnyFunction> = F extends (...args: infer A) => any ? A : never;

type WhenPredicate<T> = (el: T) => boolean

type ValueResolver<In, Out> = ((el: In) => Out)

type MatchCondition<In, Out>  = [WhenPredicate<In>, ValueResolver<In, Out>]|ValueResolver<In, Out>

type Matcher<In, Out> = (el: In) => Out|null

type Tail<T> = T extends [any, ...infer U] ? U : []

type TailArgs<F extends AnyFunction> = Tail<ArgumentsOf<F>>

// -----------------------------
//  Pattern Matching API
// -----------------------------

export function when<T, M extends PredicateMethod>(
  method: M,
  ...args: TailArgs<LoDashStatic[typeof method]>
) : WhenPredicate<T> {
  return (el : T) => Boolean((_ as any)[method](el, ...args))
}

export function matcher<In, Out>(...args: MatchCondition<In, Out>[]) : Matcher<In, Out> {
  return (el: In) => {
    for (let matcher of args) {
      const predicate = _.isArray(matcher) ? matcher[0] : () => true
      const resolver  = _.isArray(matcher) ? matcher[1] : matcher

      if (predicate(el)) {
        return resolver(el);
      }
    }
    return null;
  }
}

export default { when, matcher }
