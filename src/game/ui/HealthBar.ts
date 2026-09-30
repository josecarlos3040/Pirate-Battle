import {
    Container,
    Graphics
} from "pixi.js";

export class HealthBar {
    public readonly container: Container;

    private background: Graphics;
    private fillBar: Graphics;

    private width: number;
    private height: number;

    constructor(
        width = 60,
        height = 8
    ) {
        this.container = new Container();

        this.width = width;
        this.height = height;

        this.background = new Graphics();
        this.fillBar = new Graphics();

        this.container.addChild(
            this.background
        );

        this.container.addChild(
            this.fillBar
        );

        this.update(1, 1);
    }

    update(
        currentHealth: number,
        maxHealth: number
    ) {
        const percentage = Math.max(
            0,
            Math.min(
                1,
                currentHealth / maxHealth
            )
        );

        // FUNDO
        this.background.clear();

        this.background
            .rect(
                -this.width / 2,
                -this.height / 2,
                this.width,
                this.height
            )
            .fill(0x222222);

        // VIDA
        this.fillBar.clear();

        this.fillBar
            .rect(
                -this.width / 2,
                -this.height / 2,
                this.width * percentage,
                this.height
            )
            .fill(0x44dd66);
    }
}