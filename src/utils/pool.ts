export class Pool<T> {
    private readonly create: () => T

    private used: T[]
    private unused: T[]

    constructor(create: () => T) {
        this.create = create
        this.used = []
        this.unused = []
    }

    get(): T {
        if (this.unused.length) {
            return this.unused.pop()
        }

        const value: T = this.create()
        this.used.push(value)

        return value
    }

    put(value: T) {
        const index: number = this.used.indexOf(value)
        if (index !== -1) {
            this.used.splice(index)
        }

        this.unused.push(value)
    }

    reset(): void {
        while (this.used.length) {
            this.unused.push(this.used.pop())
        }
    }

    clear(): void {
        this.used = []
        this.unused = []
    }
}