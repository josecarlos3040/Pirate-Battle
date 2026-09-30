import { Container, Sprite, Texture } from "pixi.js";
import { GAME_CONFIG } from "../config/gameConfig";

export class Player {
    public readonly container: Container;

    private sprite: Sprite;

    private speed = GAME_CONFIG.player.movementSpeed;
    private rotationSpeed = GAME_CONFIG.player.rotationSpeed;

    constructor(texture: Texture) {
        this.container = new Container();

        this.sprite = new Sprite(texture);

        // Faz a origem ficar no centro do navio
        this.sprite.anchor.set(0.5);

        this.sprite.rotation = Math.PI;
        // Ajuste temporário do tamanho
        this.sprite.width = 70;
        this.sprite.height = 100;

        this.container.addChild(this.sprite);
    }

    update(
        deltaTime: number,
        forward: boolean,
        left: boolean,
        right: boolean,
        arenaWidth: number,
        arenaHeight: number
    ) {
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

        
        const margin = 40;

        this.container.x = Math.max(
            margin,
            Math.min(arenaWidth - margin, this.container.x)
        );

        this.container.y = Math.max(
            margin,
            Math.min(arenaHeight - margin, this.container.y)
        );
    }
}