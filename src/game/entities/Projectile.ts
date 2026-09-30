import { Container, Graphics } from "pixi.js";

export class Projectile {
    public readonly container: Container;

    public readonly damage: number;
    public readonly radius = 7;

    private speed: number;
    private lifetime: number;

    private directionX: number;
    private directionY: number;

    public isDead = false;

    constructor(
        x: number,
        y: number,
        rotation: number,
        speed: number,
        lifetime: number,
        damage: number
    ) {
        this.container = new Container();

        const ball = new Graphics();

        ball
            .circle(0, 0, this.radius)
            .fill(0x222222);

        this.container.addChild(ball);

        this.container.position.set(x, y);

        this.directionX = Math.sin(rotation);
        this.directionY = -Math.cos(rotation);

        this.speed = speed;
        this.lifetime = lifetime;

        this.damage = damage;
    }

    update(deltaTime: number) {
        this.container.x +=
            this.directionX *
            this.speed *
            deltaTime;

        this.container.y +=
            this.directionY *
            this.speed *
            deltaTime;

        this.lifetime -= deltaTime;

        if (this.lifetime <= 0) {
            this.isDead = true;
        }
    }

    destroy() {
        this.container.destroy({
            children: true,
        });
    }
}