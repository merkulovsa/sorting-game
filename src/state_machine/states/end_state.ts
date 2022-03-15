import { Container } from "pixi.js";
import { Designer } from "../../designer";
import { PixiState } from "./pixi_state";
import { TitleState } from "./title_state";

export class EndState extends PixiState {
    constructor(containers: Container[]) {
        super(containers)
        
        Designer.skipButton.on("pointerdown", () => this.onClick())
    }

    private onClick(): void {
        this.nextStateName = TitleState.name
    }
}
