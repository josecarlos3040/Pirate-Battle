import type { GameOptions } from "../game/config/gameOptions";
import { DEFAULT_GAME_OPTIONS } from "../game/config/gameOptions";

import type { GameResult } from "../game/core/Game";

const OPTIONS_KEY =
    "pirate-battle-options";

const LAST_RESULT_KEY =
    "pirate-battle-last-result";

export function loadGameOptions(): GameOptions {
    try {
        const saved =
            localStorage.getItem(
                OPTIONS_KEY
            );

        if (!saved) {
            return {
                ...DEFAULT_GAME_OPTIONS
            };
        }

        const parsed =
            JSON.parse(saved) as GameOptions;

        return parsed;
    } catch {
        return {
            ...DEFAULT_GAME_OPTIONS
        };
    }
}

export function saveGameOptions(
    options: GameOptions
) {
    localStorage.setItem(
        OPTIONS_KEY,
        JSON.stringify(options)
    );
}

export function loadLastGameResult():
    GameResult | null {
    try {
        const saved =
            localStorage.getItem(
                LAST_RESULT_KEY
            );

        if (!saved) {
            return null;
        }

        return JSON.parse(
            saved
        ) as GameResult;
    } catch {
        return null;
    }
}

export function saveLastGameResult(
    result: GameResult
) {
    localStorage.setItem(
        LAST_RESULT_KEY,
        JSON.stringify(result)
    );
}