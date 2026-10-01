import { useEffect, useRef } from "react";
import { Application, Assets } from "pixi.js";

import { Game, type GameResult } from "../game/core/Game";
import type { GameAssets } from "../game/core/GameAssets";

import playerShipUrl from "../assets/png/default/ships/ship_1.png";
import chaserShipUrl from "../assets/png/default/ships/ship_3.png";
import shooterShipUrl from "../assets/png/default/ships/ship_2.png";
import cannonballUrl from "../assets/png/default/ship_parts/cannon_ball.png";

import type { GameOptions } from "../game/config/gameOptions";

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

export function GameCanvas({
    onGameOver,
    onPauseChange,
    paused,
    options
}: GameCanvasProps) {

    const containerRef =
        useRef<HTMLDivElement>(null);

    const gameRef =
        useRef<Game | null>(null);

    const pausedRef =
        useRef(paused);

    // =========================================================
    // CRIA O JOGO
    // =========================================================

    useEffect(() => {

        let app: Application | null = null;
        let game: Game | null = null;

        let cancelled = false;

        async function start() {

            // =================================================
            // CRIA O PIXI
            // =================================================

            const pixiApp = new Application();

            await pixiApp.init({
                background: "#35a6d9",
                resizeTo: window,
                antialias: true,
            });

            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }

            // =================================================
            // CARREGA OS ASSETS
            // =================================================

            const assets: GameAssets = {
                playerShip: await Assets.load(
                    playerShipUrl
                ),

                chaserShip: await Assets.load(
                    chaserShipUrl
                ),

                shooterShip: await Assets.load(
                    shooterShipUrl
                ),

                cannonball: await Assets.load(
                    cannonballUrl
                ),
            };

            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }

            // =================================================
            // GUARDA A REFERÊNCIA DO PIXI
            // =================================================

            app = pixiApp;

            // =================================================
            // COLOCA O CANVAS NA TELA
            // =================================================

            containerRef.current?.appendChild(
                pixiApp.canvas
            );

            // =================================================
            // CRIA O GAME
            // =================================================

            game = new Game(
                pixiApp,
                assets,
                options,
                onGameOver,
                onPauseChange
            );

            gameRef.current = game;

            // =================================================
            // SINCRONIZA O PAUSE INICIAL
            // =================================================

            game.setPaused(
                pausedRef.current
            );
        }

        // =====================================================
        // INICIA O GAME
        // =====================================================

        start();

        // =====================================================
        // CLEANUP
        // =====================================================

        return () => {

            cancelled = true;

            if (gameRef.current === game) {
                gameRef.current = null;
            }

            game?.destroy();

            app?.destroy(
                true,
                {
                    children: true,
                }
            );
        };

    }, [
        onGameOver,
        onPauseChange
    ]);

    // =========================================================
    // SINCRONIZA O PAUSE DO REACT COM O GAME
    // =========================================================

    useEffect(() => {

        pausedRef.current = paused;

        gameRef.current?.setPaused(
            paused
        );

    }, [paused]);

    // =========================================================
    // HTML
    // =========================================================

    return (
        <div
            ref={containerRef}
            style={{
                width: "100vw",
                height: "100vh",
                overflow: "hidden",
            }}
        />
    );
}