export type GameOptions = {
    sessionTime: number;
    enemySpawnTime: number;
};

export const GAME_OPTION_LIMITS = {
    sessionTime: {
        min: 60,
        max: 180
    },

    enemySpawnTime: {
        min: 1,
        max: 15
    }
} as const;

export const DEFAULT_GAME_OPTIONS: GameOptions = {
    sessionTime: 120,
    enemySpawnTime: 3
};