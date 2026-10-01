import { useEffect } from "react";

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

import {
    savePendingMatch,
    removePendingMatch
} from "../storage/pendingMatches";

import type {
    CreateMatchRequest
} from "../api/types";


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


    const matchRequest:
        CreateMatchRequest = {

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
    };


    useEffect(() => {
        savePendingMatch(
            matchRequest
        );

        registerMatch.mutate(
            matchRequest,
            {
                onSuccess: () => {
                    removePendingMatch(
                        matchRequest.id
                    );
                }
            }
        );
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
                    result.reason ===
                    "death"
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


            {registerMatch.isError && (
                <button
                    onClick={() => {
                        registerMatch.mutate(
                            matchRequest,
                            {
                                onSuccess:
                                    () => {
                                        removePendingMatch(
                                            matchRequest.id
                                        );
                                    }
                            }
                        );
                    }}
                >
                    Retry Registration
                </button>
            )}


            <button
                onClick={
                    onPlayAgain
                }
            >
                Play Again
            </button>


            <button
                onClick={
                    onMainMenu
                }
            >
                Main Menu
            </button>
        </main>
    );
}