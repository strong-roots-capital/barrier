# barrier [![Build status](https://travis-ci.org/strong-roots-capital/barrier.svg?branch=master)](https://travis-ci.org/strong-roots-capital/barrier) [![npm version](https://img.shields.io/npm/v/@strong-roots-capital/barrier.svg)](https://npmjs.org/package/@strong-roots-capital/barrier) [![codecov](https://codecov.io/gh/strong-roots-capital/barrier/branch/master/graph/badge.svg)](https://codecov.io/gh/strong-roots-capital/barrier)

> A TypeScript implementation of the synchronization primitive

## Install

``` shell
npm install @strong-roots-capital/barrier
```

## Use

Create a barrier to suspend the current executing-context

``` typescript
import makeBarrier from '@strong-roots-capital/barrier'
const barrier = makeBarrier()
```

The default barrier (without arguments) waits for one additional
executing-context to reach the same barrier before resolving the
barrier and allowing the current executing-context to proceed.

``` typescript
const barrier = makeBarrier()
setTimeout(() => {barrier()}, 1000)

await barrier()
// will resolve after timeout invokes `barrier()`
```

A barrier is an ordinary Promise, so you can also use `.then`

``` typescript
const barrier = makeBarrier()
setTimeout(() => {barrier()}, 1000)

await barrier()
barrier().then(() => console.log('barrier has resolved'))
```

The optional numeric argument to `makeBarrier` describes the number of
executing-contexts required to reach the barrier before resolving

``` typescript
const barrier = makeBarrier(2)
setTimeout(() => {barrier()}, 1000)
setTimeout(() => {barrier()}, 1500)

await barrier()
// will resolve after both timeouts invoke `barrier()`
```

### Resolving values

Values can be resolved through the barrier (order will be preserved)

``` typescript
const barrier = makeBarrier<string>(2)
setTimeout(() => {barrier('one')}, 1000)
setTimeout(() => {barrier('two')}, 1500)

console.log(await barrier())
//=> ['one', 'two']
```

### Excessive calls

Excessive calls to the barrier will not have any effect; a resolved
promise will be returned

``` typescript
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

Do not wait twice for the same barrier in the same event. It will
never resolve

``` typescript
// don't do this
const barrier = makeBarrier()
await barrier()
await barrier()
```


## FAQ

Why yet-another barrier?

There are several barrier implementations on npm, unfortunately, I
couldn't find any that fit my needs:

- Strongly-typed with generics
- Resolves values from executing-contexts reaching the barrier
- Simple invocation
- Unsurprising behavior
- Well-maintained
- Comprehensive test suite

For the packages I found, pick 3 of these.

## Acknowledgments

This project was heavily inspired by the following packages

- [async-barrier](https://github.com/drpicox/async-barrier)
- [cb-barrier](https://github.com/geek/cb-barrier)
