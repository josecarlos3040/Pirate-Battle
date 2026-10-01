import { useState } from "react";

import {
    useMatchHistory
} from "../api/queries";

type MatchHistoryScreenProps = {
    onBack: () => void;
};

export function MatchHistoryScreen({
    onBack
}: MatchHistoryScreenProps) {
    const [page, setPage] =
        useState(1);

    const history =
        useMatchHistory(page);

    return (
        <main>
            <h1>
                Match History
            </h1>

            {history.isLoading && (
                <p>
                    Loading...
                </p>
            )}

            {history.isError && (
                <p>
                    Failed to load history.
                </p>
            )}

            {history.data &&
                history.data.items
                    .length === 0 && (
                    <p>
                        No matches yet.
                    </p>
                )}

            {history.data && (
                <>
                    {history.data.items.map(
                        match => (
                            <article
                                key={
                                    match.id
                                }
                            >
                                <strong>
                                    Score:{" "}
                                    {
                                        match.score
                                    }
                                </strong>

                                <p>
                                    Duration:{" "}
                                    {Math.floor(
                                        match.duration
                                    )}
                                    s
                                </p>

                                <p>
                                    Reason:{" "}
                                    {
                                        match.reason
                                    }
                                </p>

                                <p>
                                    {new Date(
                                        match.date
                                    ).toLocaleString()}
                                </p>
                            </article>
                        )
                    )}

                    <button
                        disabled={
                            page <= 1
                        }
                        onClick={() =>
                            setPage(
                                value =>
                                    value - 1
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
                            history.data
                                .totalPages
                        }
                        onClick={() =>
                            setPage(
                                value =>
                                    value + 1
                            )
                        }
                    >
                        Next
                    </button>
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