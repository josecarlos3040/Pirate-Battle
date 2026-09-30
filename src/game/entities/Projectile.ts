import { Container, Graphics } from "pixi.js";

export type ProjectileOwner =
    "player" | "enemy";

export class Projectile {
    public readonly container: Container;

    public readonly damage: number;
    public readonly radius = 7;

    public readonly owner: ProjectileOwner;

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
        damage: number,
        owner: ProjectileOwner
    ) {
        this.container = new Container();

        const ball = new Graphics();

        ball
            .circle(0, 0, this.radius)
            .fill(
                owner === "player"
                    ? 0x222222
                    : 0xff4444
            );

        this.container.addChild(ball);

        this.container.position.set(
            x,
            y
        );

        this.directionX =
            Math.sin(rotation);

        this.directionY =
            -Math.cos(rotation);

        this.speed = speed;
        this.lifetime = lifetime;
        this.damage = damage;
        this.owner = owner;
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
            children: true
        });
    }
}