import { Container, Sprite } from "pixi.js"
import { Designer } from "../designer"
import { MathUtils } from "../utils/math_utils"
import { PhysicsContainer } from "../utils/physics_container"
import { Pool } from "../utils/pool"

const p2 = require("p2")

export interface LevelSettings {
    groups: LevelGroup[]
    shuffle?: boolean
    cycle?: boolean
}

export enum DotColor {
    Red = 0xFF0000,
    Green = 0x00FF00,
    Blue = 0x0000FF,
}

export interface LevelGroup {
    amount: number
    deltaTime: number
    colors: DotColor[]
    colorWeights?: number[]
    leftColor: DotColor
    rightColor: DotColor
    zones: Array<{ start: number, end?: number }>
    impulse?: number
}

abstract class LevelObject {
    readonly physicsContainer: PhysicsContainer
    readonly sprite: Sprite

    protected constructor(physicsContainer: PhysicsContainer) {
        this.physicsContainer = physicsContainer
        this.sprite = <Sprite>this.physicsContainer.container
    }

    abstract start(...args: any[]): void

    abstract stop(...args: any[]): void
}

class Dot extends LevelObject {
    constructor(physicsContainer: PhysicsContainer) {
        super(physicsContainer)

        this.sprite.visible = false
    }

    get color(): DotColor {
        return this.sprite.tint
    }

    set color(value: DotColor) {
        this.sprite.tint = value
    }

    get isOffScreen(): boolean {
        return this.sprite.x > window.app.screen.bottom
    }

    start(x: number, y: number, impulse: number = 0): void {
        this.physicsContainer.body.position = [x, y]
        this.physicsContainer.body.velocity = [0, 0]
        this.physicsContainer.body.angularVelocity = 0
        this.physicsContainer.body.angle = 0
        this.physicsContainer.update()
        this.physicsContainer.start()

        impulse && this.physicsContainer.body.applyImpulse([0, impulse])

        this.sprite.visible = true
    }

    stop(): void {
        this.physicsContainer.stop()

        this.sprite.visible = false
    }
}

class Wall extends LevelObject {
    constructor(sprite: Sprite) {
        const body: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position: [sprite.x, sprite.y]
        })
        body.addShape(
            new p2.Box({ width: sprite.width, height: sprite.height }),
            [(sprite.anchor.x - 0.5) * sprite.width, (0.5 - sprite.anchor.y) * sprite.height]
        )

        super(new PhysicsContainer(sprite, body))
    }

    start(): void {
        this.physicsContainer.start()
    }

    stop(): void {
        this.physicsContainer.stop()
    }
}

export class LevelController {
    private readonly container: Container
    private readonly settings: LevelSettings
    private readonly spawner: Pool<Dot>

    private groups: LevelGroup[]
    private groupIndex: number
    private amount: number
    private _balance: number
    private deltaTime: number
    private stopped: boolean
    private dots: Dot[]
    private walls: Wall[]
    private onPassed: () => void
    private onFailed: () => void

    constructor(settings: LevelSettings, container: Container, walls: Sprite[]) {
        this.container = container
        this.settings = settings
        this.spawner = new Pool(() => this.createDot())
        this.groups = this.settings.groups.slice()
        this.groupIndex = 0
        this.amount = 0
        this._balance = 0
        this.deltaTime = 0
        this.stopped = true
        this.dots = []
        this.walls = walls.map((value) => new Wall(value))
    }

    start(onPassed?: () => void, onFailed?: () => void, cycle?: boolean): void {
        if (this.settings.shuffle) {
            this.groups = MathUtils.shuffle(this.groups)
        }

        if (!cycle) {
            this.balance = 0
        }

        this.walls.forEach(
            (value) => value.start()
        )

        this.groupIndex = -1
        this.stopped = false
        this.onPassed = onPassed
        this.onFailed = onFailed

        this.nextGroup()
    }

    stop(): void {
        this.stopped = true

        this.walls.forEach(
            (value) => value.stop()
        )
    }

    update(): void {
        this.getOffScreenDots().forEach(
            (value) => {
                if (value.sprite.x < window.app.screen.width / 2) {
                    this.balance += value.color === this.leftColor ? 1 : -1
                } else {
                    this.balance += value.color === this.rightColor ? 1 : -1
                }

                value.stop()

                this.spawner.put(value)
            },
        )

        const now: number = Date.now()
        const passed: boolean = this.passed

        if (!passed && !this.stopped) {
            if (this.amount === 0) {
                this.nextGroup()
            }

            if (now - this.deltaTime > this.currentGroup.deltaTime) {
                this.startDot()
                this.deltaTime = now
            }
        } else if (passed && !this.stopped) {
            if (this.settings.cycle) {
                this.start(this.onPassed, this.onFailed, true)
            } else {
                this.stopped = true
                this.onPassed && this.onPassed()
            }
        } else if (!passed && this.stopped) {
            this.stopped = true
            this.onFailed && this.onFailed()
        }
    }

    private get passed(): boolean {
        return this.groupIndex === this.settings.groups.length - 1 && this.amount === 0
    }

    private get currentGroup(): LevelGroup {
        return this.groups[this.groupIndex]
    }

    private get leftColor(): DotColor {
        return Designer.leftColor.tint
    }

    private set leftColor(value: DotColor) {
        Designer.leftColor.tint = value
    }

    private get rightColor(): DotColor {
        return Designer.rightColor.tint
    }

    private set rightColor(value: DotColor) {
        Designer.rightColor.tint = value
    }

    private get balance(): number {
        return this._balance
    }

    private set balance(value: number) {
        this._balance = value
        Designer.balanceText.text = value.toString()
    }

    private createDot(): Dot {
        const sprite: Sprite = Sprite.from(window.loader.resources["./assets/sphere_white.png"].texture)
        sprite.anchor.set(0.5)
        sprite.width = window.app.screen.width / 10
        sprite.height = window.app.screen.width / 10
        sprite.zIndex = 0
        this.container.addChild(sprite)

        const body: p2.Body = new p2.Body({
            type: p2.Body.DYNAMIC,
            mass: 1,
            position: [0, 0],
        })
        body.addShape(new p2.Circle({ radius: sprite.width / 2 }))

        return new Dot(new PhysicsContainer(sprite, body))
    }

    private startDot(): void {
        for (const zone of this.currentGroup.zones.slice(0, this.amount)) {
            const dot: Dot = this.spawner.get()

            if (this.currentGroup.colorWeights) {
                dot.color = MathUtils.randomWeightedValue(this.currentGroup.colors, this.currentGroup.colorWeights)
            } else {
                dot.color = MathUtils.randomValue(this.currentGroup.colors)
            }

            const dotIndex: number = this.dots.indexOf(dot)
            const x: number = MathUtils.randomBetween(zone.start, zone.end || zone.start) * window.app.screen.width
            const y: number = -dot.sprite.height / 2

            if (dotIndex === -1) {
                this.dots.push(dot)
            }

            dot.start(x, y, this.currentGroup.impulse)
            this.amount -= 1
        }
    }

    private nextGroup(): void {
        this.groupIndex += 1
        this.amount = this.currentGroup.amount
        this.leftColor = this.currentGroup.leftColor
        this.rightColor = this.currentGroup.rightColor
        this.deltaTime = Date.now()
    }

    private getOffScreenDots(): Dot[] {
        return this.dots.filter(
            (value) => value.sprite.y > window.app.screen.bottom && value.sprite.visible,
        )
    }
}
