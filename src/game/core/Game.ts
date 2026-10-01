import type {
    Application
} from "pixi.js";

import { InputManager } from "./InputManager";
import { Player } from "../entities/Player";
import { Projectile } from "../entities/Projectile";
import { Chaser } from "../entities/Chaser";
import { Shooter } from "../entities/Shooter";
import { Island } from "../entities/Island";

import { Hud } from "../ui/Hud";
import type { GameAssets } from "./GameAssets";

import { GAME_CONFIG } from "../config/gameConfig";


export type GameEndReason =
    "time" | "death";

export type GameResult = {
    score: number;
    timePlayed: number;
    reason: GameEndReason;
};

export class Game {
    private app: Application;

    private input: InputManager;
    private player: Player;
    private assets: GameAssets;

    private projectiles: Projectile[] = [];
    private chasers: Chaser[] = [];
    private shooters: Shooter[] = [];
    private islands: Island[] = [];

    private score = 0;
    private hud: Hud;

    private isGameOver = false;
    private isPaused = false;

    private onGameOver: (
        result: GameResult
    ) => void;

    private onPauseChange: (
        paused: boolean
    ) => void;

    private remainingTime: number =
        GAME_CONFIG.match.duration;



    private frontShootCooldown = 0;
    private leftShootCooldown = 0;
    private rightShootCooldown = 0;

    private enemySpawnTimer = GAME_CONFIG.match.enemySpawnInterval;

    constructor(
        app: Application,
        assets: GameAssets,

        
        onGameOver: (
            result: GameResult
        ) => void,

        onPauseChange: (
            paused: boolean
        ) => void
    ) {
        this.app = app;

        this.onGameOver =
            onGameOver;

        this.onPauseChange =
            onPauseChange;

        this.app.stage.sortableChildren = true;
        
        this.assets = assets;

        this.input = new InputManager();

        this.player = new Player(
            assets.playerShip
        );
        this.player.container.zIndex = 10;

        this.player.container.position.set(
            app.screen.width / 2,
            app.screen.height / 2
        );

        app.stage.addChild(
            this.player.container
        );
        this.createIslands();

        this.hud = new Hud();

        this.hud.container.zIndex = 100;

        this.app.stage.addChild(
            this.hud.container
        );

        window.addEventListener(
            "keydown",
            this.handlePauseKey
        );

        window.addEventListener(
            "blur",
            this.handleWindowBlur
        );

        document.addEventListener(
            "visibilitychange",
            this.handleVisibilityChange
        );

        app.ticker.add(this.update);

    }

    // ===================================
    // UPDATE
    // ===================================

    private update = () => {
        const deltaTime =
            this.app.ticker.deltaMS / 1000;

        if (this.isGameOver) {
            return;
        }
        if (this.isPaused) {
            return;
        }

        this.remainingTime -= deltaTime;

        if (this.remainingTime <= 0) {
            this.remainingTime = 0;

            this.endGame("time");

            return;
        }
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

        // PROJECTILE x ISLAND
        // ===================================

        for (const projectile of this.projectiles) {
            if (projectile.isDead) {
                continue;
            }

            for (const island of this.islands) {
                const dx =
                    projectile.container.x -
                    island.container.x;

                const dy =
                    projectile.container.y -
                    island.container.y;

                const collisionDistance =
                    projectile.radius +
                    island.collisionRadius;

                const distanceSquared =
                    dx * dx + dy * dy;

                if (
                    distanceSquared <=
                    collisionDistance *
                        collisionDistance
                ) {
                    projectile.isDead = true;

                    break;
                }
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

        // CHASER x ISLAND
        // ===================================
        for (const chaser of this.chasers) {
            if (chaser.isDead) {
                continue;
            }

            for (const island of this.islands) {
                const correctedPosition =
                    this.resolveIslandCollision(
                        chaser.container.x,
                        chaser.container.y,
                        chaser.collisionRadius,
                        island
                    );

                if (correctedPosition) {
                    chaser.container.position.set(
                        correctedPosition.x,
                        correctedPosition.y
                    );
                }
            }
        }

        // SHOOTER x ISLAND
        // ===================================
        for (const shooter of this.shooters) {
            if (shooter.isDead) {
                continue;
            }

            for (const island of this.islands) {
                const correctedPosition =
                    this.resolveIslandCollision(
                        shooter.container.x,
                        shooter.container.y,
                        shooter.collisionRadius,
                        island
                    );

                if (correctedPosition) {
                    shooter.container.position.set(
                        correctedPosition.x,
                        correctedPosition.y
                    );
                }
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

        // CHECK PLAYER DEATH
        // ===================================

        if (this.player.isDead) {
            this.endGame("death");

            return;
        }
        // PLAYER x ISLAND
        // ===================================

        for (const island of this.islands) {
            const correctedPosition =
                this.resolveIslandCollision(
                    this.player.container.x,
                    this.player.container.y,
                    this.player.collisionRadius,
                    island
                );

            if (correctedPosition) {
                this.player.container.position.set(
                    correctedPosition.x,
                    correctedPosition.y
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
        // HUD
        // ===================================

        this.hud.update(
            this.score,
            this.player.health,
            GAME_CONFIG.player.maxHealth,
            this.remainingTime,
            this.app.screen.width
        );
    };

    // ===================================
    // SPAWN CHASER
    // ===================================

    private spawnChaser() {
        const position =
            this.getEnemySpawnPosition();

        const chaser = new Chaser(
            position.x,
            position.y,
            this.assets.chaserShip
        );

        chaser.container.zIndex = 10;

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
                position.y,
                this.assets.shooterShip
            );

        shooter.container.zIndex = 10;
        
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

                "player",
                this.assets.cannonball
            );

        projectile.container.zIndex = 20;

        this.projectiles.push(projectile);

        this.app.stage.addChild(projectile.container);
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

                    "player",
                    this.assets.cannonball

                );

            projectile.container.zIndex = 20;

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

            "enemy",
            this.assets.cannonball
        );

        projectile.container.zIndex = 20;

        this.projectiles.push(
            projectile
        );

        this.app.stage.addChild(
            projectile.container
        );
    }

    private createIslands() {
        const island = new Island(
            this.app.screen.width * 0.65,
            this.app.screen.height * 0.5,
            90
        );

        // Ilha fica abaixo dos navios
        island.container.zIndex = 5;

        this.islands.push(island);

        this.app.stage.addChild(
            island.container
        );
    }
    
    private resolveIslandCollision(
        objectX: number,
        objectY: number,
        objectRadius: number,
        island: Island
    ) {
        const dx =
            objectX -
            island.container.x;

        const dy =
            objectY -
            island.container.y;

        const distanceSquared =
            dx * dx + dy * dy;

        const minimumDistance =
            objectRadius +
            island.collisionRadius;

        if (
            distanceSquared >=
            minimumDistance *
                minimumDistance
        ) {
            return null;
        }

        const distance =
            Math.sqrt(
                distanceSquared
            );

        // Caso extremamente raro de estarem
        // exatamente na mesma posição
        if (distance === 0) {
            return {
                x:
                    island.container.x +
                    minimumDistance,

                y:
                    island.container.y
            };
        }

        const normalX =
            dx / distance;

        const normalY =
            dy / distance;

        return {
            x:
                island.container.x +
                normalX *
                    minimumDistance,

            y:
                island.container.y +
                normalY *
                    minimumDistance
        };
    }


    private endGame(
        reason: GameEndReason
    ) {
        if (this.isGameOver) {
            return;
        }

        this.isGameOver = true;

        const timePlayed =
            GAME_CONFIG.match.duration -
            this.remainingTime;

        console.log(
            "GAME OVER",
            reason,
            this.score
        );

        this.onGameOver({
            score: this.score,
            timePlayed,
            reason
        });
    }

    public setPaused(paused: boolean) 
    {
        if (this.isGameOver) {
            return;
        }

        if (
            this.isPaused === paused
        ) {
            return;
        }

        this.isPaused = paused;

        // Evita tecla presa
        this.input.clear();

        this.onPauseChange(
            this.isPaused
        );
    }

    private handlePauseKey = (event: KeyboardEvent) => 
    {
        if (event.code !== "Escape") {
            return;
        }

        if (event.repeat) {
            return;
        }

        if (this.isGameOver) {
            return;
        }

        this.setPaused(
            !this.isPaused
        );
    };

    private handleWindowBlur = () => {
        if (this.isGameOver) {
            return;
        }

        this.setPaused(true);
    };

    private handleVisibilityChange = () => {
        if (
            document.hidden &&
            !this.isGameOver
        ) {
            this.setPaused(true);
        }
    };
    // ===================================
    // DESTROY
    // ===================================

    destroy() {
        this.app.ticker.remove(
            this.update
        );

        window.removeEventListener(
            "keydown",
            this.handlePauseKey
        );

        window.removeEventListener(
            "blur",
            this.handleWindowBlur
        );

        document.removeEventListener(
            "visibilitychange",
            this.handleVisibilityChange
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

        for (const island of this.islands) {
            island.destroy();
        }

        this.hud.container.destroy({
            children: true
        });

        this.islands = [];

        
    }
}