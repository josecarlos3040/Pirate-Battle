import { useState } from "react";

import {
    useRanking
} from "../api/queries";

type RankingScreenProps = {
    onBack: () => void;
};

export function RankingScreen({
    onBack
}: RankingScreenProps) {
    const [page, setPage] =
        useState(1);

    const ranking =
        useRanking(page);

    return (
        <main>
            <h1>
                Ranking
            </h1>

            {ranking.isLoading && (
                <p>
                    Loading...
                </p>
            )}

            {ranking.isError && (
                <p>
                    Failed to load ranking.
                </p>
            )}

            {ranking.data &&
                ranking.data.items
                    .length === 0 && (
                    <p>
                        No ranking entries.
                    </p>
                )}

            {ranking.data && (
                <>
                    {ranking.data.items.map(
                        entry => (
                            <div
                                key={
                                    entry.matchId
                                }
                            >
                                <strong>
                                    #
                                    {
                                        entry.position
                                    }
                                </strong>

                                {" — "}

                                {
                                    entry.playerName
                                }

                                {" — "}

                                {
                                    entry.score
                                }{" "}
                                points
                            </div>
                        )
                    )}

                    <div>
                        <button
                            disabled={
                                page <= 1
                            }
                            onClick={() =>
                                setPage(
                                    value =>
                                        value -
                                        1
                                )
                            }
                        >
                            Previous
                        </button>

                        <span>
                            {" "}
                            Page {page}
                            {" "}
                        </span>

                        <button
                            disabled={
                                page >=
                                ranking.data
                                    .totalPages
                            }
                            onClick={() =>
                                setPage(
                                    value =>
                                        value +
                                        1
                                )
                            }
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            <button
                onClick={onBack}
            >
                Back
            </button>
        </main>
    );
}