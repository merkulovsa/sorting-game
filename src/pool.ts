export class Pool<T> {
    private readonly create: () => T

    private _used: T[]
    private _unused: T[]

    constructor(create: () => T) {
        this.create = create
        this._used = []
        this._unused = []
    }

    get used(): T[] {
        return this._used
    }

    get unused(): T[] {
        return this._unused
    }

    get(): T {
        if (this._unused.length) {
            return this._unused.pop()
        }

        const value: T = this.create()
        this._used.push(value)

        return value
    }

    put(value: T) {
        const index: number = this._used.indexOf(value)
        if (index !== -1) {
            this._used.splice(index)
        }

        this._unused.push(value)
    }

    reset(): void {
        while (this._used.length) {
            this._unused.push(this._used.pop())
        }
    }

    clear(): void {
        this._used = []
        this._unused = []
    }
}