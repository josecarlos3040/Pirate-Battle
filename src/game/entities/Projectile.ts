import {
    Container,
    Sprite
} from "pixi.js";

import type {
    Texture
} from "pixi.js";

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
        owner: ProjectileOwner,
        texture: Texture
    ) {
        this.container = new Container();

        // POSIÇÃO INICIAL DO TIRO
        this.container.position.set(
            x,
            y
        );

        const sprite =
            new Sprite(texture);

        sprite.anchor.set(0.5);

        sprite.width = 14;
        sprite.height = 14;

        this.container.addChild(
            sprite
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