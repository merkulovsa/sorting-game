import { Container, Sprite, Text, TextStyle } from "pixi.js"

export namespace Designer {
    export const titleScreen: Container = new Container()

    export const playButton: Sprite = new Sprite()

    export const playText: Text = new Text("PRESS\nANYWHERE\nTO PLAY")

    export const playScreen: Container = new Container()

    export const buttonLeft: Sprite = new Sprite()

    export const buttonRight: Sprite = new Sprite()

    export const wallLeft: Sprite = new Sprite()

    export const wallRight: Sprite = new Sprite()

    export const wallCenter: Sprite = new Sprite()

    export const shoulder: Sprite = new Sprite()

    export const hood: Sprite = new Sprite()

    export function init(): void {
        window.app.stage.addChild(titleScreen)
        window.app.stage.addChild(playScreen)

        titleScreen.addChild(playText)
        titleScreen.addChild(playButton)

        playText.anchor.set(0.5)
        playText.x = window.app.screen.width / 2
        playText.y = window.app.screen.height / 2
        playText.style = new TextStyle({
            align: "center",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: "bold",
            fill: ['#ffffff', '#00ff99'],

        })

        playButton.texture = window.loader.resources["./assets/cube_black.png"].texture
        playButton.anchor.set(0.5)
        playButton.width = window.app.screen.width
        playButton.height = window.app.screen.height
        playButton.x = window.app.screen.width / 2
        playButton.y = window.app.screen.height / 2
        playButton.alpha = 0
        playButton.interactive = true
        playButton.buttonMode = true

        playScreen.addChild(buttonLeft)
        playScreen.addChild(buttonRight)
        playScreen.addChild(wallLeft)
        playScreen.addChild(wallCenter)
        playScreen.addChild(wallRight)
        playScreen.addChild(shoulder)

        buttonLeft.texture = window.loader.resources["./assets/cube_black.png"].texture
        buttonLeft.anchor.set(0.5)
        buttonLeft.width = window.app.screen.width / 2
        buttonLeft.height = window.app.screen.height
        buttonLeft.x = buttonLeft.width / 2
        buttonLeft.y = window.app.screen.height / 2
        buttonLeft.alpha = 0
        buttonLeft.interactive = true

        buttonRight.texture = window.loader.resources["./assets/cube_black.png"].texture
        buttonRight.anchor.set(0.5)
        buttonRight.width = window.app.screen.width / 2
        buttonRight.height = window.app.screen.height
        buttonRight.x = window.app.screen.width / 2 + buttonRight.width / 2
        buttonRight.y = window.app.screen.height / 2
        buttonRight.alpha = 0
        buttonRight.interactive = true

        wallLeft.texture = window.loader.resources["./assets/cube_black.png"].texture
        wallLeft.anchor.set(0.5)
        wallLeft.width = 10
        wallLeft.height = window.app.screen.height
        wallLeft.x = wallLeft.width / 2
        wallLeft.y = window.app.screen.height / 2

        wallCenter.texture = window.loader.resources["./assets/cube_black.png"].texture
        wallCenter.anchor.set(0.5)
        wallCenter.width = 10
        wallCenter.height = window.app.screen.height / 4
        wallCenter.x = window.app.screen.width / 2
        wallCenter.y = window.app.screen.height - wallCenter.height / 2

        wallRight.texture = window.loader.resources["./assets/cube_black.png"].texture
        wallRight.anchor.set(0.5)
        wallRight.width = 10
        wallRight.height = window.app.screen.height
        wallRight.x = window.app.screen.width - wallRight.width / 2
        wallRight.y = window.app.screen.height / 2

        shoulder.texture = window.loader.resources["./assets/sphere_black.png"].texture
        shoulder.anchor.set(0.5)
        shoulder.x = window.app.screen.width / 2
        shoulder.y = window.app.screen.height * 3 / 4
        shoulder.addChild(hood)

        hood.texture = window.loader.resources["./assets/cube_black.png"].texture
        hood.anchor.set(0.5)
        hood.width = 10
        hood.height = window.app.screen.height * 0.4
        hood.x = 0
        hood.y = -hood.height / 2
    }
}
