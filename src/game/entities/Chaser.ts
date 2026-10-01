import {
    Container,
    Sprite
} from "pixi.js";

import type {
    Texture
} from "pixi.js";


import { GAME_CONFIG } from "../config/gameConfig";
import { HealthBar } from "../ui/HealthBar";

export class Chaser {
    public readonly container: Container;

    public readonly collisionRadius = 30;

    public health: number = GAME_CONFIG.chaser.maxHealth;
    private healthBar: HealthBar;

    public isDead = false;

    private speed = GAME_CONFIG.chaser.movementSpeed;

    private rotationSpeed = GAME_CONFIG.chaser.rotationSpeed;

    constructor(
        x: number,
        y: number,
        texture: Texture
    ) {
        this.container =
            new Container();

        const sprite =
            new Sprite(texture);

        sprite.anchor.set(0.5);

        sprite.width = 65;
        sprite.height = 90;

        // Se vier invertido:
        sprite.rotation = Math.PI;

        this.container.addChild(
            sprite
        );

        this.healthBar =
            new HealthBar(55, 6);

        this.healthBar.container.position.set(
            0,
            -55
        );

        this.container.addChild(
            this.healthBar.container
        );

        this.healthBar.update(
            this.health,
            GAME_CONFIG.chaser.maxHealth
        );

        this.container.position.set(
            x,
            y
        );
    }

    update(
        deltaTime: number,
        playerX: number,
        playerY: number
    ) {
        if (this.isDead) {
            return;
        }

        const dx =
            playerX -
            this.container.x;

        const dy =
            playerY -
            this.container.y;

        // Como nosso "forward" usa
        // sin(rotation), -cos(rotation),
        // esse é o ângulo correto
        const targetRotation =
            Math.atan2(dx, -dy);

        let rotationDifference =
            targetRotation -
            this.container.rotation;

        // Mantém diferença entre -PI e +PI
        rotationDifference =
            Math.atan2(
                Math.sin(rotationDifference),
                Math.cos(rotationDifference)
            );

        const maxRotation =
            this.rotationSpeed *
            deltaTime;

        rotationDifference =
            Math.max(
                -maxRotation,
                Math.min(
                    maxRotation,
                    rotationDifference
                )
            );

        this.container.rotation +=
            rotationDifference;

        // Anda para frente
        this.container.x +=
            Math.sin(
                this.container.rotation
            ) *
            this.speed *
            deltaTime;

        this.container.y -=
            Math.cos(
                this.container.rotation
            ) *
            this.speed *
            deltaTime;
    }

    takeDamage(amount: number) {
        if (this.isDead) {
            return;
        }

        this.health -= amount;

        this.healthBar.update(
            this.health,
            GAME_CONFIG.chaser.maxHealth
        );

        console.log(
            "Chaser HP:",
            this.health
        );

        if (this.health <= 0) {
            this.health = 0;

            this.healthBar.update(
                0,
                GAME_CONFIG.chaser.maxHealth
            );

            this.isDead = true;
        }
    }

    destroy() {
        this.container.destroy({
            children: true,
        });
    }
}