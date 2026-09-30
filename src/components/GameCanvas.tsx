import { useEffect, useRef } from "react";
import { Application, Assets } from "pixi.js";
import { Game } from "../game/core/Game";

import playerShipUrl from "../assets/png/default/ships/ship_1.png";

export function GameCanvas() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let app: Application | null = null;
        let game: Game | null = null;

        let cancelled = false;

        async function start() {
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

            // CARREGA O NAVIO
            const playerTexture = await Assets.load(playerShipUrl);

            if (cancelled) {
                pixiApp.destroy(true);
                return;
            }

            app = pixiApp;

            containerRef.current?.appendChild(
                pixiApp.canvas
            );

            game = new Game(
                pixiApp,
                playerTexture
            );
        }

        start();

        return () => {
            cancelled = true;

            game?.destroy();

            app?.destroy(true, {
                children: true,
            });
        };
    }, []);

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