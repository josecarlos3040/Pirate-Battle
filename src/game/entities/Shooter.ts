import {
    Container,
    Graphics
} from "pixi.js";

import { GAME_CONFIG } from "../config/gameConfig";

export class Shooter {
    public readonly container: Container;

    public readonly collisionRadius = 30;

    public health: number =
        GAME_CONFIG.shooter.maxHealth;

    public isDead = false;

    private speed =
        GAME_CONFIG.shooter.movementSpeed;

    private rotationSpeed =
        GAME_CONFIG.shooter.rotationSpeed;

    private shootCooldown = 0;

    constructor(
        x: number,
        y: number
    ) {
        this.container =
            new Container();

        const body =
            new Graphics();

        body
            .poly([
                0, -35,
                25, 25,
                0, 15,
                -25, 25
            ])
            .fill(0x4488ff);

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
    ): boolean {
        if (this.isDead) {
            return false;
        }

        const dx =
            playerX -
            this.container.x;

        const dy =
            playerY -
            this.container.y;

        const distance =
            Math.sqrt(
                dx * dx + dy * dy
            );

        // ===========================
        // ROTATE TO PLAYER
        // ===========================

        const targetRotation =
            Math.atan2(
                dx,
                -dy
            );

        let rotationDifference =
            targetRotation -
            this.container.rotation;

        rotationDifference =
            Math.atan2(
                Math.sin(
                    rotationDifference
                ),
                Math.cos(
                    rotationDifference
                )
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

        // ===========================
        // MOVEMENT
        // ===========================

        if (
            distance >
            GAME_CONFIG.shooter
                .attackRange
        ) {
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

        // ===========================
        // COOLDOWN
        // ===========================

        if (this.shootCooldown > 0) {
            this.shootCooldown -=
                deltaTime;
        }

        // ===========================
        // SHOOT
        // ===========================

        if (
            distance <=
                GAME_CONFIG.shooter
                    .attackRange &&
            this.shootCooldown <= 0
        ) {
            this.shootCooldown =
                GAME_CONFIG.shooter
                    .weapon
                    .cooldown;

            return true;
        }

        return false;
    }

    takeDamage(amount: number) {
        if (this.isDead) {
            return;
        }

        this.health -= amount;

        console.log(
            "Shooter HP:",
            this.health
        );

        if (this.health <= 0) {
            this.health = 0;
            this.isDead = true;
        }
    }

    destroy() {
        this.container.destroy({
            children: true
        });
    }
}