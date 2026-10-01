import {
    useCallback,
    useState
} from "react";

import {
    MainMenu
} from "./screens/MainMenu";

import {
    GameScreen
} from "./screens/GameScreen";

import {
    OptionsScreen
} from "./screens/OptionsScreen";

import {
    ResultScreen
} from "./screens/ResultScreen";

import type {
    GameResult
} from "./game/core/Game";

import type {
    GameOptions
} from "./game/config/gameOptions";

import {
    loadGameOptions,
    saveGameOptions,
    loadLastGameResult,
    saveLastGameResult
} from "./storage/gameStorage";

import {
    RankingScreen
} from "./screens/RankingScreen";

import {
    MatchHistoryScreen
} from "./screens/MatchHistoryScreen";

import {
    usePendingMatchRecovery
} from "./api/usePendingMatchRecovery";

type Screen =
    | "menu"
    | "game"
    | "options"
    | "result"
    | "ranking"
    | "history";

function App() {

    usePendingMatchRecovery();
    const [screen, setScreen] =
        useState<Screen>(
            "menu"
        );

    const [options, setOptions] =
        useState<GameOptions>(
            () =>
                loadGameOptions()
        );

    const [
        activeOptions,
        setActiveOptions
    ] =
        useState<GameOptions>(
            () => ({
                ...options
            })
        );

    const [
        lastResult,
        setLastResult
    ] =
        useState<GameResult | null>(
            () =>
                loadLastGameResult()
        );

    const startGame =
        useCallback(() => {
            // SNAPSHOT DA CONFIG
            setActiveOptions({
                ...options
            });

            setScreen("game");
        }, [options]);

    const handleGameOver =
        useCallback(
            (
                result: GameResult
            ) => {
                saveLastGameResult(
                    result
                );

                setLastResult(
                    result
                );

                setScreen(
                    "result"
                );
            },
            []
        );

    const handleSaveOptions = (
        newOptions: GameOptions
    ) => {
        saveGameOptions(
            newOptions
        );

        setOptions(
            newOptions
        );

        setScreen("menu");
    };

    if (screen === "game") {
        return (
            <GameScreen
                options={
                    activeOptions
                }
                onGameOver={
                    handleGameOver
                }
                onMainMenu={() =>
                    setScreen(
                        "menu"
                    )
                }
            />
        );
    }

    if (screen === "options") {
        return (
            <OptionsScreen
                options={
                    options
                }
                onSave={
                    handleSaveOptions
                }
                onBack={() =>
                    setScreen(
                        "menu"
                    )
                }
            />
        );
    }

    if (
        screen === "result" &&
        lastResult
    ) {
        return (
            <ResultScreen
                result={
                    lastResult
                }
                onPlayAgain={
                    startGame
                }
                onMainMenu={() =>
                    setScreen(
                        "menu"
                    )
                }
            />
        );
    }
    if (screen === "ranking") {
        return (
            <RankingScreen
                onBack={() =>
                    setScreen("menu")
                }
            />
        );
    }

    if (screen === "history") {
        return (
            <MatchHistoryScreen
                onBack={() =>
                    setScreen("menu")
                }
            />
        );
    }
    return (
        <MainMenu
            onPlay={startGame}

            onOptions={() =>
                setScreen("options")
            }

            onRanking={() =>
                setScreen("ranking")
            }

            onHistory={() =>
                setScreen("history")
            }

            lastResult={
                lastResult
            }
        />
    );
}

export default App;