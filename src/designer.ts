import { Container, Sprite, Text, TextStyle, Texture } from "pixi.js"

export namespace Designer {
    // TITLE SCREEN

    export const titleScreen: Container = new Container()

    export const playButton: Sprite = new Sprite()

    export const playText: Text = new Text("PRESS\nANYWHERE\nTO PLAY")

    // PLAY SCREEN

    export const playScreen: Container = new Container()

    export const buttonLeft: Sprite = new Sprite()

    export const buttonRight: Sprite = new Sprite()

    export const wallLeft: Sprite = new Sprite()

    export const wallRight: Sprite = new Sprite()

    export const wallCenter: Sprite = new Sprite()

    export const hood: Sprite = new Sprite()

    export const statsBg: Sprite = new Sprite()

    export const leftColor: Sprite = new Sprite()

    export const rightColor: Sprite = new Sprite()

    export const balanceText: Text = new Text("")

    // END SCREEN

    export const endScreen: Container = new Container()

    export const endText: Text = new Text("GAME ENDED!\nYOUR TIME IS:")

    export const timeText: Text = new Text("")

    export const skipButton: Sprite = new Sprite()

    export const hintText: Text = new Text("(PRESS\nANYWHERE\nTO SKIP)")

    export function init(): void {
        const scaleFactor: number = window.app.screen.width / 320

        window.app.stage.addChild(titleScreen)
        window.app.stage.addChild(playScreen)
        window.app.stage.addChild(endScreen)

        titleScreen.addChild(playText)
        titleScreen.addChild(playButton)

        playText.anchor.set(0.5)
        playText.x = window.app.screen.width / 2
        playText.y = window.app.screen.height / 2
        playText.scale.x = scaleFactor
        playText.scale.y = scaleFactor
        playText.style = new TextStyle({
            align: "center",
            fontFamily: "IBM 3270",
            fontSize: 36,
            fontStyle: "italic",
            fontWeight: "bold",
        })

        playButton.texture = Texture.WHITE
        playButton.anchor.set(0.5)
        playButton.width = window.app.screen.width
        playButton.height = window.app.screen.height
        playButton.x = window.app.screen.width / 2
        playButton.y = window.app.screen.height / 2
        playButton.alpha = 0
        playButton.interactive = true
        playButton.buttonMode = true

        playScreen.sortableChildren = true
        playScreen.addChild(buttonLeft)
        playScreen.addChild(buttonRight)
        playScreen.addChild(wallLeft)
        playScreen.addChild(wallCenter)
        playScreen.addChild(wallRight)
        playScreen.addChild(hood)
        playScreen.addChild(statsBg)
        playScreen.addChild(leftColor)
        playScreen.addChild(rightColor)
        playScreen.addChild(balanceText)

        buttonLeft.texture = Texture.WHITE
        buttonLeft.anchor.set(0.5)
        buttonLeft.width = window.app.screen.width / 2
        buttonLeft.height = window.app.screen.height
        buttonLeft.x = buttonLeft.width / 2
        buttonLeft.y = window.app.screen.height / 2
        buttonLeft.alpha = 0
        buttonLeft.interactive = true

        buttonRight.texture = Texture.WHITE
        buttonRight.anchor.set(0.5)
        buttonRight.width = window.app.screen.width / 2
        buttonRight.height = window.app.screen.height
        buttonRight.x = window.app.screen.width / 2 + buttonRight.width / 2
        buttonRight.y = window.app.screen.height / 2
        buttonRight.alpha = 0
        buttonRight.interactive = true

        wallLeft.texture = Texture.WHITE
        wallLeft.tint = 0x000000
        wallLeft.anchor.set(0.5)
        wallLeft.width = window.app.screen.width / 32
        wallLeft.height = window.app.screen.height
        wallLeft.x = wallLeft.width / 2
        wallLeft.y = window.app.screen.height / 2

        wallCenter.texture = Texture.WHITE
        wallCenter.tint = 0x000000
        wallCenter.anchor.set(0.5)
        wallCenter.width = window.app.screen.width / 32
        wallCenter.height = window.app.screen.height / 10
        wallCenter.x = window.app.screen.width / 2
        wallCenter.y = window.app.screen.height - wallCenter.height / 2

        wallRight.texture = Texture.WHITE
        wallRight.tint = 0x000000
        wallRight.anchor.set(0.5)
        wallRight.width = window.app.screen.width / 32
        wallRight.height = window.app.screen.height
        wallRight.x = window.app.screen.width - wallRight.width / 2
        wallRight.y = window.app.screen.height / 2

        hood.texture = Texture.WHITE
        hood.tint = 0x000000
        hood.anchor.set(0.5, 1)
        hood.width = window.app.screen.width / 32
        hood.x = window.app.screen.width / 2
        hood.y = window.app.screen.height - wallCenter.height

        statsBg.texture = Texture.WHITE
        statsBg.tint = 0x000000
        statsBg.anchor.set(0.5)
        statsBg.width = window.app.screen.width
        statsBg.height = window.app.screen.height / 10
        statsBg.x = window.app.screen.width / 2
        statsBg.y = window.app.screen.height - statsBg.height / 2
        statsBg.zIndex = 1

        leftColor.texture = window.loader.resources["./assets/sphere_white.png"].texture
        leftColor.anchor.set(0.5)
        leftColor.width = statsBg.height / 2
        leftColor.height = statsBg.height / 2
        leftColor.x = statsBg.x - statsBg.width * 1 / 4
        leftColor.y = statsBg.y
        leftColor.zIndex = 2

        rightColor.texture = window.loader.resources["./assets/sphere_white.png"].texture
        rightColor.anchor.set(0.5)
        rightColor.width = statsBg.height / 2
        rightColor.height = statsBg.height / 2
        rightColor.x = statsBg.x + statsBg.width * 1 / 4
        rightColor.y = statsBg.y
        rightColor.zIndex = 2

        balanceText.anchor.set(0.5)
        balanceText.x = statsBg.x
        balanceText.y = statsBg.y
        balanceText.scale.x = scaleFactor
        balanceText.scale.y = scaleFactor
        balanceText.style = new TextStyle({
            align: "center",
            fontFamily: "IBM 3270",
            fontSize: 36,
            fontWeight: "bold",
            fill: 0xFFFFFF,
        })
        balanceText.zIndex = 2

        endScreen.addChild(endText)
        endScreen.addChild(timeText)
        endScreen.addChild(skipButton)
        endScreen.addChild(hintText)

        endText.anchor.set(0.5)
        endText.x = window.app.screen.width * 1 / 2
        endText.y = window.app.screen.height * 1 / 3
        endText.scale.x = scaleFactor
        endText.scale.y  =scaleFactor
        endText.style = new TextStyle({
            align: "center",
            fontFamily: "IBM 3270",
            fontSize: 32,
            fontStyle: "italic",
            fontWeight: "bold",
        })

        timeText.anchor.set(0.5)
        timeText.x = window.app.screen.width * 1 / 2
        timeText.y = window.app.screen.height * 1 / 2
        timeText.scale.x = scaleFactor
        timeText.scale.y  =scaleFactor
        timeText.style = new TextStyle({
            align: "center",
            fontFamily: "IBM 3270",
            fontSize: 40,
            fontWeight: "bold",
        })

        hintText.anchor.set(0.5)
        hintText.x = window.app.screen.width * 1 / 2
        hintText.y = window.app.screen.height * 2 / 3
        hintText.scale.x = scaleFactor
        hintText.scale.y  =scaleFactor
        hintText.style = new TextStyle({
            align: "center",
            fontFamily: "IBM 3270",
            fontSize: 32,
            fontStyle: "italic",
            fontWeight: "bold",
        })

        skipButton.texture = Texture.WHITE
        skipButton.anchor.set(0.5)
        skipButton.width = window.app.screen.width
        skipButton.height = window.app.screen.height
        skipButton.x = window.app.screen.width * 1 / 2
        skipButton.y = window.app.screen.height * 1 / 2
        skipButton.alpha = 0
        skipButton.buttonMode = true
        skipButton.interactive = true
    }
}
