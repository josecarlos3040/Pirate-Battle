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

        // ===============================
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

        // ===============================
        // COOLDOWN
        // ===============================

        if (this.frontShootCooldown > 0) {
            this.frontShootCooldown -= deltaTime;
        }

        // ===============================
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

        // ===============================
        // PROJECTILES
        // ===============================

        for (const projectile of this.projectiles) {
            projectile.update(deltaTime);

            // Também mata se sair da tela
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

        // Remove as balas mortas
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

    // ===================================
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

    // ===================================
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