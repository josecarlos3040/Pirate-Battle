import type {
    GameOptions
} from "../game/config/gameOptions";

import type {
    GameEndReason
} from "../game/core/Game";

export type MatchRecord = {
    id: string;
    playerId: string;
    playerName: string;

    date: string;

    score: number;
    duration: number;

    reason: GameEndReason;

    config: GameOptions;
};

export type RankingEntry = {
    position: number;

    playerId: string;
    playerName: string;

    score: number;

    matchId: string;

    date: string;
};

export type PaginatedResponse<T> = {
    items: T[];

    page: number;
    pageSize: number;

    totalItems: number;
    totalPages: number;
};

export type CreateMatchRequest = {
    id: string;

    playerId: string;
    playerName: string;

    date: string;

    score: number;
    duration: number;

    reason: GameEndReason;

    config: GameOptions;
};