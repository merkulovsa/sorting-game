import * as PIXI from "pixi.js"

const p2 = require("p2")

export class PhysicsContainer {
    static get world(): p2.World {
        return (this._world || (this._world = new p2.World({gravity: [0, 100]})))
    }

    static update(): void {
        this._world?.step(1 / 60)

        this.instances.forEach(
            (value) => value.update()
        )
    }

    private static readonly instances: PhysicsContainer[] = []

    private static _world: p2.World


    readonly container: PIXI.Container
    readonly body: p2.Body

    constructor(container: PIXI.Container, body: p2.Body) {
        this.container = container
        this.body = body

        PhysicsContainer.world.addBody(body)
        PhysicsContainer.instances.push(this)
    }

    start(): void {
        this.body.type = p2.Body.DYNAMIC
    }

    stop(): void {
        this.body.velocity = [0, 0]
        this.body.angularVelocity = 0
        this.body.type = p2.Body.STATIC
    }

    update(): void {
        if (this.body.type === p2.Body.STATIC) {
            this.body.position[0] = this.container.x
            this.body.position[1] = this.container.y
            this.body.angle = this.container.rotation
        } else {
            this.container.x = this.body.position[0]
            this.container.y = this.body.position[1]
            this.container.rotation = this.body.angle
        }
    }
}
