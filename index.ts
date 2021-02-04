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
  'isWeakSet'         | 'thru'          |
  'conformsTo'        | 'conforms'      |
  'stubTrue'          | 'stubFalse'
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

type LodashArgs<FuncKey extends PredicateMethod> = TailArgs<LoDashStatic[FuncKey]>

// -----------------------------
//  Pattern Matching API
// -----------------------------

/**
 * Creates a predicate based on (some) lodash methods
 *
 * @export
 * @template T
 * @template M
 * @param {M} method
 * @param {...LodashArgs<typeof method>} args
 * @returns {WhenPredicate<T>}
 */
export function when<T, M extends PredicateMethod>(method: M, ...args: LodashArgs<typeof method>) : WhenPredicate<T> {
  return (el : T) => Boolean((_ as any)[method](el, ...args))
}

/**
 * Creates a negative predicate based on (some) lodash methods
 *
 * @template T
 * @template M
 * @param {M} method
 * @param {...LodashArgs<typeof method>} args
 * @returns {WhenPredicate<T>}
 */
when.not = <T, M extends PredicateMethod>(method: M, ...args: LodashArgs<typeof method>) : WhenPredicate<T> => {
  const positive = when(method, ...args);
  return (el : T) => !positive(el);
}


/**
 * Creates a fallback match condition
 *
 * @export
 * @template In
 * @template Out
 * @param {ValueResolver<In, Out>} resolver
 * @returns {MatchCondition<In, Out>}
 */
export function otherwise<In, Out>(resolver: ValueResolver<In, Out>) : MatchCondition<In, Out> {
  return [() => true, resolver];
}

/**
 * Create a pattern matching function
 *
 * @export
 * @template In
 * @template Out
 * @param {...MatchCondition<In, Out>[]} args
 * @returns {Matcher<In, Out>}
 */
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

export const good   = () => true
export const bad    = () => false
export const no     = bad
export const yes    = good
export const value  = <T>(val: T) => () => val
export const use    = value

export default { when, matcher, otherwise, good, bad, no, yes, value }
