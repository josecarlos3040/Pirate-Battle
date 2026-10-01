import {
    http,
    HttpResponse
} from "msw/http";

import type {
    CreateMatchRequest,
    MatchRecord,
    RankingEntry
} from "../api/types";

const STORAGE_KEY =
    "pirate-battle-api-matches";

function loadMatches():
    MatchRecord[] {
    try {
        const saved =
            localStorage.getItem(
                STORAGE_KEY
            );

        if (!saved) {
            return [];
        }

        return JSON.parse(
            saved
        ) as MatchRecord[];
    } catch {
        return [];
    }
}

function saveMatches(
    matches: MatchRecord[]
) {
    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(matches)
    );
}

export const handlers = [

    // ================================
    // POST MATCH
    // ================================

    http.post(
        "/api/matches",

        async ({ request }) => {
            const rawBody =
                await request.json();

            if (
                !rawBody ||
                typeof rawBody !== "object"
            ) {
                return HttpResponse.json(
                    {
                        error:
                            "Invalid request body"
                    },
                    {
                        status: 400
                    }
                );
            }

            const body =
                rawBody as CreateMatchRequest;

            const matches =
                loadMatches();

            const existing =
                matches.find(
                    match =>
                        match.id === body.id
                );

            if (existing) {
                return HttpResponse.json(
                    existing
                );
            }

            const record: MatchRecord = {
                ...body
            };

            matches.push(record);

            saveMatches(matches);

            return HttpResponse.json(
                record,
                {
                    status: 201
                }
            );
        }
    ),

    // ================================
    // MATCH HISTORY
    // ================================

    http.get(
        "/api/matches",

        ({ request }) => {
            const url =
                new URL(
                    request.url
                );

            const page =
                Number(
                    url.searchParams.get(
                        "page"
                    )
                ) || 1;

            const pageSize =
                Number(
                    url.searchParams.get(
                        "pageSize"
                    )
                ) || 5;

            const matches =
                loadMatches()
                    .sort(
                        (a, b) =>
                            new Date(
                                b.date
                            ).getTime() -
                            new Date(
                                a.date
                            ).getTime()
                    );

            const start =
                (page - 1) *
                pageSize;

            const items =
                matches.slice(
                    start,
                    start + pageSize
                );

            return HttpResponse.json({
                items,

                page,
                pageSize,

                totalItems:
                    matches.length,

                totalPages:
                    Math.max(
                        1,
                        Math.ceil(
                            matches.length /
                            pageSize
                        )
                    )
            });
        }
    ),

    // ================================
    // RANKING
    // ================================

    http.get(
        "/api/ranking",

        ({ request }) => {
            const url =
                new URL(
                    request.url
                );

            const page =
                Number(
                    url.searchParams.get(
                        "page"
                    )
                ) || 1;

            const pageSize =
                Number(
                    url.searchParams.get(
                        "pageSize"
                    )
                ) || 5;

            const matches =
                loadMatches()
                    .sort(
                        (a, b) => {
                            if (
                                b.score !==
                                a.score
                            ) {
                                return (
                                    b.score -
                                    a.score
                                );
                            }

                            // desempate determinístico
                            return (
                                a.duration -
                                b.duration
                            );
                        }
                    );

            const ranking:
                RankingEntry[] =
                matches.map(
                    (
                        match,
                        index
                    ) => ({
                        position:
                            index + 1,

                        playerId:
                            match.playerId,

                        playerName:
                            match.playerName,

                        score:
                            match.score,

                        matchId:
                            match.id,

                        date:
                            match.date
                    })
                );

            const start =
                (page - 1) *
                pageSize;

            return HttpResponse.json({
                items:
                    ranking.slice(
                        start,
                        start + pageSize
                    ),

                page,
                pageSize,

                totalItems:
                    ranking.length,

                totalPages:
                    Math.max(
                        1,
                        Math.ceil(
                            ranking.length /
                            pageSize
                        )
                    )
            });
        }
    )
];