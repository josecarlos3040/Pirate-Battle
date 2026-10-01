import { useEffect, useRef } from "react";

import type {
    GameResult
} from "../game/core/Game";

import {
    useRegisterMatch
} from "../api/queries";

import {
    getPlayerId,
    PLAYER_NAME
} from "../storage/playerStorage";

type ResultScreenProps = {
    result: GameResult;

    onPlayAgain: () => void;
    onMainMenu: () => void;
};

export function ResultScreen({
    result,
    onPlayAgain,
    onMainMenu
}: ResultScreenProps) {

    const registerMatch =
        useRegisterMatch();

    // Mantém o mesmo ID mesmo se o effect
    // executar novamente no StrictMode.
    const matchIdRef =
        useRef(crypto.randomUUID());

    useEffect(() => {
        registerMatch.mutate({
            id:
                result.matchId,

            playerId:
                getPlayerId(),

            playerName:
                PLAYER_NAME,

            date:
                new Date().toISOString(),

            score:
                result.score,

            duration:
                result.timePlayed,

            reason:
                result.reason,

            config:
                result.config
        });
    }, [result.matchId]);

    return (
        <main
            style={{
                textAlign: "center"
            }}
        >
            <h1>
                Match Result
            </h1>

            <p>
                Score: {result.score}
            </p>

            <p>
                Time Played:{" "}
                {Math.floor(
                    result.timePlayed
                )}s
            </p>

            <p>
                End Reason:{" "}
                {
                    result.reason === "death"
                        ? "Ship Destroyed"
                        : "Time Expired"
                }
            </p>

            <p>
                Session Time:{" "}
                {
                    result.config
                        .sessionTime
                }s
            </p>

            <p>
                Spawn Time:{" "}
                {
                    result.config
                        .enemySpawnTime
                }s
            </p>

            <p>
                Match Registration:{" "}

                {registerMatch.isPending &&
                    "Saving..."}

                {registerMatch.isSuccess &&
                    "Saved"}

                {registerMatch.isError &&
                    "Failed"}
            </p>

            <button
                onClick={onPlayAgain}
            >
                Play Again
            </button>

            <button
                onClick={onMainMenu}
            >
                Main Menu
            </button>
        </main>
    );
}