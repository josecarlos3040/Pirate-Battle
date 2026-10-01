import { apiClient } from "./client";

import type {
    CreateMatchRequest,
    MatchRecord,
    PaginatedResponse,
    RankingEntry
} from "./types";

export async function createMatch(
    match: CreateMatchRequest
) {
    const response =
        await apiClient.post<MatchRecord>(
            "/matches",
            match
        );

    return response.data;
}

export async function getMatchHistory(
    page: number,
    pageSize = 5
) {
    const response =
        await apiClient.get<
            PaginatedResponse<MatchRecord>
        >(
            "/matches",
            {
                params: {
                    page,
                    pageSize
                }
            }
        );

    return response.data;
}

export async function getRanking(
    page: number,
    pageSize = 5
) {
    const response =
        await apiClient.get<
            PaginatedResponse<RankingEntry>
        >(
            "/ranking",
            {
                params: {
                    page,
                    pageSize
                }
            }
        );

    return response.data;
}