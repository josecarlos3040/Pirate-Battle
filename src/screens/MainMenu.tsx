import {
    useState
} from "react";

import type {
    GameResult
} from "../game/core/Game";

type MainMenuProps = {
    onPlay: () => void;
    onOptions: () => void;

    lastResult:
        GameResult | null;
};

export function MainMenu({
    onPlay,
    onOptions,
    lastResult
}: MainMenuProps) {
    const [tab, setTab] =
        useState<
            "ranking" |
            "history" |
            null
        >(null);

    return (
        <main
            style={{
                width: "100vw",
                minHeight: "100vh",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                background:
                    "#168bc2",

                color: "white"
            }}
        >
            <div
                style={{
                    width: "420px",
                    textAlign: "center"
                }}
            >
                <h1>
                    Pirate Battle
                </h1>

                <button
                    onClick={onPlay}
                >
                    Play
                </button>

                <button
                    onClick={onOptions}
                >
                    Options
                </button>

                <hr />

                <h2>Controls</h2>

                <p>
                    W — Move Forward
                </p>

                <p>
                    A / D — Rotate
                </p>

                <p>
                    Space — Front Cannon
                </p>

                <p>
                    Q / E — Side Cannons
                </p>

                <p>
                    ESC — Pause
                </p>

                <hr />

                <button
                    onClick={() =>
                        setTab("ranking")
                    }
                >
                    Ranking
                </button>

                <button
                    onClick={() =>
                        setTab("history")
                    }
                >
                    Match History
                </button>

                {tab === "ranking" && (
                    <p>
                        Ranking integration
                        coming next.
                    </p>
                )}

                {tab === "history" && (
                    <p>
                        Match History
                        integration coming
                        next.
                    </p>
                )}

                {lastResult && (
                    <>
                        <hr />

                        <h3>
                            Last Match
                        </h3>

                        <p>
                            Score:{" "}
                            {
                                lastResult
                                    .score
                            }
                        </p>
                    </>
                )}
            </div>
        </main>
    );
}