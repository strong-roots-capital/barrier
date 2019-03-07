
barrier [![Build status](https://travis-ci.org/strong-roots-capital/barrier.svg?branch=master)](https://travis-ci.org/strong-roots-capital/barrier) [![npm version](https://img.shields.io/npm/v/@strong-roots-capital/barrier.svg)](https://npmjs.org/package/@strong-roots-capital/barrier) [![codecov](https://codecov.io/gh/strong-roots-capital/barrier/branch/master/graph/badge.svg)](https://codecov.io/gh/strong-roots-capital/barrier)
================================================================================================================================================================================================================================================================================================================================================================================================================================================

> A TypeScript implementation of the synchronization primitive

Install
-------

```shell
npm install @strong-roots-capital/barrier
```

Use
---

Create a barrier to suspend the current executing-context

```typescript
import barrier from '@strong-roots-capital/barrier'
const barrier = makeBarrier()
```

The default barrier (without arguments) waits for one additional executing-context to reach the same barrier before resolving the barrier and allowing the current executing-context to proceed.

```typescript
const barrier = makeBarrier()
setTimeout(() => {barrier()}, 1000)

await barrier()
// will resolve after timeout invokes `barrier()`
```

A barrier is an ordinary Promise, so you can also use `.then`

```typescript
const barrier = makeBarrier()
setTimeout(() => {barrier()}, 1000)

await barrier()
barrier().then(() => console.log('barrier has resolved'))
```

The optional numeric argument to `makeBarrier` describes the number of executing-contexts required to reach the barrier before resolving

```typescript
const barrier = makeBarrier(2)
setTimeout(() => {barrier()}, 1000)
setTimeout(() => {barrier()}, 1500)

await barrier()
// will resolve after both timeouts invoke `barrier()`
```

### Resolving values

Values can be resolved through the barrier (order will be preserved)

```typescript
const barrier = makeBarrier<string>(2)
setTimeout(() => {barrier('one')}, 1000)
setTimeout(() => {barrier('two')}, 1500)

console.log(await barrier())
//=> ['one', 'two']
```

### Excessive calls

Excessive calls to the barrier will not have any effect; a resolved promise will be returned

```typescript
const barrier = makeBarrier<string>(2)
setTimeout(() => {barrier('one')}, 1000)
setTimeout(() => {barrier('two')}, 1500)
setTimeout(() => {barrier('three')}, 2000)

console.log(await barrier())
//=> ['one', 'two']

setTimeout(() => {
    console.log(await barrier())
    //=> ['one', 'two']
}, 2000)
```

### Don't

Do not wait twice for the same barrier in the same event. It will never resolve

```typescript
// don't do this
const barrier = makeBarrier()
await barrier()
await barrier()
```

FAQ
---

Why yet-another barrier?

There are several barrier implementations on npm, unfortunately, I couldn't find any that fit my needs:

*   Strongly-typed with generics
*   Resolves values from executing-contexts reaching the barrier
*   Simple invocation
*   Unsurprising behavior
*   Well-maintained
*   Comprehensive test suite

For the packages I found, pick 3 of these.

Acknowledgments
---------------

This project was heavily inspired by the following packages

*   [async-barrier](https://github.com/drpicox/async-barrier)
*   [cb-barrier](https://github.com/geek/cb-barrier)

## Index

### Functions

* [makeBarrier](#makebarrier)

---

## Functions

<a id="makebarrier"></a>

###  makeBarrier

▸ **makeBarrier**<`T`>(count?: *`number`*): `function`

*Defined in [barrier.ts:71](https://github.com/strong-roots-capital/barrier/blob/6353072/src/barrier.ts#L71)*

Create a barrier that stalls until `count` other executing-contexts reach the barrier.

*__remarks__*: A barrier is implemented with a `Promise` that will resolve after `count` additional invocations. This means you can wait for a barrier to be fulfilled like you would any other `Promise`:

```ts
const barrier = makeBarrier()

setTimeout(() => barrier(), 1000)

console.log('waiting for timeout to reach barrier...')
await barrier()
console.log('timeout concluded, now past the barrier')
```

Or to in a synchronous context

```ts
const barrier = makeBarrier()

setTimeout(() => barrier(), 1000)

console.log('waiting at the barrier')
barrier().then(() => console.log('past the barrier'))
```

Remember that `makeBarrier` returns a _function_, which must be invoked to indicate an executing-context has reached the barrier.

A value can be resolved through the barrier from each executing-context to reach the check-point

```ts
const barrier = makeBarrier<number>()

setTimeout(() => barrier(42), 1000)

console.log('waiting for the answer...')
const value: number[] = await barrier()
console.log('the answer appears to be', value[0])
```

Array destructuring can clean up the syntax when `count` === 1

```ts
const barrier = makeBarrier<number>()

setTimeout(() => barrier(42), 1000)

console.log('waiting for the answer...')
const [value]: number = await barrier()
console.log('the answer appears to be', value)
```

**Type parameters:**

#### T 
**Parameters:**

| Name | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Default value` count | `number` | 1 |  Number of executing-contexts needed to reach the barrier before the \`Promise\` resolves |

**Returns:** `function`
Function that returns a `Promise` resolving after `count`
additional invocations

___

