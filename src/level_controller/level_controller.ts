import { Container, Sprite } from "pixi.js"
import { Designer } from "../designer"
import { MathUtils } from "../utils/math_utils"
import { PhysicsContainer } from "../utils/physics_container"
import { Pool } from "../utils/pool"

const p2 = require("p2")

export interface LevelSettings {
    groups: LevelGroup[]
    random?: boolean
    cycle?: boolean
}

export enum LevelColor {
    Red = 0,
    Green = 1,
    Blue = 2,
}

export interface LevelGroup {
    amount: number
    deltaTime: number
    colors: LevelColor[]
    zones: Array<{start: number, end?: number}>
    impulse?: number
}

export class LevelController {
    private static tints: {[key: number]: number} = {
        0: 0xFF0000,
        1: 0x00FF00,
        2: 0x0000FF,
    }

    private readonly container: Container
    private readonly settings: LevelSettings
    private readonly spawner: Pool<PhysicsContainer>

    private groupIndex: number
    private amount: number
    private time: number
    private stopped: boolean
    private items: PhysicsContainer[]
    private onComplete: () => void

    constructor(container: Container, settings: LevelSettings) {
        this.container = container
        this.settings = settings
        this.spawner = new Pool(() => this.create())
        this.groupIndex = 0
        this.amount = 0
        this.time = 0
        this.stopped = true
        this.items = []

        const wallLeftBody: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position: [Designer.wallLeft.x, Designer.wallLeft.y]
        })
        wallLeftBody.addShape(new p2.Box({width: Designer.wallLeft.width, height: Designer.wallLeft.height}))
        new PhysicsContainer(Designer.wallLeft, wallLeftBody).start()

        const wallCenterBody: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position: [Designer.wallCenter.x, Designer.wallCenter.y]
        })
        wallCenterBody.addShape(new p2.Box({width: Designer.wallCenter.width, height: Designer.wallCenter.height}))
        new PhysicsContainer(Designer.wallCenter, wallCenterBody).start()

        const wallRightBody: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position: [Designer.wallRight.x, Designer.wallRight.y]
        })
        wallRightBody.addShape(new p2.Box({width: Designer.wallRight.width, height: Designer.wallRight.height}))
        new PhysicsContainer(Designer.wallRight, wallRightBody).start()

        const hoodBody: p2.Body = new p2.Body({
            type: p2.Body.STATIC,
            position: [Designer.hood.x, Designer.hood.y]
        })
        hoodBody.addShape(new p2.Box({width: Designer.hood.width, height: Designer.hood.height}), [0, -Designer.hood.height / 2])
        new PhysicsContainer(Designer.hood, hoodBody).start()
    }

    start(onComplete: () => void): void {
        this.groupIndex = 0
        this.amount = this.currentGroup.amount
        this.time = Date.now()
        this.stopped = false
        this.onComplete = onComplete
    }

    stop(): void {
        this.stopped = true
    }

    update(): void {
        if (!this.isCompleted && !this.stopped) {
            if (this.amount === 0) {
                this.groupIndex += 1
                this.amount = this.currentGroup.amount
            }

            const now: number = Date.now()
            
            if (now - this.time > this.currentGroup.deltaTime) {
                this.drop()
                this.time = now
            }
        } else if (this.isCompleted && !this.stopped) {
            this.stopped = true
            this.onComplete && this.onComplete()
        }

        this.checkOffScreen()
    }

    private get isCompleted(): boolean {
        return this.groupIndex === this.settings.groups.length - 1 && this.amount === 0
    }

    private get currentGroup(): LevelGroup {
        return this.settings.groups[this.groupIndex]
    }

    private create(): PhysicsContainer {
        const sprite: Sprite = Sprite.from(window.loader.resources["./assets/sphere_white.png"].texture)
        sprite.anchor.set(0.5)
        sprite.width = window.app.screen.width / 10
        sprite.height = window.app.screen.width / 10
        sprite.visible = false

        this.container.addChild(sprite)

        const body: p2.Body = new p2.Body({
            type: p2.Body.DYNAMIC,
            mass: 1,
            position: [0, 0],
        })
        body.addShape(new p2.Circle({radius: sprite.width / 2}))

        return new PhysicsContainer(sprite, body)
    }

    private drop(): void {
        for (const zone of this.currentGroup.zones) {
            const item: PhysicsContainer = this.spawner.get()
            const itemIndex: number = this.items.indexOf(item)

            if (itemIndex === -1) {
                this.items.push(item)
            }
            
            const sprite: Sprite = <Sprite> item.container
            const tintIndex: number = this.currentGroup.colors[MathUtils.randomIntBetween(0, this.currentGroup.colors.length)]
            sprite.tint = LevelController.tints[tintIndex]
            sprite.visible = true

            item.body.velocity = [0, 0]
            item.body.angularVelocity = 0
            item.body.position[0] = MathUtils.randomBetween(zone.start, zone.end || zone.start)
            item.body.position[1] = -sprite.height / 2
            item.body.angle = 0

            item.update()
            item.start()

            if (this.currentGroup.impulse) {
                item.body.applyImpulse([0, this.currentGroup.impulse])
            }
            
            if (--this.amount === 0) {
                break
            }
        }
    }

    private checkOffScreen(): void {
        this.items.forEach(
            (value) => {
                const sprite: Sprite = <Sprite> value.container

                if (sprite.getBounds().y > window.app.screen.bottom && sprite.visible) {
                    value.stop()
                    value.container.visible = false

                    this.spawner.put(value)
                }
            },
        )
    }
}
