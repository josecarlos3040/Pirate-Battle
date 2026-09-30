import { Container, Sprite } from "pixi.js";
import type { Texture } from "pixi.js";

import { GAME_CONFIG } from "../config/gameConfig";
import { HealthBar } from "../ui/HealthBar";

export class Player {
    public readonly container: Container;

    public readonly collisionRadius = 30;

    public health: number = GAME_CONFIG.player.maxHealth;
        private healthBar: HealthBar;

    public isDead = false;

    private sprite: Sprite;


    private speed = GAME_CONFIG.player.movementSpeed;
    private rotationSpeed = GAME_CONFIG.player.rotationSpeed;

    constructor(texture: Texture) {
        this.container = new Container();

        this.sprite = new Sprite(texture);

        this.sprite.anchor.set(0.5);

        // Seu sprite estava invertido, então mantemos isso
        this.sprite.rotation = Math.PI;

        this.sprite.width = 70;
        this.sprite.height = 100;

        this.container.addChild(this.sprite);

        this.healthBar = new HealthBar(70, 8);

        this.healthBar.container.position.set(
            0,
            -60
        );

        this.container.addChild(
            this.healthBar.container
        );

        this.healthBar.update(
            this.health,
            GAME_CONFIG.player.maxHealth
        );
    }

    update(
        deltaTime: number,
        forward: boolean,
        left: boolean,
        right: boolean,
        arenaWidth: number,
        arenaHeight: number
    ) {
        if (this.isDead) {
            return;
        }

        // ROTACIONAR
        if (left) {
            this.container.rotation -=
                this.rotationSpeed * deltaTime;
        }

        if (right) {
            this.container.rotation +=
                this.rotationSpeed * deltaTime;
        }

        // MOVIMENTAR
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

        // LIMITES DA TELA
        const margin = 40;

        this.container.x = Math.max(
            margin,
            Math.min(
                arenaWidth - margin,
                this.container.x
            )
        );

        this.container.y = Math.max(
            margin,
            Math.min(
                arenaHeight - margin,
                this.container.y
            )
        );
    }

takeDamage(amount: number) {
    if (this.isDead) {
        return;
    }

    this.health -= amount;

    this.healthBar.update(
        this.health,
        GAME_CONFIG.player.maxHealth
    );

    console.log(
        "Player HP:",
        this.health
    );

    if (this.health <= 0) {
        this.health = 0;

        this.healthBar.update(
            this.health,
            GAME_CONFIG.player.maxHealth
        );

        this.isDead = true;

        console.log("PLAYER DEAD");
    }
}
}