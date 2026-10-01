import {
    useCallback,
    useState
} from "react";

import { GameCanvas } from "../components/GameCanvas";

import type {
    GameResult
} from "../game/core/Game";

import type {
    GameOptions
} from "../game/config/gameOptions";

import {
    MobileControls
} from "../components/MobileControls";

type GameScreenProps = {
    options: GameOptions;

    onGameOver: (
        result: GameResult
    ) => void;

    onMainMenu: () => void;
};

export function GameScreen({
    options,
    onGameOver,
    onMainMenu
}: GameScreenProps) {
    const [paused, setPaused] =
        useState(false);

    const handleGameOver =
        useCallback(
            (result: GameResult) => {
                setPaused(false);

                onGameOver(result);
            },
            [onGameOver]
        );

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                overflow: "hidden"
            }}
        >
            <GameCanvas
                options={options}
                onGameOver={
                    handleGameOver
                }
                onPauseChange={
                    setPaused
                }
                paused={paused}
            />
            <MobileControls
                onPause={() =>
                    setPaused(true)
                }
            />

            {paused && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,

                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",

                        background:
                            "rgba(0,0,0,0.65)",

                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            background: "white",
                            color: "#111",

                            padding: "32px",
                            borderRadius: "12px",

                            textAlign: "center"
                        }}
                    >
                        <h1>Paused</h1>

                        <button
                            onClick={() =>
                                setPaused(false)
                            }
                        >
                            Resume
                        </button>

                        <button
                            onClick={
                                onMainMenu
                            }
                        >
                            Main Menu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}