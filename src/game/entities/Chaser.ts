import {
    Container,
    Graphics
} from "pixi.js";

import { GAME_CONFIG } from "../config/gameConfig";

export class Chaser {
    public readonly container: Container;

    public readonly collisionRadius = 30;

    public health: number = GAME_CONFIG.chaser.maxHealth;

    public isDead = false;

    private speed = GAME_CONFIG.chaser.movementSpeed;

    private rotationSpeed = GAME_CONFIG.chaser.rotationSpeed;

    constructor(
        x: number,
        y: number
    ) {
        this.container = new Container();

        // Placeholder temporário do navio inimigo
        const body = new Graphics();

        body
            .poly([
                0, -35,
                25, 25,
                0, 15,
                -25, 25,
            ])
            .fill(0xff4444);

        this.container.addChild(body);

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

        console.log(
            "Chaser HP:",
            this.health
        );

        if (this.health <= 0) {
            this.isDead = true;
        }
    }

    destroy() {
        this.container.destroy({
            children: true,
        });
    }
}