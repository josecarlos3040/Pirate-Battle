import {
    useCallback,
    useState
} from "react";

import { GameCanvas } from "../components/GameCanvas";

import type {
    GameResult
} from "../game/core/Game";

export function GameScreen() {
    const [result, setResult] =
        useState<GameResult | null>(
            null
        );

    const [gameId, setGameId] =
        useState(0);

    const handleGameOver =
        useCallback(
            (gameResult: GameResult) => {
                setResult(gameResult);
            },
            []
        );

    const playAgain = () => {
        setResult(null);

        setGameId(
            current =>
                current + 1
        );
    };

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
                key={gameId}
                onGameOver={
                    handleGameOver
                }
            />

            {result && (
                <div
                    style={{
                        position: "fixed",
                        inset: 0,

                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",

                        background:
                            "rgba(0, 0, 0, 0.65)",

                        zIndex: 1000
                    }}
                >
                    <div
                        style={{
                            background:
                                "#ffffff",

                            color:
                                "#111111",

                            padding:
                                "32px",

                            borderRadius:
                                "12px",

                            minWidth:
                                "300px",

                            textAlign:
                                "center"
                        }}
                    >
                        <h1>
                            Game Over
                        </h1>

                        <p>
                            Score:{" "}
                            {result.score}
                        </p>

                        <p>
                            Time played:{" "}
                            {Math.floor(
                                result.timePlayed
                            )}s
                        </p>

                        <p>
                            Reason:{" "}
                            {result.reason ===
                            "death"
                                ? "Ship destroyed"
                                : "Time expired"}
                        </p>

                        <button
                            onClick={
                                playAgain
                            }
                        >
                            Play Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}