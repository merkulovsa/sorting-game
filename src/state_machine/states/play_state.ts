import { PixiState } from "./pixi_state"
import { Container } from "pixi.js"
import { Designer } from "../../designer"
import { LevelController } from "../../level_controller/level_controller"
import { MathUtils } from "../../utils/math_utils"
import { LEVELS } from "../../level_controller/levels"

export class PlayState extends PixiState {
    private static readonly hoodRotation: number = Math.PI / 4

    private readonly levelController: LevelController

    private targetRotation: number

    constructor(containers: Container[]) {
        super(containers)

        Designer.hood.height = window.app.screen.width / 2 / Math.cos(Math.PI / 2 - PlayState.hoodRotation)

        this.levelController = new LevelController(
            LEVELS[1],
            Designer.playScreen,
            [Designer.wallLeft, Designer.wallCenter, Designer.wallRight, Designer.hood]
        )
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

        Designer.hood.rotation = MathUtils.lerp(Designer.hood.rotation, this.targetRotation, 0.2)

        return super.update()
    }

    private onButtonRelease(): void {
        this.targetRotation = 0
    }

    private onLeftButtonDown(): void {
        this.targetRotation = -PlayState.hoodRotation
    }

    private onRightButtonDown(): void {
        this.targetRotation = PlayState.hoodRotation
    }
}
