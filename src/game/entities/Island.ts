import {
    Container,
    Graphics
} from "pixi.js";

export class Island {
    public readonly container: Container;

    public readonly collisionRadius: number;

    constructor(
        x: number,
        y: number,
        radius: number
    ) {
        this.container = new Container();

        this.collisionRadius = radius;

        // Placeholder temporário
        const body = new Graphics();

        body
            .circle(
                0,
                0,
                radius
            )
            .fill(0xd9b46f);

        body
            .circle(
                0,
                0,
                radius * 0.75
            )
            .fill(0x5fa85f);

        this.container.addChild(body);

        this.container.position.set(
            x,
            y
        );
    }

    destroy() {
        this.container.destroy({
            children: true
        });
    }
}