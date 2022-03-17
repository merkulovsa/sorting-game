import EventEmitter from "eventemitter3"
import { Container, Sprite } from "pixi.js"
import { Designer } from "../designer"
import { MathUtils } from "../utils/math_utils"
import { PhysicsContainer } from "../utils/physics_container"
import { Pool } from "../utils/pool"

const p2 = require("p2")

export interface LevelSettings {
    groups: LevelGroup[]
    interGroup?: LevelGroup
    shuffle?: boolean
    cycle?: boolean
    timeImpulse?: number
    baseImpulse?: number
    penalty?: number
    reward?: number
}

export enum DotColor {
    Red = 0xFF0000,
    Green = 0x00FF00,
    Blue = 0x0000FF,
}

export interface LevelGroup {
    amount?: number
    deltaTime?: number
    colors?: DotColor[]
    colorWeights?: number[]
    leftColor?: DotColor
    rightColor?: DotColor
    zones?: Array<{ start: number, end?: number }>
    impulse?: number
}

abstract class LevelObject extends EventEmitter {
    static readonly instances: LevelObject[] = []

    readonly physicsContainer: PhysicsContainer
    readonly sprite: Sprite

    protected constructor(physicsContainer: PhysicsContainer) {
        super()

        this.physicsContainer = physicsContainer
        this.sprite = <Sprite>this.physicsContainer.container

        LevelObject.instances.push(this)
    }

    abstract start(...args: any[]): void

    abstract stop(...args: any[]): void
}

class Dot extends LevelObject {
    static get instances(): Dot[] {
        return <Dot[]> LevelObject.instances.filter((value) => value instanceof Dot)
    }

    static readonly far: number = 2e3

    static readonly colors: DotColor[] = [
        DotColor.Red,
        DotColor.Green,
        DotColor.Blue,
    ]

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

    get tooFar(): boolean {
        return MathUtils.distance(this.sprite.x, this.sprite.y, window.app.screen.width / 2, window.app.screen.height / 2) > Dot.far
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
    static get instances(): Wall[] {
        return <Wall[]> LevelObject.instances.filter((value) => value instanceof Wall)
    }

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

class Trigger extends LevelObject {
    static get instances(): Trigger[] {
        return <Trigger[]> LevelObject.instances.filter((value) => value instanceof Trigger)
    }

    constructor(sprite: Sprite) {
        const body: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position: [sprite.x, sprite.y],
            collisionResponse: false,
        })
        body.addShape(
            new p2.Box({ width: sprite.width, height: sprite.height }),
            [(sprite.anchor.x - 0.5) * sprite.width, (0.5 - sprite.anchor.y) * sprite.height]
        )

        super(new PhysicsContainer(sprite, body))

        PhysicsContainer.world.on(
            "beginContact", 
            (event: p2.BeginContactEvent) => {
                if (event.bodyA === body || event.bodyB === body) {
                    this.emit("triggered", Dot.instances.filter(
                        (value) => value.physicsContainer.body === event.bodyA || value.physicsContainer.body === event.bodyB)[0]
                    )
                }
            },
        )
    }

    start(...args: any[]): void {
        this.physicsContainer.start()
    }

    stop(...args: any[]): void {
        this.physicsContainer.stop()
    }
}

export class LevelController extends EventEmitter {
    static copyLevelSettings(value: LevelSettings): LevelSettings {
        return {
            groups: value.groups.map((value1) => LevelController.copyLevelGroup(value1)),
            interGroup: value.interGroup,
            shuffle: value.shuffle,
            cycle: value.cycle,
            timeImpulse: value.timeImpulse,
            baseImpulse: value.baseImpulse,
            penalty: value.penalty,
            reward: value.reward,
        }
    }

    static copyLevelGroup(value: LevelGroup): LevelGroup {
        return {
            amount: value.amount,
            deltaTime: value.deltaTime,
            colors: value.colors,
            colorWeights: value.colorWeights,
            leftColor: value.leftColor,
            rightColor: value.rightColor,
            zones: value.zones,
            impulse: value.impulse,
        }
    }


    private readonly container: Container
    private readonly settings: LevelSettings
    private readonly spawner: Pool<Dot>
    private readonly leftTrigger: Trigger
    private readonly rightTrigger: Trigger

    private groups: LevelGroup[]
    private groupIndex: number
    private currentGroup: LevelGroup
    private stopped: boolean
    private startTime: number
    private stopTime: number
    private amount: number
    private _balance: number
    private deltaTime: number
    private dots: Dot[]
    private walls: Wall[]

    constructor(settings: LevelSettings, container: Container, walls: Sprite[], leftTrigger: Sprite, rightTrigger: Sprite) {
        super()

        this.container = container
        this.settings = LevelController.copyLevelSettings(settings)
        this.settings.cycle = settings.cycle || false
        this.settings.shuffle = settings.shuffle || false
        this.settings.penalty = settings.penalty || 1
        this.settings.reward = settings.reward || 1
        this.settings.baseImpulse = settings.baseImpulse || 0
        this.settings.timeImpulse = settings.timeImpulse || 0
        this.spawner = new Pool(() => this.createDot())
        this.leftTrigger = new Trigger(leftTrigger)
        this.leftTrigger.on("triggered", (dot) => this.onLeftTrigger(dot))
        this.rightTrigger = new Trigger(rightTrigger)
        this.rightTrigger.on("triggered", (dot) => this.onRightTrigger(dot))
        this.groups = this.settings.groups.slice()
        this.groupIndex = 0
        this.currentGroup = null
        this.stopped = false
        this.startTime = 0
        this.stopTime = 0
        this.amount = 0
        this._balance = 0
        this.deltaTime = 0
        this.dots = []
        this.walls = walls.map((value) => new Wall(value))
    }

    start(): void {
        if (this.settings.shuffle) {
            this.groups = MathUtils.shuffle(this.groups)
        }

        this.groupIndex = 0
        this.currentGroup = null
        this.balance = 0
        this.startTime = Date.now()
        this.stopTime = 0
        this.stopped = false

        this.walls.forEach(
            (value) => value.start()
        )
        this.leftTrigger.start()
        this.rightTrigger.start()

        this.nextGroup()
    }

    stop(): void {
        this.walls.forEach(
            (value) => value.stop()
        )
        this.leftTrigger.stop()
        this.rightTrigger.stop()

        this.stopped = true
    }

    update(): void {
        if (this.stopped) {
            return
        }

        const now: number = Date.now()
        const failed: boolean = this.failed
        const passed: boolean = this.passed
        const clear: boolean = this.clear

        if (!failed && !passed) {

            if (this.needToSpawn(now)) {
                if (this.amount === 0) {
                    this.nextGroup()
                }

                this.startDot(now)
                this.deltaTime = now
            }

        } else {

            if (passed && this.settings.cycle) {
                this.restart()
            } else {

                if (!this.stopTime) {
                    this.stopTime = now
                }

                if (clear) {
                    const time: number = this.stopTime - this.startTime
    
                    if (failed) {
                        this.emit("failed", 0, time)
                    } else {
                        this.emit("passed", this.balance, time)
                    }
    
                    this.stop()
                }

            }
        }
    }

    private get passed(): boolean {
        return this.groupIndex === this.settings.groups.length
    }

    private get failed(): boolean {
        return this._balance < 0
    }

    private get clear(): boolean {
        return this.spawner.used.length === 0 || this.spawner.used.every((value) => value.tooFar)
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
        if (!this.failed || value === 0) {
            this._balance = value
            Designer.balanceText.text = MathUtils.clampPositive(value).toString()
        }
    }

    private onLeftTrigger(dot: Dot): void {
        if (dot) {
            if (this.leftColor === dot.color) {
                this.addReward()
            } else {
                this.addPenalty()
            }

            this.stopDot(dot)
        }
    }

    private onRightTrigger(dot: Dot): void {
        if (dot) {
            if (this.rightColor === dot.color) {
                this.addReward()
            } else {
                this.addPenalty()
            }
            
            this.stopDot(dot)
        }
    }

    private addReward(): void {
        this.balance += this.settings.reward
    }

    private addPenalty(): void {
        this.balance -= this.settings.penalty
    }

    private restart(): void {
        if (this.settings.shuffle) {
            this.groups = MathUtils.shuffle(this.groups)
        }
        
        this.groupIndex = 0

        this.nextGroup()
    }

    private needToSpawn(time: number): boolean {
        return time - this.deltaTime > this.currentGroup.deltaTime
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

    private startDot(time: number): void {
        for (const zone of this.currentGroup.zones.slice(0, this.amount)) {
            const dot: Dot = this.spawner.get()

            if (this.currentGroup.colors.length) {
                if (this.currentGroup.colorWeights.length === this.currentGroup.colors.length) {
                    dot.color = MathUtils.randomWeightedValue(this.currentGroup.colors, this.currentGroup.colorWeights)
                } else {
                    dot.color = MathUtils.randomValue(this.currentGroup.colors)
                }
            } else {
                dot.color = MathUtils.randomValue(Dot.colors)
            }

            const dotIndex: number = this.dots.indexOf(dot)
            const x: number = MathUtils.randomBetween(zone.start, zone.end || zone.start) * window.app.screen.width
            const y: number = -dot.sprite.height / 2

            if (dotIndex === -1) {
                this.dots.push(dot)
            }

            let impulse: number = this.settings.baseImpulse

            if (this.settings.timeImpulse) {
                impulse += this.settings.timeImpulse * (time - this.startTime)
            } else {
                impulse += this.currentGroup.impulse
            }

            dot.start(x, y, impulse)

            this.amount -= 1
        }
    }

    private stopDot(dot: Dot): void {
        dot.stop()
        this.spawner.put(dot)
    }

    private nextGroup(): void {
        if ((this.settings.interGroup && this.currentGroup) && this.currentGroup !== this.settings.interGroup) {
            this.currentGroup = this.settings.interGroup
        } else {
            this.currentGroup = this.settings.groups[this.groupIndex++]
        }
        
        this.currentGroup.amount = this.currentGroup.amount || 0
        this.currentGroup.colors = this.currentGroup.colors || []
        this.currentGroup.zones = this.currentGroup.zones || [{start: window.app.screen.left, end: window.app.screen.right}]
        this.currentGroup.colorWeights = this.currentGroup.colorWeights || []
        this.currentGroup.deltaTime = this.currentGroup.deltaTime || 0
        this.currentGroup.impulse = this.currentGroup.impulse || 0

        this.amount = this.currentGroup.amount
        this.deltaTime = Date.now()

        if (this.currentGroup.leftColor) {
            this.leftColor = this.currentGroup.leftColor
        }
        if (this.currentGroup.rightColor) {
            this.rightColor = this.currentGroup.rightColor
        }
    }
}
