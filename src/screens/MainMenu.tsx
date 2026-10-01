import type {
    GameResult
} from "../game/core/Game";

type MainMenuProps = {
    onPlay: () => void;
    onOptions: () => void;
    onRanking: () => void;
    onHistory: () => void;

    lastResult:
        GameResult | null;
};

export function MainMenu({
    onPlay,
    onOptions,
    onRanking,
    onHistory,
    lastResult
}: MainMenuProps) {
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

                <h2>
                    Controls
                </h2>

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
                    onClick={onRanking}
                >
                    Ranking
                </button>

                <button
                    onClick={onHistory}
                >
                    Match History
                </button>

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