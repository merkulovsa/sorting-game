import { PixiState } from "./pixi_state"
import { Container } from "pixi.js"
import { Designer } from "../../designer"
import { DotColor, LevelController } from "../../level_controller/level_controller"
import { MathUtils } from "../../utils/math_utils"
import { LEVELS } from "../../level_controller/levels"

export class PlayState extends PixiState {
    private readonly levelController: LevelController
    private readonly leftRotation: number
    private readonly rightRotation: number

    private targetRotation: number

    constructor(containers: Container[]) {
        super(containers)

        this.levelController = new LevelController(
            LEVELS[0],
            Designer.playScreen,
            [Designer.wallLeft, Designer.wallCenter, Designer.wallRight, Designer.hood]
        )
        const c: number = Designer.hood.height
        const b: number = window.app.screen.width / 2
        this.leftRotation = -Math.acos(b / c)
        this.rightRotation = -this.leftRotation
        this.targetRotation = 0

        Designer.buttonLeft.on("pointerdown", () => this.onLeftButtonDown())
        Designer.buttonLeft.on("pointerup", () => this.onButtonRelease())
        Designer.buttonRight.on("pointerdown", () => this.onRightButtonDown())
        Designer.buttonRight.on("pointerup", () => this.onButtonRelease())
    }

    enter(): void {
        super.enter()

        this.levelController.start()
    }

    update(): string {
        this.levelController.update()

        Designer.hood.rotation = MathUtils.lerp(Designer.hood.rotation, this.targetRotation, 0.5)

        return super.update()
    }

    private onButtonRelease(): void {
        this.targetRotation = 0
    }

    private onLeftButtonDown(): void {
        this.targetRotation = this.leftRotation
    }

    private onRightButtonDown(): void {
        this.targetRotation = this.rightRotation
    }
}
