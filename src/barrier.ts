/**
 * barrier
 * A TypeScript implementation of the synchronization primitive
 */


/**
 * Create a barrier that stalls until `count` other executing-contexts
 * reach the barrier.
 *
 * @remarks
 * A barrier is implemented with a `Promise` that will resolve after
 * `count` additional invocations. This means you can wait for a
 * barrier to be fulfilled like you would any other `Promise`:
 *
 * ```ts
 * const barrier = makeBarrier()
 *
 * setTimeout(() => barrier(), 1000)
 *
 * console.log('waiting for timeout to reach barrier...')
 * await barrier()
 * console.log('timeout concluded, now past the barrier')
 * ```
 *
 * Or to in a synchronous context
 *
 * ```ts
 * const barrier = makeBarrier()
 *
 * setTimeout(() => barrier(), 1000)
 *
 * console.log('waiting at the barrier')
 * barrier().then(() => console.log('past the barrier'))
 * ```
 *
 * Remember that `makeBarrier` returns a _function_, which must be
 * invoked to indicate an executing-context has reached the barrier.
 *
 *
 * A value can be resolved through the barrier from each
 * executing-context to reach the check-point
 *
 * ```ts
 * const barrier = makeBarrier<number>()
 *
 * setTimeout(() => barrier(42), 1000)
 *
 * console.log('waiting for the answer...')
 * const value: number[] = await barrier()
 * console.log('the answer appears to be', value[0])
 * ```
 *
 * Array destructuring can clean up the syntax when `count` === 1
 *
 * ```ts
 * const barrier = makeBarrier<number>()
 *
 * setTimeout(() => barrier(42), 1000)
 *
 * console.log('waiting for the answer...')
 * const [value]: number = await barrier()
 * console.log('the answer appears to be', value)
 * ```
 *
 * @param count - Number of executing-contexts needed to reach the
 * barrier before the `Promise` resolves
 * @returns Function that returns a `Promise` resolving after `count`
 * additional invocations
 */
export default function makeBarrier<T>(count = 1): (value?: T | undefined) => Promise<T[]> {

    let calls = 0
    let values: T[] = []
    let resolve: (value?: T[] | PromiseLike<T[]> | undefined) => void
    let resolved = false

    const promise = new Promise<T[]>((_resolve, _reject) => {
        resolve = _resolve
    })

    return function barrier(value?: T) {
        calls++

        if (!resolved && value !== undefined) {
            values.push(value)
        }

        if (calls > count) {
            resolved = true
            resolve(values)
        }

        return promise
    }
}
