import { PixiState } from "./pixi_state"
import { Container } from "pixi.js"
import { PlayState } from "./play_state"
import { Designer } from "../../designer"

export class TitleState extends PixiState {
    constructor(containers: Container[]) {
        super(containers)

        Designer.playButton.on("click", () => this.onClick())
    }

    private onClick(): void {
        this.nextStateName = PlayState.name
    }
}
