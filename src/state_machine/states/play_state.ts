import { PixiState } from "./pixi_state"
import { Container } from "pixi.js"
import { Designer } from "../../designer"
import { DotColor, LevelController } from "../../level_controller/level_controller"
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
            {
                groups: [
                    {
                        amount: 10,
                        deltaTime: 1000,
                        colors: [DotColor.Green],
                        leftColor: DotColor.Green,
                        rightColor: DotColor.Green,
                        zones: [{start: window.app.screen.width * 1 / 4}, {start: window.app.screen.width * 3 / 4}]
                    },
                    {
                        amount: 10,
                        deltaTime: 400,
                        colors: [DotColor.Red],
                        leftColor: DotColor.Red,
                        rightColor: DotColor.Green,
                        zones: [{start: window.app.screen.width * 1 / 2}]
                    },
                    {
                        amount: 10,
                        deltaTime: 100,
                        colors: [DotColor.Red, DotColor.Green, DotColor.Blue],
                        colorWeights: [8, 1, 1],
                        leftColor: DotColor.Green,
                        rightColor: DotColor.Red,
                        zones: [
                            {start: window.app.screen.width * 1 / 4 - 10, end: window.app.screen.width * 1 / 4 + 10},
                            {start: window.app.screen.width * 2 / 4 - 10, end: window.app.screen.width * 2 / 4 + 10},
                            {start: window.app.screen.width * 3 / 4 - 10, end: window.app.screen.width * 3 / 4 + 10},
                        ],
                        impulse: 500
                    }
                ],
                cycle: true,
                shuffle: true,
            },
            Designer.playScreen,
            [Designer.wallLeft, Designer.wallCenter, Designer.wallCenter, Designer.hood]
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
