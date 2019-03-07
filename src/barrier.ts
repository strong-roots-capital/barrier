/**
 * barrier
 * A TypeScript implementation of the synchronization primitive
 */

import is from '@sindresorhus/is'


interface PromiseBarrier<T> {
    pass: (value: T | Error) => T

    count: number
    // passes: T
    resolve: (value?: T | PromiseLike<T> | undefined) => void
    reject: (reason?: any) => void
}


/**
 * TODO: document
 */
export default class Barrier<T> {

    count: number
    // passes: T

    resolve: (value?: T | PromiseLike<T> | undefined) => void = () => {}
    reject: (reason?: any) => void = () => {}

    // TODO: separate constructors for count === 1 and count > 1
    constructor(count = 1) {
       this.count = count

        const promise: any = new Promise<T>((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
        promise.pass = this.pass.bind(this)
        return promise as Promise<T> & PromiseBarrier<T>
    }


    pass(value?: T | Error) {
        if (is.error(value)) {
            return this.reject(value)
        }

        // this.passes.push(value)

        if (--this.count) {
            return
        }

        console.log('resolving value', value)
        return this.resolve(value)
    }


}
