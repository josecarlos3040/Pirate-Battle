import { useState } from "react";
import type { ReactNode } from "react";

import type { GameOptions } from "../game/config/gameOptions";
import { GAME_OPTION_LIMITS } from "../game/config/gameOptions";

import {
    getNetworkScenario,
    setNetworkScenario,
    resetMockData
} from "../mocks/networkScenario";

import type {
    NetworkScenario
} from "../mocks/networkScenario";


// ========================================
// UI ASSETS
// ========================================

import panelMenuUrl
    from "../assets/png/default/ui/menu/panel_menu.png";

import buttonPrimaryNormalUrl
    from "../assets/png/default/ui/menu/button_primary_normal.png";

import buttonPrimaryHoverUrl
    from "../assets/png/default/ui/menu/button_primary_hover.png";

import buttonPrimaryPressedUrl
    from "../assets/png/default/ui/menu/button_primary_pressed.png";

import buttonRoundNormalUrl
    from "../assets/png/default/ui/controls/button_round_normal.png";

import buttonRoundHoverUrl
    from "../assets/png/default/ui/controls/button_round_hover.png";

import buttonRoundPressedUrl
    from "../assets/png/default/ui/controls/button_round_pressed.png";

import iconPlusUrl
    from "../assets/png/default/ui/controls/icon_plus.png";

import iconMinusUrl
    from "../assets/png/default/ui/controls/icon_minus.png";

import waterTileUrl
    from "../assets/png/default/tiles/tile_73.png";


// ========================================
// TYPES
// ========================================

type OptionsScreenProps = {
    options: GameOptions;

    onSave: (
        options: GameOptions
    ) => void;

    onBack: () => void;
};


type PrimaryButtonProps = {
    children: ReactNode;
    onClick: () => void;
};


type AdjustButtonProps = {
    type: "plus" | "minus";
    onClick: () => void;
    label: string;
};


// ========================================
// PRIMARY BUTTON
// ========================================

function PrimaryButton({
    children,
    onClick
}: PrimaryButtonProps) {

    const [
        state,
        setState
    ] = useState<
        "normal" |
        "hover" |
        "pressed"
    >("normal");


    let image =
        buttonPrimaryNormalUrl;


    if (state === "hover") {
        image =
            buttonPrimaryHoverUrl;
    }


    if (state === "pressed") {
        image =
            buttonPrimaryPressedUrl;
    }


    return (
        <button
            type="button"
            className="options-primary-button"
            style={{
                backgroundImage:
                    `url(${image})`
            }}
            onPointerEnter={() =>
                setState("hover")
            }
            onPointerLeave={() =>
                setState("normal")
            }
            onPointerDown={() =>
                setState("pressed")
            }
            onPointerUp={() =>
                setState("hover")
            }
            onClick={onClick}
        >
            {children}
        </button>
    );
}


// ========================================
// PLUS / MINUS BUTTON
// ========================================

function AdjustButton({
    type,
    onClick,
    label
}: AdjustButtonProps) {

    const [
        state,
        setState
    ] = useState<
        "normal" |
        "hover" |
        "pressed"
    >("normal");


    let buttonImage =
        buttonRoundNormalUrl;


    if (state === "hover") {
        buttonImage =
            buttonRoundHoverUrl;
    }


    if (state === "pressed") {
        buttonImage =
            buttonRoundPressedUrl;
    }


    const icon =
        type === "plus"
            ? iconPlusUrl
            : iconMinusUrl;


    return (
        <button
            type="button"
            className="options-adjust-button"
            aria-label={label}
            style={{
                backgroundImage:
                    `url(${buttonImage})`
            }}
            onPointerEnter={() =>
                setState("hover")
            }
            onPointerLeave={() =>
                setState("normal")
            }
            onPointerDown={() =>
                setState("pressed")
            }
            onPointerUp={() =>
                setState("hover")
            }
            onClick={onClick}
        >
            <img
                src={icon}
                alt=""
            />
        </button>
    );
}


// ========================================
// OPTIONS SCREEN
// ========================================
function isNetworkScenario(
    value: string
): value is NetworkScenario {

    return (
        value === "success" ||
        value === "empty" ||
        value === "slow" ||
        value === "variable-latency" ||
        value === "ranking-error" ||
        value === "history-error" ||
        value === "server-error" ||
        value === "connection-error" ||
        value === "post-timeout-after-save"
    );
}


export function OptionsScreen({
    options,
    onSave,
    onBack
}: OptionsScreenProps) {

    const [
        networkScenario,
        setScenario
    ] = useState<NetworkScenario>(
        () => getNetworkScenario()
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


    const [
        error,
        setError
    ] = useState("");


    // ====================================
    // SESSION TIME
    // ====================================

    const changeSessionTime = (
        amount: number
    ) => {

        setSessionTime(
            current => {

                const next =
                    current + amount;


                return Math.min(
                    GAME_OPTION_LIMITS
                        .sessionTime
                        .max,

                    Math.max(
                        GAME_OPTION_LIMITS
                            .sessionTime
                            .min,

                        next
                    )
                );
            }
        );


        setError("");
    };


    // ====================================
    // SPAWN TIME
    // ====================================

    const changeSpawnTime = (
        amount: number
    ) => {

        setEnemySpawnTime(
            current => {

                const next =
                    current + amount;


                const clamped =
                    Math.min(
                        GAME_OPTION_LIMITS
                            .enemySpawnTime
                            .max,

                        Math.max(
                            GAME_OPTION_LIMITS
                                .enemySpawnTime
                                .min,

                            next
                        )
                    );


                return Math.round(
                    clamped * 10
                ) / 10;
            }
        );


        setError("");
    };


    // ====================================
    // SAVE
    // ====================================

    const save = () => {

        if (
            sessionTime <
                GAME_OPTION_LIMITS
                    .sessionTime
                    .min ||
            sessionTime >
                GAME_OPTION_LIMITS
                    .sessionTime
                    .max
        ) {

            setError(
                "Session time must be between 60 and 180 seconds."
            );

            return;
        }


        if (
            enemySpawnTime <
                GAME_OPTION_LIMITS
                    .enemySpawnTime
                    .min ||
            enemySpawnTime >
                GAME_OPTION_LIMITS
                    .enemySpawnTime
                    .max
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
        <main
            className="options-screen"
            style={{
                backgroundImage:
                    `url(${waterTileUrl})`
            }}
        >

            <section
                className="options-panel"
                style={{
                    backgroundImage:
                        `url(${panelMenuUrl})`
                }}
            >

                <h1 className="options-title">
                    Options
                </h1>


                {/* ======================
                    SESSION TIME
                ====================== */}

                <div className="options-setting">

                    <label htmlFor="session-time">
                        Game Session Time
                    </label>

                    <p className="options-setting-description">
                        Match duration
                    </p>

                    <div className="options-value-control">

                        <AdjustButton
                            type="minus"
                            label="Decrease session time"
                            onClick={() =>
                                changeSessionTime(-10)
                            }
                        />


                        <div className="options-value-box">

                            <input
                                id="session-time"
                                type="number"
                                min={
                                    GAME_OPTION_LIMITS
                                        .sessionTime
                                        .min
                                }
                                max={
                                    GAME_OPTION_LIMITS
                                        .sessionTime
                                        .max
                                }
                                value={
                                    sessionTime
                                }
                                onChange={event => {

                                    setSessionTime(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                    setError("");
                                }}
                            />

                            <span>
                                sec
                            </span>

                        </div>


                        <AdjustButton
                            type="plus"
                            label="Increase session time"
                            onClick={() =>
                                changeSessionTime(10)
                            }
                        />

                    </div>

                </div>


                {/* ======================
                    SPAWN TIME
                ====================== */}

                <div className="options-setting">

                    <label htmlFor="spawn-time">
                        Enemy Spawn Time
                    </label>

                    <p className="options-setting-description">
                        Time between enemy spawns
                    </p>

                    <div className="options-value-control">

                        <AdjustButton
                            type="minus"
                            label="Decrease enemy spawn time"
                            onClick={() =>
                                changeSpawnTime(-0.5)
                            }
                        />


                        <div className="options-value-box">

                            <input
                                id="spawn-time"
                                type="number"
                                min={
                                    GAME_OPTION_LIMITS
                                        .enemySpawnTime
                                        .min
                                }
                                max={
                                    GAME_OPTION_LIMITS
                                        .enemySpawnTime
                                        .max
                                }
                                step={0.5}
                                value={
                                    enemySpawnTime
                                }
                                onChange={event => {

                                    setEnemySpawnTime(
                                        Number(
                                            event.target.value
                                        )
                                    );

                                    setError("");
                                }}
                            />

                            <span>
                                sec
                            </span>

                        </div>


                        <AdjustButton
                            type="plus"
                            label="Increase enemy spawn time"
                            onClick={() =>
                                changeSpawnTime(0.5)
                            }
                        />

                    </div>

                </div>


                {/* ======================
                    ERROR
                ====================== */}

                {error && (

                    <p
                        className="options-error"
                        role="alert"
                    >
                        {error}
                    </p>

                )}


                {/* ======================
                    SAVE / BACK
                ====================== */}

                <div className="options-main-actions">

                    <PrimaryButton
                        onClick={save}
                    >
                        SAVE
                    </PrimaryButton>


                    <PrimaryButton
                        onClick={onBack}
                    >
                        BACK
                    </PrimaryButton>

                </div>


                {/* ======================
                    NETWORK SCENARIO
                ====================== */}

                <div className="options-network">

                    <h2>
                        Network Scenario
                    </h2>

                    <label htmlFor="network-scenario">
                        Mock API Scenario
                    </label>

                    <select
                        id="network-scenario"
                        value={networkScenario}
                        onChange={event => {

                            const value =
                                event.currentTarget.value;

                            if (
                                isNetworkScenario(value)
                            ) {
                                setScenario(value);
                            }
                        }}
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
                        className="options-reset-button"
                        onClick={() => {

                            resetMockData();

                            setScenario(
                                "success"
                            );
                        }}
                    >
                        RESET MOCK DATA
                    </button>

                </div>

            </section>

        </main>
    );
}