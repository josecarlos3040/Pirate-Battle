import {
    useEffect,
    useRef
} from "react";

import {
    Application,
    Assets
} from "pixi.js";

import {
    Game,
    type GameResult
} from "../game/core/Game";

import type {
    GameAssets
} from "../game/core/GameAssets";

import type {
    GameOptions
} from "../game/config/gameOptions";


// ========================================
// SHIPS
// ========================================

import playerShipUrl
    from "../assets/png/default/ships/ship_1.png";

import playerShipDamagedUrl
    from "../assets/png/default/ships/ship_13.png";


import shooterShipUrl
    from "../assets/png/default/ships/ship_2.png";

import shooterShipDamagedUrl
    from "../assets/png/default/ships/ship_14.png";


import chaserShipUrl
    from "../assets/png/default/ships/ship_3.png";

import chaserShipDamagedUrl
    from "../assets/png/default/ships/ship_15.png";


// ========================================
// PROJECTILE
// ========================================

import cannonballUrl
    from "../assets/png/default/ship_parts/cannon_ball.png";


// ========================================
// EXPLOSION
// ========================================

import explosion1Url
    from "../assets/png/default/effects/explosion_1.png";

import explosion2Url
    from "../assets/png/default/effects/explosion_2.png";

import explosion3Url
    from "../assets/png/default/effects/explosion_3.png";


// ========================================
// FIRE
// ========================================

import fire1Url
    from "../assets/png/default/effects/fire_1.png";

import fire2Url
    from "../assets/png/default/effects/fire_2.png";


// ========================================
// WATER
// ========================================

import waterTileUrl
    from "../assets/png/default/tiles/tile_73.png";


// ========================================
// ISLAND
// ========================================

import islandTopLeftUrl
    from "../assets/png/default/tiles/tile_1.png";

import islandTopCenterUrl
    from "../assets/png/default/tiles/tile_2.png";

import islandTopRightUrl
    from "../assets/png/default/tiles/tile_3.png";


import islandMiddleLeftUrl
    from "../assets/png/default/tiles/tile_17.png";

import islandCenterUrl
    from "../assets/png/default/tiles/tile_18.png";

import islandMiddleRightUrl
    from "../assets/png/default/tiles/tile_19.png";


import islandBottomLeftUrl
    from "../assets/png/default/tiles/tile_33.png";

import islandBottomCenterUrl
    from "../assets/png/default/tiles/tile_34.png";

import islandBottomRightUrl
    from "../assets/png/default/tiles/tile_35.png";

// ========================================
// HUD
// ========================================

import healthFrameUrl
    from "../assets/png/default/ui/hud/health_frame.png";

import healthFillGreenUrl
    from "../assets/png/default/ui/hud/health_fill_green.png";

import healthFillAmberUrl
    from "../assets/png/default/ui/hud/health_fill_amber.png";

import healthFillRedUrl
    from "../assets/png/default/ui/hud/health_fill_red.png";

import heartIconUrl
    from "../assets/png/default/ui/hud/icon_heart.png";


import counterPanelUrl
    from "../assets/png/default/ui/hud/counter_panel.png";

import scoreIconUrl
    from "../assets/png/default/ui/hud/icon_score.png";

import timeIconUrl
    from "../assets/png/default/ui/hud/icon_time.png";


// ========================================
// HUD CONTROLS
// ========================================

import pauseButtonNormalUrl
    from "../assets/png/default/ui/controls/button_round_normal.png";

import pauseButtonHoverUrl
    from "../assets/png/default/ui/controls/button_round_hover.png";

import pauseButtonPressedUrl
    from "../assets/png/default/ui/controls/button_round_pressed.png";

import pauseIconUrl
    from "../assets/png/default/ui/controls/icon_pause.png";


// ========================================
// PROPS
// ========================================

type GameCanvasProps = {
    onGameOver: (
        result: GameResult
    ) => void;

    onPauseChange: (
        paused: boolean
    ) => void;

    paused: boolean;

    options: GameOptions;
};


// ========================================
// GAME CANVAS
// ========================================

export function GameCanvas({
    onGameOver,
    onPauseChange,
    paused,
    options
}: GameCanvasProps) {

    const containerRef =
        useRef<HTMLDivElement>(
            null
        );

    const gameRef =
        useRef<Game | null>(
            null
        );

    const pausedRef =
        useRef(paused);


    // ====================================
    // CREATE GAME
    // ====================================

    useEffect(() => {

        let app:
            Application | null =
            null;

        let game:
            Game | null =
            null;

        let cancelled =
            false;


        async function start() {

            try {

                // ============================
                // PIXI
                // ============================

                const pixiApp =
                    new Application();


                await pixiApp.init({
                    background:
                        "#35a6d9",

                    resizeTo:
                        window,

                    antialias:
                        true
                });


                if (cancelled) {

                    pixiApp.destroy(
                        true
                    );

                    return;
                }


                app =
                    pixiApp;


                // ============================
                // CANVAS
                // ============================

                containerRef
                    .current
                    ?.appendChild(
                        pixiApp.canvas
                    );


                // ============================
                // LOAD ASSETS
                // ============================

                const assets:
                    GameAssets = {

                    // PLAYER

                    playerShip:
                        await Assets.load(
                            playerShipUrl
                        ),

                    playerShipDamaged:
                        await Assets.load(
                            playerShipDamagedUrl
                        ),


                    // CHASER

                    chaserShip:
                        await Assets.load(
                            chaserShipUrl
                        ),

                    chaserShipDamaged:
                        await Assets.load(
                            chaserShipDamagedUrl
                        ),


                    // SHOOTER

                    shooterShip:
                        await Assets.load(
                            shooterShipUrl
                        ),

                    shooterShipDamaged:
                        await Assets.load(
                            shooterShipDamagedUrl
                        ),


                    // CANNON BALL

                    cannonball:
                        await Assets.load(
                            cannonballUrl
                        ),


                    // EXPLOSION

                    explosionFrames: [
                        await Assets.load(
                            explosion1Url
                        ),

                        await Assets.load(
                            explosion2Url
                        ),

                        await Assets.load(
                            explosion3Url
                        )
                    ],


                    // FIRE

                    fireFrames: [
                        await Assets.load(
                            fire1Url
                        ),

                        await Assets.load(
                            fire2Url
                        )
                    ],


                    // WATER

                    water:
                        await Assets.load(
                            waterTileUrl
                        ),


                    // ISLAND

                    island: {

                        topLeft:
                            await Assets.load(
                                islandTopLeftUrl
                            ),

                        topCenter:
                            await Assets.load(
                                islandTopCenterUrl
                            ),

                        topRight:
                            await Assets.load(
                                islandTopRightUrl
                            ),


                        middleLeft:
                            await Assets.load(
                                islandMiddleLeftUrl
                            ),

                        center:
                            await Assets.load(
                                islandCenterUrl
                            ),

                        middleRight:
                            await Assets.load(
                                islandMiddleRightUrl
                            ),


                        bottomLeft:
                            await Assets.load(
                                islandBottomLeftUrl
                            ),

                        bottomCenter:
                            await Assets.load(
                                islandBottomCenterUrl
                            ),

                        bottomRight:
                            await Assets.load(
                                islandBottomRightUrl
                            )
                    },
                    hud: {

                        healthFrame:
                            await Assets.load(
                                healthFrameUrl
                            ),

                        healthFillGreen:
                            await Assets.load(
                                healthFillGreenUrl
                            ),

                        healthFillAmber:
                            await Assets.load(
                                healthFillAmberUrl
                            ),

                        healthFillRed:
                            await Assets.load(
                                healthFillRedUrl
                            ),

                        heartIcon:
                            await Assets.load(
                                heartIconUrl
                            ),


                        counterPanel:
                            await Assets.load(
                                counterPanelUrl
                            ),

                        scoreIcon:
                            await Assets.load(
                                scoreIconUrl
                            ),

                        timeIcon:
                            await Assets.load(
                                timeIconUrl
                            ),


                        pauseButtonNormal:
                            await Assets.load(
                                pauseButtonNormalUrl
                            ),

                        pauseButtonHover:
                            await Assets.load(
                                pauseButtonHoverUrl
                            ),

                        pauseButtonPressed:
                            await Assets.load(
                                pauseButtonPressedUrl
                            ),

                        pauseIcon:
                            await Assets.load(
                                pauseIconUrl
                            )
                    }
                };


                if (cancelled) {

                    pixiApp.destroy(
                        true
                    );

                    return;
                }


                // ============================
                // CREATE GAME
                // ============================

                game =
                    new Game(
                        pixiApp,
                        assets,
                        options,
                        onGameOver,
                        onPauseChange
                    );


                gameRef.current =
                    game;


                // ============================
                // INITIAL PAUSE
                // ============================

                game.setPaused(
                    pausedRef.current
                );

            } catch (error) {

                console.error(
                    "GAME INITIALIZATION FAILED:",
                    error
                );
            }
        }


        void start();


        // ====================================
        // CLEANUP
        // ====================================

        return () => {

            cancelled =
                true;


            if (
                gameRef.current ===
                game
            ) {

                gameRef.current =
                    null;
            }


            game?.destroy();


            app?.destroy(
                true,
                {
                    children:
                        true
                }
            );
        };

    }, [
        onGameOver,
        onPauseChange,
        options
    ]);


    // ====================================
    // PAUSE
    // ====================================

    useEffect(() => {

        pausedRef.current =
            paused;


        gameRef.current
            ?.setPaused(
                paused
            );

    }, [
        paused
    ]);


    // ====================================
    // HTML
    // ====================================

    return (
        <div
            ref={containerRef}

            style={{
                width:
                    "100vw",

                height:
                    "100vh",

                overflow:
                    "hidden"
            }}
        />
    );
}