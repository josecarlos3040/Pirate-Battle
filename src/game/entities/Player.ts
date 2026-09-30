import { Graphics, Container } from "pixi.js";

export class Player {
    public readonly container: Container;

    private speed = 250;
    private rotationSpeed = 2.5;

    constructor() {
        this.container = new Container();

        const placeholder = new Graphics();

        placeholder
            .poly([
                0, -30,
                20, 25,
                0, 15,
                -20, 25,
            ])
            .fill(0xffffff);

        this.container.addChild(placeholder);
    }

    update(
        deltaTime: number,
        forward: boolean,
        left: boolean,
        right: boolean
    ) {
        if (left) {
            this.container.rotation -=
                this.rotationSpeed * deltaTime;
        }

        if (right) {
            this.container.rotation +=
                this.rotationSpeed * deltaTime;
        }

        if (forward) {
            this.container.x +=
                Math.sin(this.container.rotation) *
                this.speed *
                deltaTime;

            this.container.y -=
                Math.cos(this.container.rotation) *
                this.speed *
                deltaTime;
        }
    }
}