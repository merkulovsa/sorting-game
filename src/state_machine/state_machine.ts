export abstract class State {
    protected nextStateName: string

    protected constructor() {
        this.nextStateName = ""
    }

    get name(): string {
        return this.constructor.name
    }

    abstract enter(): void

    abstract exit(): void

    update(): string {
        return this.nextStateName
    }
}

export class StateMachine {
    private readonly states: {[key: string]: State}

    private currentStateName: string

    constructor(...states: State[]) {
        this.states = {}
        this.currentStateName = ""

        for (const state of states) {
            this.states[state.name] = state
        }
    }

    change(nextStateName: string): void {
        if (nextStateName in this.states) {
            this.states[this.currentStateName]?.exit()
            this.currentStateName = nextStateName
            this.states[this.currentStateName].enter()
        }
    }

    update(): void {
        if (this.currentStateName in this.states) {
            const nextStateName: string = this.states[this.currentStateName].update()

            if (nextStateName != this.currentStateName) {
                this.change(nextStateName)
            }
        }
    }
}
