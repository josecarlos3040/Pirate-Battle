import {
    Application,
    Texture
} from "pixi.js";

import { InputManager } from "./InputManager";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { GAME_CONFIG } from "../config/gameConfig";

export class Game {
    private app: Application;

    private input: InputManager;
    private player: Player;

    private projectiles: Projectile[] = [];

    private frontShootCooldown = 0;
    private leftShootCooldown = 0;
    private rightShootCooldown = 0;

    constructor(
        app: Application,
        playerTexture: Texture
    ) {
        this.app = app;

        this.input = new InputManager();

        this.player = new Player(
            playerTexture
        );

        this.player.container.position.set(
            app.screen.width / 2,
            app.screen.height / 2
        );

        app.stage.addChild(
            this.player.container
        );

        app.ticker.add(this.update);
    }

    private update = () => {
        const deltaTime =
            this.app.ticker.deltaMS / 1000;


        // PLAYER
        // ===============================

        this.player.update(
            deltaTime,

            this.input.isPressed("KeyW"),
            this.input.isPressed("KeyA"),
            this.input.isPressed("KeyD"),

            this.app.screen.width,
            this.app.screen.height
        );


        // COOLDOWN
        // ===============================

        if (this.frontShootCooldown > 0) {
            this.frontShootCooldown -= deltaTime;
        }

        if (this.leftShootCooldown > 0) {
            this.leftShootCooldown -= deltaTime;
        }

        if (this.rightShootCooldown > 0) {
            this.rightShootCooldown -= deltaTime;
        }


        // TIRO
        // ===============================

        if (
            this.input.isPressed("Space") &&
            this.frontShootCooldown <= 0
        ) {
            this.shootFront();

            this.frontShootCooldown =
                GAME_CONFIG.player.frontWeapon.cooldown;
        }

        // TIRO LATERAL ESQUERDO
        if (
            this.input.isPressed("KeyQ") &&
            this.leftShootCooldown <= 0
        ) {
            this.shootSide("left");

            this.leftShootCooldown =
                GAME_CONFIG.player.sideWeapon.cooldown;
        }

        // TIRO LATERAL DIREITO
        if (
            this.input.isPressed("KeyE") &&
            this.rightShootCooldown <= 0
        ) {
            this.shootSide("right");

            this.rightShootCooldown =
                GAME_CONFIG.player.sideWeapon.cooldown;
        }


        // PROJECTILES
        // ===============================

        for (const projectile of this.projectiles) {
            projectile.update(deltaTime);

            // mata s sair da tela
            if (
                projectile.container.x < 0 ||
                projectile.container.x >
                    this.app.screen.width ||
                projectile.container.y < 0 ||
                projectile.container.y >
                    this.app.screen.height
            ) {
                projectile.isDead = true;
            }
        }

        // deleta as balas mortas
        for (
            let i = this.projectiles.length - 1;
            i >= 0;
            i--
        ) {
            const projectile =
                this.projectiles[i];

            if (projectile.isDead) {
                this.app.stage.removeChild(
                    projectile.container
                );

                projectile.destroy();

                this.projectiles.splice(i, 1);
            }
        }
    };


    // FRONT CANNON
    // ===================================

    private shootFront() {
        const projectile =
            new Projectile(
            this.player.container.x +
                Math.sin(this.player.container.rotation) * 55,

            this.player.container.y -
                Math.cos(this.player.container.rotation) * 55,

                this.player.container.rotation,

                GAME_CONFIG.player
                    .frontWeapon
                    .projectileSpeed,

                GAME_CONFIG.player
                    .frontWeapon
                    .projectileLifetime
            );

        this.projectiles.push(
            projectile
        );

        this.app.stage.addChild(
            projectile.container
        );
    }


        // SIDE CANNON
    // ===================================
    private shootSide(side: "left" | "right") {
        const shipRotation =
            this.player.container.rotation;

        const sideRotation =
            side === "left"
                ? shipRotation - Math.PI / 2
                : shipRotation + Math.PI / 2;

        // Frente do navio
        const forwardX =
            Math.sin(shipRotation);

        const forwardY =
            -Math.cos(shipRotation);

        // Direita do navio
        const rightX =
            Math.cos(shipRotation);

        const rightY =
            Math.sin(shipRotation);

        const sideDirection =
            side === "left" ? -1 : 1;

        const sideOffset = 40;

        // Quantidade de canhões vem da config
        const projectileCount =
            GAME_CONFIG.player
                .sideWeapon
                .projectileCount;

        const spacing = 30;

        const cannonPositions: number[] = [];

        for (
            let i = 0;
            i < projectileCount;
            i++
        ) {
            const centeredIndex =
                i -
                (projectileCount - 1) / 2;

            cannonPositions.push(
                centeredIndex * spacing
            );
        }

        for (
            const forwardOffset
            of cannonPositions
        ) {
            const spawnX =
                this.player.container.x +
                forwardX * forwardOffset +
                rightX *
                    sideOffset *
                    sideDirection;

            const spawnY =
                this.player.container.y +
                forwardY * forwardOffset +
                rightY *
                    sideOffset *
                    sideDirection;

            const projectile =
                new Projectile(
                    spawnX,
                    spawnY,
                    sideRotation,

                    GAME_CONFIG.player
                        .sideWeapon
                        .projectileSpeed,

                    GAME_CONFIG.player
                        .sideWeapon
                        .projectileLifetime
                );

            this.projectiles.push(
                projectile
            );

            this.app.stage.addChild(
                projectile.container
            );
        }
    }


    // DESTROY
    // ===================================

    destroy() {
        this.app.ticker.remove(
            this.update
        );

        this.input.destroy();

        for (
            const projectile
            of this.projectiles
        ) {
            projectile.destroy();
        }

        this.projectiles = [];

        this.player.container.destroy({
            children: true,
        });
    }
}