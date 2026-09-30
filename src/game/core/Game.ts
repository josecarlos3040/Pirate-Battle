import { Application } from "pixi.js";
import { InputManager } from "./InputManager";
import { Player } from "../entities/Player";

export class Game {
    private app: Application;

    private input: InputManager;
    private player: Player;

    constructor(app: Application) {
        this.app = app;

        this.input = new InputManager();
        this.player = new Player();

        this.player.container.position.set(
            app.screen.width / 2,
            app.screen.height / 2
        );

        app.stage.addChild(this.player.container);

        app.ticker.add(this.update);
    }

    private update = () => {
        const deltaTime =
            this.app.ticker.deltaMS / 1000;

        this.player.update(
            deltaTime,
            this.input.isPressed("KeyW"),
            this.input.isPressed("KeyA"),
            this.input.isPressed("KeyD")
        );
    };

    destroy() {
        this.app.ticker.remove(this.update);

        this.input.destroy();

        this.player.container.destroy({
            children: true,
        });
    }
}