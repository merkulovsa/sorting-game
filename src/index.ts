import * as PIXI from "pixi.js"
import { PhysicsContainer } from "./physics_container"
import { Pool } from "./pool"

const p2 = require("p2")

const app: PIXI.Application = new PIXI.Application({ width: 320, height: 640, backgroundColor: 0x1099bb })
app.ticker.add(update)

const loader: PIXI.Loader = new PIXI.Loader()
loader.add("./assets/cube.png")
loader.add("./assets/sphere.png")
loader.onComplete.add(onLoaded)
loader.load()

document.body.appendChild(app.view)

function update(): void {
    PhysicsContainer.update()
}

function onLoaded(): void {
    const cubeTexture: PIXI.Texture = loader.resources["./assets/cube.png"].texture
    const sphereTexture: PIXI.Texture = loader.resources["./assets/sphere.png"].texture
    const spheresPool: Pool<PhysicsContainer> = new Pool(spawnSphere)
    
    const buttonLeft: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
    buttonLeft.alpha = 0
    buttonLeft.anchor.x = 0
    buttonLeft.anchor.y = 0
    buttonLeft.position.x = 0
    buttonLeft.position.y = 0
    buttonLeft.scale.x = app.screen.width / cubeTexture.width / 2
    buttonLeft.scale.y = app.screen.height / cubeTexture.height
    buttonLeft.buttonMode = true
    buttonLeft.interactive = true
    buttonLeft.on("pointerdown", onLeft)
    buttonLeft.on("pointerup", onRelease)
    app.stage.addChild(buttonLeft)
    
    const buttonRight: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
    buttonRight.alpha = 0
    buttonRight.anchor.x = 1
    buttonRight.anchor.y = 0
    buttonRight.position.x = app.screen.right
    buttonRight.position.y = 0
    buttonRight.scale.x = app.screen.width / cubeTexture.width / 2
    buttonRight.scale.y = app.screen.height / cubeTexture.height
    buttonRight.buttonMode = true
    buttonRight.interactive = true
    buttonRight.on("pointerdown", onRight)
    buttonRight.on("pointerup", onRelease)
    app.stage.addChild(buttonRight)
    
    const wallLeft: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
    wallLeft.anchor.set(0.5)
    wallLeft.scale.x = 0.5
    wallLeft.scale.y = 9
    wallLeft.position.x = wallLeft.width / 2
    wallLeft.position.y = app.screen.bottom - wallLeft.height / 2
    app.stage.addChild(wallLeft)
    const wallLeftBody: p2.Body = new p2.Body({
        type: p2.Body.STATIC,
        position: [wallLeft.x, wallLeft.y]
    })
    wallLeftBody.addShape(
        new p2.Box({width: wallLeft.width, height: wallLeft.height}),
    )
    new PhysicsContainer(wallLeft, wallLeftBody)
    
    const wallCenter: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
    wallCenter.anchor.set(0.5)
    wallCenter.scale.x = 0.5
    wallCenter.scale.y = 6
    wallCenter.position.x = app.screen.width / 2
    wallCenter.position.y = app.screen.bottom - wallCenter.height / 2
    app.stage.addChild(wallCenter)
    const wallCenterBody: p2.Body = new p2.Body({
        type: p2.Body.STATIC,
        position: [wallCenter.x, wallCenter.y]
    })
    wallCenterBody.addShape(
        new p2.Box({width: wallCenter.width, height: wallCenter.height}),
    )
    new PhysicsContainer(wallCenter, wallCenterBody)
    
    const wallRight: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
    wallRight.anchor.set(0.5)
    wallRight.scale.x = 0.5
    wallRight.scale.y = 9
    wallRight.position.x = app.screen.right - wallRight.width / 2
    wallRight.position.y = app.screen.bottom - wallRight.height / 2
    app.stage.addChild(wallRight)
    const wallRightBody: p2.Body = new p2.Body({
        type: p2.Body.STATIC,
        position: [wallRight.x, wallRight.y]
    })
    wallRightBody.addShape(
        new p2.Box({width: wallRight.width, height: wallRight.height}),
    )
    new PhysicsContainer(wallRight, wallRightBody)
    
    const cap: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
    cap.anchor.set(0.5)
    cap.scale.x = 0.5
    cap.scale.y = 6
    cap.position.x = app.screen.width / 2
    cap.position.y = app.screen.bottom - wallCenter.height - cap.height / 2
    app.stage.addChild(cap)
    const capBody: p2.Body = new p2.Body({
        type: p2.STATIC,
        position: [cap.x, cap.y]
    })
    capBody.addShape(
        new p2.Box({width: cap.width, height: cap.height}),
    )
    new PhysicsContainer(cap, capBody)

    let time: number = Date.now()

    app.ticker.add(
        () => {
            const now: number = Date.now()

            if (now - time > 1e3) {
                spheresPool.get().start()
                time = now
            }
        }
    )

    function spawnSphere(): PhysicsContainer {
        const container: PIXI.Sprite = PIXI.Sprite.from(sphereTexture)
        container.anchor.set(0.5)
        app.stage.addChild(container)
        const body: p2.Body = new p2.Body({
            type: p2.Body.DYNAMIC,
            mass: 1,
            position: [app.screen.width * Math.random(), app.screen.top],
        })
        body.addShape(
            new p2.Circle({radius: container.width / 2}),
        )
    
        return new PhysicsContainer(container, body)
    }
    
    function onLeft(): void {
        cap.rotation = -Math.PI * 1 / 3
    }
    
    function onRight(): void {
        cap.rotation = Math.PI * 1 / 3
    }
    
    function onRelease(): void {
        cap.rotation = 0
    }
}
