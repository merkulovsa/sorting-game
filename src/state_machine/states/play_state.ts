import { PixiState } from "./pixi_state"
import { Container } from "pixi.js"
import { Designer } from "../../designer"

export class PlayState extends PixiState {
    private readonly leftRotation: number
    private readonly rightRotation: number

    constructor(containers: Container[]) {
        super(containers)

        Designer.buttonLeft.on("pointerdown", () => this.onLeftButtonDown())
        Designer.buttonLeft.on("pointerup", () => this.onButtonRelease())
        Designer.buttonRight.on("pointerdown", () => this.onRightButtonDown())
        Designer.buttonRight.on("pointerup", () => this.onButtonRelease())

        const c: number = Designer.hood.height
        const b: number = window.app.screen.width / 2
        this.leftRotation = -Math.acos(b / c)
        this.rightRotation = -this.leftRotation
    }

    private onButtonRelease(): void {
        Designer.shoulder.rotation = 0
    }

    private onLeftButtonDown(): void {
        Designer.shoulder.rotation = this.leftRotation
    }

    private onRightButtonDown(): void {
        Designer.shoulder.rotation = this.rightRotation
    }
}
