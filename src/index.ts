import * as PIXI from "pixi.js"
import { Pool } from "./pool"

const app: PIXI.Application = new PIXI.Application({ width: 320, height: 640, backgroundColor: 0x1099bb })
app.ticker.add(update)

document.body.appendChild(app.view)

const cubeTexture: PIXI.Texture = PIXI.Texture.from("./assets/cube.jpg")
const CUBE_SIZE: number = 32

const buttonLeft: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
buttonLeft.alpha = 0
buttonLeft.anchor.x = 0
buttonLeft.anchor.y = 0
buttonLeft.position.x = 0
buttonLeft.position.y = 0
buttonLeft.scale.x = app.screen.width / CUBE_SIZE / 2
buttonLeft.scale.y = app.screen.height / CUBE_SIZE
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
buttonRight.scale.x = app.screen.width / CUBE_SIZE / 2
buttonRight.scale.y = app.screen.height / CUBE_SIZE
buttonRight.buttonMode = true
buttonRight.interactive = true
buttonRight.on("pointerdown", onRight)
buttonRight.on("pointerup", onRelease)
app.stage.addChild(buttonRight)

const wallLeft: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
wallLeft.anchor.x = 0
wallLeft.anchor.y = 1
wallLeft.scale.x = 0.5
wallLeft.scale.y = 9
wallLeft.position.x = 0
wallLeft.position.y = app.screen.bottom
app.stage.addChild(wallLeft)

const wallCenter: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
wallCenter.anchor.x = 0.5
wallCenter.anchor.y = 1
wallCenter.scale.x = 0.5
wallCenter.scale.y = 6
wallCenter.position.x = app.screen.width / 2
wallCenter.position.y = app.screen.bottom
app.stage.addChild(wallCenter)

const wallRight: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
wallRight.anchor.x = 1
wallRight.anchor.y = 1
wallRight.scale.x = 0.5
wallRight.scale.y = 9
wallRight.position.x = app.screen.right
wallRight.position.y = app.screen.bottom
app.stage.addChild(wallRight)

const cap: PIXI.Sprite = PIXI.Sprite.from(cubeTexture)
cap.anchor.x = 0.5
cap.anchor.y = 1
cap.scale.x = 0.5
cap.scale.y = 6
cap.position.x = app.screen.width / 2
cap.position.y = app.screen.bottom - 32 * 6
app.stage.addChild(cap)

function update(): void {
    
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
