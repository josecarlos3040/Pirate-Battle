export type NetworkScenario =
    | "success"
    | "empty"
    | "slow"
    | "variable-latency"
    | "ranking-error"
    | "history-error"
    | "server-error"
    | "connection-error"
    | "post-timeout-after-save";

const SCENARIO_KEY =
    "pirate-battle-network-scenario";

export function getNetworkScenario():
    NetworkScenario {
    const value =
        localStorage.getItem(
            SCENARIO_KEY
        );

    switch (value) {
        case "empty":
        case "slow":
        case "variable-latency":
        case "ranking-error":
        case "history-error":
        case "server-error":
        case "connection-error":
        case "post-timeout-after-save":
            return value;

        default:
            return "success";
    }
}

export function setNetworkScenario(
    scenario: NetworkScenario
) {
    localStorage.setItem(
        SCENARIO_KEY,
        scenario
    );
}

export function resetMockData() {
    localStorage.removeItem(
        "pirate-battle-api-matches"
    );

    localStorage.removeItem(
        "pirate-battle-pending-matches"
    );

    localStorage.setItem(
        SCENARIO_KEY,
        "success"
    );
}