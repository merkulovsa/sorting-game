import { State } from "../state_machine"
import { Container } from "pixi.js"

export abstract class PixiState extends State {
    protected readonly containers: Container[]

    protected constructor(containers: Container[]) {
        super()

        this.containers = containers
        this.containers.forEach(
            (value) => value.visible = false,
        )
    }

    enter(): void {
        this.containers.forEach(
            (value) => value.visible = true,
        )
    }

    exit(): void {
        this.nextStateName = ""
        
        this.containers.forEach(
            (value) => value.visible = false,
        )
    }
}
