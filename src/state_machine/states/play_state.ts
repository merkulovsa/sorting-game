import { PixiState } from "./pixi_state"
import { Container } from "pixi.js"
import { Designer } from "../../designer"
import { LevelColor, LevelController } from "../../level_controller/level_controller"
import { MathUtils } from "../../utils/math_utils"

const p2 = require("p2")

export class PlayState extends PixiState {
    private readonly levelController: LevelController
    private readonly leftRotation: number
    private readonly rightRotation: number

    private targetRotation: number

    constructor(containers: Container[]) {
        super(containers)

        this.levelController = new LevelController(
            Designer.playScreen,
            {
                groups: [
                    {
                        amount: 10,
                        deltaTime: 1000,
                        colors: [LevelColor.Green],
                        zones: [{start: window.app.screen.width * 1 / 4}, {start: window.app.screen.width * 3 / 4}]
                    },
                    {
                        amount: 10,
                        deltaTime: 400,
                        colors: [LevelColor.Red],
                        zones: [{start: window.app.screen.width * 1 / 2}]
                    }
                ]
            }
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

        this.levelController.start(() => console.log("+"))
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
