import {
    Container,
    Text
} from "pixi.js";

export class Hud {
    public readonly container: Container;

    private scoreText: Text;
    private healthText: Text;
    private timeText: Text;

    constructor() {
        this.container =
            new Container();

        const textStyle = {
            fontFamily: "Arial",
            fontSize: 24,
            fill: 0xffffff,
            fontWeight: "bold" as const,
        };

        this.scoreText =
            new Text({
                text: "SCORE: 0",
                style: textStyle
            });

        this.healthText =
            new Text({
                text: "HP: 100 / 100",
                style: textStyle
            });

        this.timeText =
            new Text({
                text: "TIME: 02:00",
                style: textStyle
            });

        this.scoreText.position.set(
            20,
            20
        );

        this.healthText.position.set(
            20,
            55
        );

        // O x será atualizado
        // de acordo com a tela
        this.timeText.anchor.set(
            1,
            0
        );

        this.container.addChild(
            this.scoreText
        );

        this.container.addChild(
            this.healthText
        );

        this.container.addChild(
            this.timeText
        );
    }

    update(
        score: number,
        health: number,
        maxHealth: number,
        remainingTime: number,
        screenWidth: number
    ) {
        this.scoreText.text =
            `SCORE: ${score}`;

        this.healthText.text =
            `HP: ${health} / ${maxHealth}`;

        const totalSeconds =
            Math.ceil(
                remainingTime
            );

        const minutes =
            Math.floor(
                totalSeconds / 60
            );

        const seconds =
            totalSeconds % 60;

        const formattedTime =
            `${minutes
                .toString()
                .padStart(2, "0")}:${seconds
                .toString()
                .padStart(2, "0")}`;

        this.timeText.text =
            `TIME: ${formattedTime}`;

        this.timeText.position.set(
            screenWidth - 20,
            20
        );
    }
}