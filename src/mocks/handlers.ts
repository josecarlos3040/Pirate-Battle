import {
    http,
    HttpResponse
} from "msw/http";

import type {
    CreateMatchRequest,
    MatchRecord,
    RankingEntry
} from "../api/types";

import {
    getNetworkScenario
} from "./networkScenario";


// ==================================
// TYPES
// ==================================

type ApiError = {
    error: string;
};


// ==================================
// STORAGE
// ==================================

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

        // JSON.parse retorna any,
        // então não precisamos usar "as"
        // aqui.
        return JSON.parse(saved);

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


// ==================================
// DELAY
// ==================================

function wait(
    milliseconds: number
): Promise<void> {

    return new Promise(
        resolve => {
            window.setTimeout(
                resolve,
                milliseconds
            );
        }
    );
}


// ==================================
// HANDLERS
// ==================================

export const handlers = [

    // ==================================
    // POST MATCH
    // ==================================

    http.post<
        never,
        CreateMatchRequest,
        MatchRecord | ApiError
    >(
        "/api/matches",

        async ({ request }) => {

            // O tipo já vem do generic
            // do http.post.
            //
            // NÃO precisa de:
            // as CreateMatchRequest

            const body =
                await request.json();


            const scenario =
                getNetworkScenario();


            // --------------------------
            // SERVER ERROR
            // --------------------------

            if (
                scenario ===
                "server-error"
            ) {
                return HttpResponse.json(
                    {
                        error:
                            "Server unavailable"
                    },
                    {
                        status: 500
                    }
                );
            }


            // --------------------------
            // CONNECTION ERROR
            // --------------------------

            if (
                scenario ===
                "connection-error"
            ) {
                return HttpResponse.error();
            }


            // --------------------------
            // LOAD CURRENT MATCHES
            // --------------------------

            const matches =
                loadMatches();


            // --------------------------
            // IDEMPOTENCY
            // --------------------------
            //
            // Se o mesmo matchId já foi
            // salvo, devolve o registro
            // existente em vez de criar
            // outro.

            const existing =
                matches.find(
                    match =>
                        match.id ===
                        body.id
                );


            if (existing) {
                return HttpResponse.json(
                    existing
                );
            }


            // --------------------------
            // CREATE MATCH
            // --------------------------

            const record:
                MatchRecord = {
                id:
                    body.id,

                playerId:
                    body.playerId,

                playerName:
                    body.playerName,

                date:
                    body.date,

                score:
                    body.score,

                duration:
                    body.duration,

                reason:
                    body.reason,

                config:
                    body.config
            };


            matches.push(
                record
            );


            saveMatches(
                matches
            );


            // --------------------------
            // TIMEOUT AFTER SAVE
            // --------------------------
            //
            // O servidor já salvou,
            // mas demora mais que o
            // timeout configurado
            // no Axios.

            if (
                scenario ===
                "post-timeout-after-save"
            ) {
                await wait(
                    6000
                );
            }


            // --------------------------
            // SLOW NETWORK
            // --------------------------

            if (
                scenario ===
                "slow"
            ) {
                await wait(
                    1500
                );
            }


            return HttpResponse.json(
                record,
                {
                    status: 201
                }
            );
        }
    ),


    // ==================================
    // MATCH HISTORY
    // ==================================

    http.get(
        "/api/matches",

        async ({ request }) => {

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


            const scenario =
                getNetworkScenario();


            // --------------------------
            // SLOW NETWORK
            // --------------------------

            if (
                scenario ===
                "slow"
            ) {
                await wait(
                    1500
                );
            }


            // --------------------------
            // VARIABLE LATENCY
            // --------------------------

            if (
                scenario ===
                "variable-latency"
            ) {
                await wait(
                    page % 2 === 0
                        ? 200
                        : 1200
                );
            }


            // --------------------------
            // HISTORY ERROR
            // --------------------------

            if (
                scenario ===
                    "history-error" ||
                scenario ===
                    "server-error"
            ) {
                return HttpResponse.json(
                    {
                        error:
                            "History unavailable"
                    },
                    {
                        status: 500
                    }
                );
            }


            // --------------------------
            // CONNECTION ERROR
            // --------------------------

            if (
                scenario ===
                "connection-error"
            ) {
                return HttpResponse.error();
            }


            // --------------------------
            // EMPTY
            // --------------------------

            if (
                scenario ===
                "empty"
            ) {
                return HttpResponse.json({
                    items: [],
                    page,
                    pageSize,
                    totalItems: 0,
                    totalPages: 1
                });
            }


            // --------------------------
            // LOAD MATCHES
            // --------------------------

            const matches =
                loadMatches()
                    .sort(
                        (a, b) => {

                            const dateB =
                                new Date(
                                    b.date
                                ).getTime();

                            const dateA =
                                new Date(
                                    a.date
                                ).getTime();

                            return (
                                dateB -
                                dateA
                            );
                        }
                    );


            // --------------------------
            // PAGINATION
            // --------------------------

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


    // ==================================
    // RANKING
    // ==================================

    http.get(
        "/api/ranking",

        async ({ request }) => {

            const url =
                new URL(
                    request.url
                );


            // IMPORTANTE:
            // page é declarado ANTES
            // de ser usado na latência.

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


            const scenario =
                getNetworkScenario();


            // --------------------------
            // SLOW NETWORK
            // --------------------------

            if (
                scenario ===
                "slow"
            ) {
                await wait(
                    1500
                );
            }


            // --------------------------
            // VARIABLE LATENCY
            // --------------------------

            if (
                scenario ===
                "variable-latency"
            ) {
                await wait(
                    page % 2 === 0
                        ? 200
                        : 1200
                );
            }


            // --------------------------
            // RANKING ERROR
            // --------------------------

            if (
                scenario ===
                    "ranking-error" ||
                scenario ===
                    "server-error"
            ) {
                return HttpResponse.json(
                    {
                        error:
                            "Ranking unavailable"
                    },
                    {
                        status: 500
                    }
                );
            }


            // --------------------------
            // CONNECTION ERROR
            // --------------------------

            if (
                scenario ===
                "connection-error"
            ) {
                return HttpResponse.error();
            }


            // --------------------------
            // EMPTY
            // --------------------------

            if (
                scenario ===
                "empty"
            ) {
                return HttpResponse.json({
                    items: [],
                    page,
                    pageSize,
                    totalItems: 0,
                    totalPages: 1
                });
            }


            // --------------------------
            // SORT RANKING
            // --------------------------

            const matches =
                loadMatches()
                    .sort(
                        (a, b) => {

                            // Maior score primeiro
                            if (
                                b.score !==
                                a.score
                            ) {
                                return (
                                    b.score -
                                    a.score
                                );
                            }


                            // Em caso de empate:
                            // menor duração primeiro

                            return (
                                a.duration -
                                b.duration
                            );
                        }
                    );


            // --------------------------
            // CREATE RANKING ENTRIES
            // --------------------------

            const ranking:
                RankingEntry[] =
                matches.map(
                    (
                        match,
                        index
                    ) => {

                        return {
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
                        };
                    }
                );


            // --------------------------
            // PAGINATION
            // --------------------------

            const start =
                (page - 1) *
                pageSize;


            const items =
                ranking.slice(
                    start,
                    start + pageSize
                );


            return HttpResponse.json({
                items,

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