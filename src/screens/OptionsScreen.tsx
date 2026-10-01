import {
    useState
} from "react";

import type {
    GameOptions
} from "../game/config/gameOptions";

import {
    GAME_OPTION_LIMITS
} from "../game/config/gameOptions";

import {
    getNetworkScenario,
    setNetworkScenario,
    resetMockData
} from "../mocks/networkScenario";

import type {
    NetworkScenario
} from "../mocks/networkScenario";

type OptionsScreenProps = {
    options: GameOptions;

    onSave: (
        options: GameOptions
    ) => void;

    onBack: () => void;
};

export function OptionsScreen({
    options,
    onSave,
    onBack
}: OptionsScreenProps) {

    const [
        networkScenario,
        setScenario
    ] =
        useState<NetworkScenario>(
            () =>
                getNetworkScenario()
        );

    const [
        sessionTime,
        setSessionTime
    ] = useState(
        options.sessionTime
    );

    const [
        enemySpawnTime,
        setEnemySpawnTime
    ] = useState(
        options.enemySpawnTime
    );

    const [error, setError] =
        useState("");

    const save = () => {
        if (
            sessionTime <
                GAME_OPTION_LIMITS
                    .sessionTime.min ||
            sessionTime >
                GAME_OPTION_LIMITS
                    .sessionTime.max
        ) {
            setError(
                "Session time must be between 60 and 180 seconds."
            );

            return;
        }

        if (
            enemySpawnTime <
                GAME_OPTION_LIMITS
                    .enemySpawnTime.min ||
            enemySpawnTime >
                GAME_OPTION_LIMITS
                    .enemySpawnTime.max
        ) {
            setError(
                "Enemy spawn time must be between 1 and 15 seconds."
            );

            return;
        }

        setError("");


        setNetworkScenario(
            networkScenario
        );
        onSave({
            sessionTime,
            enemySpawnTime
        });
    };

    return (
        <main>
            <h1>
                Options
            </h1>

            <div>
                <label>
                    Game Session Time
                </label>

                <input
                    type="number"
                    min={60}
                    max={180}
                    value={
                        sessionTime
                    }
                    onChange={event =>
                        setSessionTime(
                            Number(
                                event.target
                                    .value
                            )
                        )
                    }
                />

                <span>
                    seconds
                </span>
            </div>

            <div>
                <label>
                    Enemy Spawn Time
                </label>

                <input
                    type="number"
                    min={1}
                    max={15}
                    step={0.5}
                    value={
                        enemySpawnTime
                    }
                    onChange={event =>
                        setEnemySpawnTime(
                            Number(
                                event.target
                                    .value
                            )
                        )
                    }
                />

                <span>
                    seconds
                </span>
            </div>

            {error && (
                <p
                    style={{
                        color: "red"
                    }}
                >
                    {error}
                </p>
            )}


            <hr />

            <h2>
                Network Scenario
            </h2>

            <label>
                Mock API scenario
            </label>

            <select
                value={networkScenario}
                onChange={event =>
                    setScenario(
                        event.target
                            .value as NetworkScenario
                    )
                }
            >
                <option value="success">
                    Success
                </option>

                <option value="empty">
                    Empty Lists
                </option>

                <option value="slow">
                    Slow Network
                </option>

                <option value="variable-latency">
                    Variable Latency
                </option>

                <option value="ranking-error">
                    Ranking Error
                </option>

                <option value="history-error">
                    History Error
                </option>

                <option value="server-error">
                    Server Error
                </option>

                <option value="connection-error">
                    Connection Error
                </option>

                <option value="post-timeout-after-save">
                    Timeout After Save
                </option>
            </select>

            <button
                type="button"
                onClick={() => {
                    resetMockData();

                    setScenario(
                        "success"
                    );
                }}
            >
                Reset Mock Data
            </button>
            <button
                onClick={save}
            >
                Save
            </button>

            <button
                onClick={onBack}
            >
                Back
            </button>
        </main>
    );
}