import {
    Container,
    Sprite,
    Text
} from "pixi.js";

import type {
    HudTextures
} from "../core/GameAssets";


export class Hud {

    public readonly container:
        Container;


    // ====================================
    // HEALTH
    // ====================================

    private healthContainer:
        Container;

    private healthFrame:
        Sprite;

    private healthFill:
        Sprite;

    private heartIcon:
        Sprite;

    private healthText:
        Text;


    private readonly maxHealthFillWidth =
        220;


    // ====================================
    // SCORE
    // ====================================

    private scoreContainer:
        Container;

    private scoreText:
        Text;


    // ====================================
    // TIMER
    // ====================================

    private timerContainer:
        Container;

    private timerText:
        Text;


    // ====================================
    // PAUSE
    // ====================================

    private pauseContainer:
        Container;

    private pauseButton:
        Sprite;


    private textures:
        HudTextures;


    constructor(
        textures: HudTextures,
        onPause: () => void
    ) {

        this.textures =
            textures;


        this.container =
            new Container();


        // ====================================
        // HEALTH
        // ====================================

        this.healthContainer =
            new Container();


        this.healthFrame =
            new Sprite(
                textures.healthFrame
            );


        this.healthFrame.width =
            280;

        this.healthFrame.height =
            54;


        this.healthFrame.position.set(
            36,
            0
        );


        // ------------------------------------
        // HEALTH FILL
        // ------------------------------------

        this.healthFill =
            new Sprite(
                textures.healthFillGreen
            );


        this.healthFill.width =
            this.maxHealthFillWidth;

        this.healthFill.height =
            19;


        this.healthFill.position.set(
            72,
            17
        );


        // ------------------------------------
        // HEART
        // ------------------------------------

        this.heartIcon =
            new Sprite(
                textures.heartIcon
            );


        this.heartIcon.width =
            48;

        this.heartIcon.height =
            48;


        this.heartIcon.position.set(
            0,
            3
        );


        // ------------------------------------
        // HEALTH TEXT
        // ------------------------------------

        this.healthText =
            new Text({
                text:
                    "100 / 100",

                style: {
                    fontFamily:
                        "Arial",

                    fontSize:
                        17,

                    fontWeight:
                        "bold",

                    fill:
                        "#ffffff",

                    stroke: {
                        color:
                            "#2a1c0f",

                        width:
                            4
                    }
                }
            });


        this.healthText.anchor.set(
            0.5
        );


        this.healthText.position.set(
            177,
            27
        );


        this.healthContainer.addChild(
            this.healthFrame
        );

        this.healthContainer.addChild(
            this.healthFill
        );

        this.healthContainer.addChild(
            this.heartIcon
        );

        this.healthContainer.addChild(
            this.healthText
        );


        this.container.addChild(
            this.healthContainer
        );


        // ====================================
        // SCORE
        // ====================================

        this.scoreContainer =
            this.createCounter(
                textures.scoreIcon
            );


        this.scoreText =
            this.createCounterText();


        this.scoreText.text =
            "0";


        this.scoreContainer.addChild(
            this.scoreText
        );


        this.container.addChild(
            this.scoreContainer
        );


        // ====================================
        // TIMER
        // ====================================

        this.timerContainer =
            this.createCounter(
                textures.timeIcon
            );


        this.timerText =
            this.createCounterText();


        this.timerText.text =
            "02:00";


        this.timerContainer.addChild(
            this.timerText
        );


        this.container.addChild(
            this.timerContainer
        );


        // ====================================
        // PAUSE BUTTON
        // ====================================

        this.pauseContainer =
            new Container();


        this.pauseButton =
            new Sprite(
                textures.pauseButtonNormal
            );


        this.pauseButton.anchor.set(
            0.5
        );


        this.pauseButton.width =
            50;

        this.pauseButton.height =
            50;


        this.pauseButton.eventMode =
            "static";


        this.pauseButton.cursor =
            "pointer";


        const pauseIcon =
            new Sprite(
                textures.pauseIcon
            );


        pauseIcon.anchor.set(
            0.5
        );


        pauseIcon.width =
            21;

        pauseIcon.height =
            25;


        // ------------------------------------
        // HOVER
        // ------------------------------------

        this.pauseButton.on(
            "pointerover",
            () => {

                this.pauseButton.texture =
                    this.textures
                        .pauseButtonHover;
            }
        );


        this.pauseButton.on(
            "pointerout",
            () => {

                this.pauseButton.texture =
                    this.textures
                        .pauseButtonNormal;
            }
        );


        // ------------------------------------
        // PRESSED
        // ------------------------------------

        this.pauseButton.on(
            "pointerdown",
            () => {

                this.pauseButton.texture =
                    this.textures
                        .pauseButtonPressed;
            }
        );


        this.pauseButton.on(
            "pointerupoutside",
            () => {

                this.pauseButton.texture =
                    this.textures
                        .pauseButtonNormal;
            }
        );


        // ------------------------------------
        // CLICK
        // ------------------------------------

        this.pauseButton.on(
            "pointerup",
            () => {

                this.pauseButton.texture =
                    this.textures
                        .pauseButtonHover;


                onPause();
            }
        );


        this.pauseContainer.addChild(
            this.pauseButton
        );


        this.pauseContainer.addChild(
            pauseIcon
        );


        this.container.addChild(
            this.pauseContainer
        );
    }


    // ====================================
    // CREATE COUNTER
    // ====================================

    private createCounter(
        iconTexture:
            HudTextures["scoreIcon"]
    ) {

        const container =
            new Container();


        const panel =
            new Sprite(
                this.textures.counterPanel
            );


        panel.width =
            125;

        panel.height =
            44;


        const icon =
            new Sprite(
                iconTexture
            );


        icon.anchor.set(
            0.5
        );


        icon.width =
            27;

        icon.height =
            27;


        icon.position.set(
            28,
            22
        );


        container.addChild(
            panel
        );


        container.addChild(
            icon
        );


        return container;
    }


    // ====================================
    // CREATE COUNTER TEXT
    // ====================================

    private createCounterText() {

        const text =
            new Text({
                text:
                    "",

                style: {
                    fontFamily:
                        "Arial",

                    fontSize:
                        18,

                    fontWeight:
                        "bold",

                    fill:
                        "#ffffff",

                    stroke: {
                        color:
                            "#25180d",

                        width:
                            4
                    }
                }
            });


        text.anchor.set(
            0.5
        );


        text.position.set(
            79,
            22
        );


        return text;
    }


    // ====================================
    // UPDATE
    // ====================================

    public update(
        score: number,
        currentHealth: number,
        maxHealth: number,
        remainingTime: number,
        screenWidth: number,
        screenHeight: number
    ){

        // =================================
        // HEALTH
        // =================================

        const healthPercentage =
            Math.max(
                0,

                Math.min(
                    1,

                    currentHealth /
                        maxHealth
                )
            );


        // ---------------------------------
        // HEALTH COLOR
        // ---------------------------------

        if (
            healthPercentage > 0.6
        ) {

            this.healthFill.texture =
                this.textures
                    .healthFillGreen;

        } else if (
            healthPercentage > 0.3
        ) {

            this.healthFill.texture =
                this.textures
                    .healthFillAmber;

        } else {

            this.healthFill.texture =
                this.textures
                    .healthFillRed;
        }


        this.healthFill.width =
            this.maxHealthFillWidth *
            healthPercentage;


        this.healthFill.height =
            19;


        this.healthText.text =
            `${Math.ceil(currentHealth)} / ${maxHealth}`;


        // =================================
        // SCORE
        // =================================

        this.scoreText.text =
            score.toString();


        // =================================
        // TIMER
        // =================================

        const totalSeconds =
            Math.max(
                0,

                Math.ceil(
                    remainingTime
                )
            );


        const minutes =
            Math.floor(
                totalSeconds /
                60
            );


        const seconds =
            totalSeconds %
            60;


        this.timerText.text =
            `${minutes
                .toString()
                .padStart(
                    2,
                    "0"
                )}:${seconds
                .toString()
                .padStart(
                    2,
                    "0"
                )}`;


        // =================================
        // RESPONSIVE LAYOUT
        // =================================
        const isLandscapeMobile =
            screenWidth <= 950 &&
            screenHeight <= 500;


        if (isLandscapeMobile) {

            // =================================
            // LANDSCAPE MOBILE
            // =================================

            this.healthContainer
                .scale
                .set(0.62);

            this.scoreContainer
                .scale
                .set(0.68);

            this.timerContainer
                .scale
                .set(0.68);

            this.pauseContainer
                .scale
                .set(0.72);


            this.healthContainer
                .position
                .set(
                    8,
                    8
                );


            this.scoreContainer
                .position
                .set(
                    screenWidth - 245,
                    10
                );


            this.timerContainer
                .position
                .set(
                    screenWidth - 155,
                    10
                );


            this.pauseContainer
                .position
                .set(
                    screenWidth - 31,
                    25
                );


            return;
        }


        if (
            screenWidth < 700
        ) {

            // MOBILE

            this.healthContainer
                .scale
                .set(
                    0.72
                );


            this.healthContainer
                .position
                .set(
                    10,
                    10
                );


            this.scoreContainer
                .scale
                .set(
                    0.8
                );


            this.timerContainer
                .scale
                .set(
                    0.8
                );


            this.pauseContainer
                .scale
                .set(
                    0.8
                );


            this.scoreContainer
                .position
                .set(
                    10,
                    62
                );


            this.timerContainer
                .position
                .set(
                    115,
                    62
                );


            this.pauseContainer
                .position
                .set(
                    250,
                    80
                );


            return;
        }


        // =================================
        // DESKTOP
        // =================================

        this.healthContainer
            .scale
            .set(
                1
            );


        this.scoreContainer
            .scale
            .set(
                1
            );


        this.timerContainer
            .scale
            .set(
                1
            );


        this.pauseContainer
            .scale
            .set(
                1
            );


        this.healthContainer
            .position
            .set(
                22,
                18
            );


        this.scoreContainer
            .position
            .set(
                screenWidth -
                    330,

                22
            );


        this.timerContainer
            .position
            .set(
                screenWidth -
                    195,

                22
            );


        this.pauseContainer
            .position
            .set(
                screenWidth -
                    42,

                44
            );
    }


    // ====================================
    // DESTROY
    // ====================================

    public destroy() {

        this.container.destroy({
            children:
                true
        });
    }
}