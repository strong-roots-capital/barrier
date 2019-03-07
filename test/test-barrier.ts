import test from 'ava'

/**
 * Library under test
 */

import Barrier from '../src/barrier'

test('one-count barrier waits for one invocation of pass', async t => {
    const barrier = new Barrier()

    setTimeout(() => {
        console.log('passing barrier')
        barrier.pass()
    }, 100)

    console.log('awaiting barrier')
    await barrier
    t.pass()
})

test('n-count barrier waits for n invocations of pass', async t => {
    const n = 2
    const barrier = new Barrier(n)

    setTimeout(() => {
        console.log('passing barrier')
        barrier.pass()
    }, 100)

    setTimeout(() => {
        console.log('passing barrier')
        barrier.pass()
    }, 150)

    console.log('awaiting barrier')
    await barrier
    t.pass()
})

test.only('one-count barrier should return single passed-value', async t => {
    const given = 42
    const barrier = new Barrier<number>()

    setTimeout(() => {
        console.log('passing barrier')
        barrier.pass(given)
    }, 100)

    console.log('awaiting barrier')
    const value = await barrier
    t.is(value, given)
    t.pass()
})

test.todo('n-count barrier should return array of passed values')

test.todo('barrier should expose .then function of underlying promise')
