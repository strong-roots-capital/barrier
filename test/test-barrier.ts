import test from 'ava'

/**
 * Library under test
 */

import makeBarrier from '../src/barrier'

test('one-count barrier waits for one external invocation', async t => {
    const barrier = makeBarrier()

    setTimeout(barrier, 1)

    const value = await barrier()
    t.deepEqual(value, [])
})

test('n-count barrier waits for n additional invocations', async t => {
    const n = 2
    const barrier = makeBarrier(n)

    setTimeout(barrier, 1)
    setTimeout(barrier, 1)

    const values = await barrier()
    t.deepEqual(values, [])
})

test('one-count barrier should return array of one passed-value', async t => {
    const given = 42
    const barrier = makeBarrier<number>()

    setTimeout(() => barrier(given), 1)

    const value = await barrier()
    t.deepEqual(value, [given])
})

test('one-count barrier should support array destructuring', async t => {
    const given = 42
    const barrier = makeBarrier<number>()

    setTimeout(() => barrier(given), 1)

    const [value] = await barrier()
    t.deepEqual(value, given)
})

test('n-count barrier should return array of n passed-values', async t => {
    const n = 2
    const first = 1
    const second = 2
    const barrier = makeBarrier(n)

    setTimeout(async () => await barrier(first), 1)
    setTimeout(async () => await barrier(second), 1)

    const values = await barrier()
    t.deepEqual(values, [first, second])
})

test.cb('barrier should expose .then of underlying promise', t => {
    const barrier = makeBarrier()
    setTimeout(barrier, 1)
    barrier().then(() => t.end())
})

test('barrier can be called more times than specified', async t => {
    const barrier = makeBarrier()

    setTimeout(barrier, 1)

    const value = await barrier('one')
    t.deepEqual(value, ['one'])

    await barrier()
    t.pass()
})

test('when called more times than specified, should return original resolve-value', async t => {
    const barrier = makeBarrier()

    setTimeout(barrier, 1)

    const value = await barrier('one')
    t.deepEqual(value, ['one'])

    const secondvalue = await barrier('second')
    t.deepEqual(secondvalue, value)
})
