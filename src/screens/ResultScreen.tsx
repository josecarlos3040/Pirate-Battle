import type {
    GameResult
} from "../game/core/Game";

type ResultScreenProps = {
    result: GameResult;

    onPlayAgain: () => void;
    onMainMenu: () => void;
};

export function ResultScreen({
    result,
    onPlayAgain,
    onMainMenu
}: ResultScreenProps) {
    return (
        <main
            style={{
                textAlign: "center"
            }}
        >
            <h1>
                Match Result
            </h1>

            <p>
                Score: {result.score}
            </p>

            <p>
                Time Played:{" "}
                {Math.floor(
                    result.timePlayed
                )}s
            </p>

            <p>
                End Reason:{" "}
                {result.reason ===
                "death"
                    ? "Ship Destroyed"
                    : "Time Expired"}
            </p>

            <p>
                Session Time:{" "}
                {
                    result.config
                        .sessionTime
                }s
            </p>

            <p>
                Spawn Time:{" "}
                {
                    result.config
                        .enemySpawnTime
                }s
            </p>

            <p>
                Match Registration:
                Pending
            </p>

            <button
                onClick={
                    onPlayAgain
                }
            >
                Play Again
            </button>

            <button
                onClick={
                    onMainMenu
                }
            >
                Main Menu
            </button>
        </main>
    );
}