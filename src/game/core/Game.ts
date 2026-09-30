import type {
    Application,
    Texture
} from "pixi.js";

import { InputManager } from "./InputManager";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Chaser } from "../entities/Chaser";
import { Shooter } from "../entities/Shooter";

import { GAME_CONFIG } from "../config/gameConfig";

export class Game {
    private app: Application;

    private input: InputManager;
    private player: Player;

    private projectiles: Projectile[] = [];
    private chasers: Chaser[] = [];
    private shooters: Shooter[] = [];

    private score = 0;

    private frontShootCooldown = 0;
    private leftShootCooldown = 0;
    private rightShootCooldown = 0;

    private enemySpawnTimer = GAME_CONFIG.match.enemySpawnInterval;

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

        app.ticker.add(this.update);
    }

    // ===================================
    // UPDATE
    // ===================================

    private update = () => {
        const deltaTime =
            this.app.ticker.deltaMS / 1000;

        // ===================================
        // PLAYER
        // ===================================

        this.player.update(
            deltaTime,

            this.input.isPressed("KeyW"),
            this.input.isPressed("KeyA"),
            this.input.isPressed("KeyD"),

            this.app.screen.width,
            this.app.screen.height
        );

        // ===================================
        // CHASERS
        // ===================================

        for (const chaser of this.chasers) {
            chaser.update(
                deltaTime,
                this.player.container.x,
                this.player.container.y
            );
        }

        // SHOOTERS
        // ===================================

        for (const shooter of this.shooters) {
            const shouldShoot =
                shooter.update(
                    deltaTime,
                    this.player.container.x,
                    this.player.container.y
                );

            if (shouldShoot) {
                this.shooterFire(
                    shooter
                );
            }
        }

        // ===================================
        // COOLDOWNS
        // ===================================

        if (this.frontShootCooldown > 0) {
            this.frontShootCooldown -= deltaTime;
        }

        if (this.leftShootCooldown > 0) {
            this.leftShootCooldown -= deltaTime;
        }

        if (this.rightShootCooldown > 0) {
            this.rightShootCooldown -= deltaTime;
        }

        // ENEMY SPAWN
        // ===================================

        this.enemySpawnTimer -= deltaTime;

        if (this.enemySpawnTimer <= 0) {
            this.spawnEnemy();

            this.enemySpawnTimer =
                GAME_CONFIG.match.enemySpawnInterval;
        }

        // INPUT DE TIRO
        // ===================================

        if (
            this.input.isPressed("Space") &&
            this.frontShootCooldown <= 0
        ) {
            this.shootFront();

            this.frontShootCooldown =
                GAME_CONFIG.player
                    .frontWeapon
                    .cooldown;
        }

        // TIRO ESQUERDO

        if (
            this.input.isPressed("KeyQ") &&
            this.leftShootCooldown <= 0
        ) {
            this.shootSide("left");

            this.leftShootCooldown =
                GAME_CONFIG.player
                    .sideWeapon
                    .cooldown;
        }

        // TIRO DIREITO

        if (
            this.input.isPressed("KeyE") &&
            this.rightShootCooldown <= 0
        ) {
            this.shootSide("right");

            this.rightShootCooldown =
                GAME_CONFIG.player
                    .sideWeapon
                    .cooldown;
        }

        // ===================================
        // PROJECTILES
        // ===================================

        for (const projectile of this.projectiles) {
            projectile.update(deltaTime);

            // Destrói se sair da tela
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

        // ===================================
        // PROJECTILE x CHASER
        // ===================================

        for (const projectile of this.projectiles) {
            if (projectile.isDead) {
                continue;
            }

            if (projectile.owner !== "player") {
                continue;
            }

            for (const chaser of this.chasers) {
                if (chaser.isDead) {
                    continue;
                }

                const dx =
                    projectile.container.x -
                    chaser.container.x;

                const dy =
                    projectile.container.y -
                    chaser.container.y;

                const distanceSquared =
                    dx * dx + dy * dy;

                const collisionDistance =
                    projectile.radius +
                    chaser.collisionRadius;

                if (
                    distanceSquared <=
                    collisionDistance *
                        collisionDistance
                ) {
                    chaser.takeDamage(
                        projectile.damage
                    );

                    // Cada bala só causa dano uma vez
                    projectile.isDead = true;

                    if (chaser.isDead) {
                        this.score++;

                        console.log(
                            "SCORE:",
                            this.score
                        );
                    }

                    break;
                }
            }
        }

        // ===================================
        // CHASER x PLAYER
        // ===================================

        for (const chaser of this.chasers) {
            if (chaser.isDead) {
                continue;
            }

            const dx =
                chaser.container.x -
                this.player.container.x;

            const dy =
                chaser.container.y -
                this.player.container.y;

            const distanceSquared =
                dx * dx + dy * dy;

            const collisionDistance =
                chaser.collisionRadius +
                this.player.collisionRadius;

            if (
                distanceSquared <=
                collisionDistance *
                    collisionDistance
            ) {
                this.player.takeDamage(
                    GAME_CONFIG.chaser
                        .collisionDamage
                );

                // Chaser explode ao bater
                chaser.isDead = true;

                console.log(
                    "Chaser hit player"
                );
            }
        }

        // PROJECTILE x SHOOTER
        // ===================================

        for (const projectile of this.projectiles) {
            if (projectile.isDead) {
                continue;
            }

            if (
                projectile.owner !==
                "player"
            ) {
                continue;
            }

            for (
                const shooter
                of this.shooters
            ) {
                if (shooter.isDead) {
                    continue;
                }

                const dx =
                    projectile.container.x -
                    shooter.container.x;

                const dy =
                    projectile.container.y -
                    shooter.container.y;

                const distanceSquared =
                    dx * dx + dy * dy;

                const collisionDistance =
                    projectile.radius +
                    shooter.collisionRadius;

                if (
                    distanceSquared <=
                    collisionDistance *
                        collisionDistance
                ) {
                    shooter.takeDamage(
                        projectile.damage
                    );

                    projectile.isDead = true;

                    if (shooter.isDead) {
                        this.score++;

                        console.log(
                            "SCORE:",
                            this.score
                        );
                    }

                    break;
                }
            }
        }

        // ENEMY PROJECTILE x PLAYER
        // ===================================

        for (const projectile of this.projectiles) {
            if (projectile.isDead) {
                continue;
            }

            if (
                projectile.owner !==
                "enemy"
            ) {
                continue;
            }

            const dx =
                projectile.container.x -
                this.player.container.x;

            const dy =
                projectile.container.y -
                this.player.container.y;

            const distanceSquared =
                dx * dx + dy * dy;

            const collisionDistance =
                projectile.radius +
                this.player.collisionRadius;

            if (
                distanceSquared <=
                collisionDistance *
                    collisionDistance
            ) {
                this.player.takeDamage(
                    projectile.damage
                );

                projectile.isDead = true;

                console.log(
                    "Enemy projectile hit player"
                );
            }
        }

        // ===================================
        // REMOVE PROJECTILES
        // ===================================

        for (
            let i =
                this.projectiles.length - 1;
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

                this.projectiles.splice(
                    i,
                    1
                );
            }
        }

        // ===================================
        // REMOVE CHASERS
        // ===================================

        for (let i = this.chasers.length - 1; i >= 0; i--) {
            const chaser =
                this.chasers[i];

            if (chaser.isDead) {
                this.app.stage.removeChild(
                    chaser.container
                );

                chaser.destroy();

                this.chasers.splice(
                    i,
                    1
                );
            }
        }

        for (let i = this.shooters.length - 1; i >= 0; i--) {
            const shooter =
                this.shooters[i];

            if (shooter.isDead) {
                this.app.stage.removeChild(
                    shooter.container
                );

                shooter.destroy();

                this.shooters.splice(
                    i,
                    1
                );
            }
        }
    };

    // ===================================
    // SPAWN CHASER
    // ===================================

    private spawnChaser() {
        const position =
            this.getEnemySpawnPosition();

        const chaser = new Chaser(
            position.x,
            position.y
        );

        this.chasers.push(chaser);

        this.app.stage.addChild(
            chaser.container
        );

        console.log(
            "Enemy spawned:",
            position.x,
            position.y
        );
    }

    private spawnShooter() {
        const position =
            this.getEnemySpawnPosition();

        const shooter =
            new Shooter(
                position.x,
                position.y
            );

        this.shooters.push(
            shooter
        );

        this.app.stage.addChild(
            shooter.container
        );

        console.log(
            "Shooter spawned"
        );
    }

    private spawnEnemy() {
        const spawnShooter =
            Math.random() < 0.5;

        if (spawnShooter) {
            this.spawnShooter();
        } else {
            this.spawnChaser();
        }
    }

    private getEnemySpawnPosition() {
        const width =
            this.app.screen.width;

        const height =
            this.app.screen.height;

        const margin = 70;

        const minimumDistanceFromPlayer = GAME_CONFIG.match.minimumEnemySpawnDistance;

        // Tenta encontrar uma posição boa
        for (let attempt = 0; attempt < 20; attempt++) {

            const side =
                Math.floor(Math.random() * 4);

            let x = 0;
            let y = 0;

            switch (side) {
                // TOPO
                case 0:
                    x =
                        margin +
                        Math.random() *
                            (width - margin * 2);

                    y = margin;

                    break;

                // DIREITA
                case 1:
                    x = width - margin;

                    y =
                        margin +
                        Math.random() *
                            (height - margin * 2);

                    break;

                // BAIXO
                case 2:
                    x =
                        margin +
                        Math.random() *
                            (width - margin * 2);

                    y = height - margin;

                    break;

                // ESQUERDA
                default:
                    x = margin;

                    y =
                        margin +
                        Math.random() *
                            (height - margin * 2);

                    break;
            }

            const dx =
                x - this.player.container.x;

            const dy =
                y - this.player.container.y;

            const distance =
                Math.sqrt(
                    dx * dx + dy * dy
                );

            if (
                distance >=
                minimumDistanceFromPlayer
            ) {
                return {
                    x,
                    y
                };
            }
        }

        // Fallback caso as 20 tentativas falhem
        return {
            x: margin,
            y: margin
        };
    }

    // ===================================
    // FRONT CANNON
    // ===================================

    private shootFront() {
        // ISSO ESTAVA FALTANDO
        const rotation =
            this.player.container.rotation;

        const projectile =
            new Projectile(
                this.player.container.x +
                    Math.sin(rotation) * 55,

                this.player.container.y -
                    Math.cos(rotation) * 55,

                rotation,

                GAME_CONFIG.player
                    .frontWeapon
                    .projectileSpeed,

                GAME_CONFIG.player
                    .frontWeapon
                    .projectileLifetime,

                GAME_CONFIG.player
                    .frontWeapon
                    .damage,

                "player"
            );

        this.projectiles.push(
            projectile
        );

        this.app.stage.addChild(
            projectile.container
        );
    }

    // ===================================
    // SIDE CANNON
    // ===================================

    private shootSide(
        side: "left" | "right"
    ) {
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
                forwardX *
                    forwardOffset +
                rightX *
                    sideOffset *
                    sideDirection;

            const spawnY =
                this.player.container.y +
                forwardY *
                    forwardOffset +
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
                        .projectileLifetime,

                    GAME_CONFIG.player
                        .sideWeapon
                        .damage,

                    "player"
                );

            this.projectiles.push(
                projectile
            );

            this.app.stage.addChild(
                projectile.container
            );
        }
    }

    private shooterFire(shooter: Shooter) {
    const rotation =
        shooter.container.rotation;

    const spawnDistance = 45;

    const spawnX =
        shooter.container.x +
        Math.sin(rotation) *
            spawnDistance;

    const spawnY =
        shooter.container.y -
        Math.cos(rotation) *
            spawnDistance;

    const projectile =
        new Projectile(
            spawnX,
            spawnY,

            rotation,

            GAME_CONFIG.shooter
                .weapon
                .projectileSpeed,

            GAME_CONFIG.shooter
                .weapon
                .projectileLifetime,

            GAME_CONFIG.shooter
                .weapon
                .damage,

            "enemy"
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

        for (
            const chaser
            of this.chasers
        ) {
            chaser.destroy();
        }

        this.chasers = [];

        this.player.container.destroy({
            children: true
        });

        for (const shooter of this.shooters) {
            shooter.destroy();
        }

        this.shooters = [];
    }
}