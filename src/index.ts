import { Application, Loader } from "pixi.js"
import { Designer } from "./designer"
import { EndState } from "./state_machine/states/end_state"
import { PlayState } from "./state_machine/states/play_state"
import { TitleState } from "./state_machine/states/title_state"
import { StateMachine } from "./state_machine/state_machine"
import { PhysicsContainer } from "./utils/physics_container"

declare global {
    interface Window {
        app: Application
        loader: Loader
    }
}

window.app = new Application({ width: window.innerWidth, height: window.innerHeight, backgroundColor: 0x1099bb })

window.loader = new Loader()
window.loader.add("./assets/sphere_white.png")
window.loader.onComplete.add(start)
window.loader.load()

document.body.appendChild(window.app.view)

function start(): void {
    Designer.init()

    const stateMachine: StateMachine = new StateMachine(
        new TitleState([Designer.titleScreen]),
        new PlayState([Designer.playScreen]),
        new EndState([Designer.endScreen]),
    )
    stateMachine.change(TitleState.name)

    function update(): void {
        stateMachine.update()
        PhysicsContainer.update()
    }

    window.app.ticker.add(update)
}
