import {
    useEffect,
    useMemo,
    useState
} from "react";

import type {
    GameResult
} from "../game/core/Game";

import type {
    CreateMatchRequest
} from "../api/types";

import {
    useRegisterMatch
} from "../api/queries";

import {
    getPlayerId,
    PLAYER_NAME
} from "../storage/playerStorage";

import {
    savePendingMatch,
    removePendingMatch
} from "../storage/pendingMatches";


import panelMenuUrl
    from "../assets/png/default/ui/menu/panel_menu.png";

import buttonNormalUrl
    from "../assets/png/default/ui/menu/button_primary_normal.png";

import buttonHoverUrl
    from "../assets/png/default/ui/menu/button_primary_hover.png";

import buttonPressedUrl
    from "../assets/png/default/ui/menu/button_primary_pressed.png";

import waterTileUrl
    from "../assets/png/default/tiles/tile_73.png";


type ResultScreenProps = {
    result:
        GameResult;

    onPlayAgain:
        () => void;

    onMainMenu:
        () => void;
};


type ResultButtonProps = {
    children:
        React.ReactNode;

    onClick:
        () => void;

    disabled?:
        boolean;
};


function ResultButton({
    children,
    onClick,
    disabled = false
}: ResultButtonProps) {

    const [
        state,
        setState
    ] = useState<
        "normal" |
        "hover" |
        "pressed"
    >(
        "normal"
    );


    let image =
        buttonNormalUrl;


    if (
        state === "hover"
    ) {
        image =
            buttonHoverUrl;
    }


    if (
        state === "pressed"
    ) {
        image =
            buttonPressedUrl;
    }


    return (
        <button
            className="result-menu-button"

            disabled={
                disabled
            }

            style={{
                backgroundImage:
                    `url(${image})`
            }}

            onPointerEnter={() => {
                if (!disabled) {
                    setState(
                        "hover"
                    );
                }
            }}

            onPointerLeave={() =>
                setState(
                    "normal"
                )
            }

            onPointerDown={() => {
                if (!disabled) {
                    setState(
                        "pressed"
                    );
                }
            }}

            onPointerUp={() => {
                if (!disabled) {
                    setState(
                        "hover"
                    );
                }
            }}

            onClick={
                onClick
            }
        >
            {children}
        </button>
    );
}


export function ResultScreen({
    result,
    onPlayAgain,
    onMainMenu
}: ResultScreenProps) {

    const registerMatch =
        useRegisterMatch();


    // ====================================
    // MATCH REQUEST
    // ====================================

    const matchRequest =
        useMemo<
            CreateMatchRequest
        >(
            () => ({
                id:
                    result.matchId,

                playerId:
                    getPlayerId(),

                playerName:
                    PLAYER_NAME,

                date:
                    new Date()
                        .toISOString(),

                score:
                    result.score,

                duration:
                    result.timePlayed,

                reason:
                    result.reason,

                config: {
                    ...result.config
                }
            }),

            [
                result.matchId,
                result.score,
                result.timePlayed,
                result.reason,
                result.config
            ]
        );


    // ====================================
    // REGISTER MATCH
    // ====================================

    useEffect(() => {

        savePendingMatch(
            matchRequest
        );


        registerMatch.mutate(
            matchRequest,

            {
                onSuccess:
                    () => {

                        removePendingMatch(
                            matchRequest.id
                        );
                    }
            }
        );

        // A partida deve ser enviada uma
        // única vez quando esta tela abre.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        result.matchId
    ]);


    // ====================================
    // RETRY
    // ====================================

    const retryRegistration =
        () => {

            savePendingMatch(
                matchRequest
            );


            registerMatch.mutate(
                matchRequest,

                {
                    onSuccess:
                        () => {

                            removePendingMatch(
                                matchRequest.id
                            );
                        }
                }
            );
        };


    // ====================================
    // TIME
    // ====================================

    const totalSeconds =
        Math.max(
            0,

            Math.round(
                result.timePlayed
            )
        );


    const minutes =
        Math.floor(
            totalSeconds /
            60
        );


    const seconds =
        totalSeconds %
        60;


    const formattedTime =
        `${minutes
            .toString()
            .padStart(
                2,
                "0"
            )}:${seconds
            .toString()
            .padStart(
                2,
                "0"
            )}`;


    // ====================================
    // REASON
    // ====================================

    const resultReason =
        result.reason === "time"
            ? "TIME UP"
            : "SHIP DESTROYED";


    // ====================================
    // REGISTRATION STATUS
    // ====================================

    let registrationText =
        "SAVING...";


    let registrationClass =
        "saving";


    if (
        registerMatch.isSuccess
    ) {

        registrationText =
            "MATCH SAVED";

        registrationClass =
            "success";
    }


    if (
        registerMatch.isError
    ) {

        registrationText =
            "SAVE FAILED";

        registrationClass =
            "error";
    }


    return (
        <main
            className="result-screen"

            style={{
                backgroundImage:
                    `url(${waterTileUrl})`
            }}
        >

            <section
                className="result-panel"

                style={{
                    backgroundImage:
                        `url(${panelMenuUrl})`
                }}
            >

                <h1 className="result-title">
                    Battle Complete
                </h1>


                <div className="result-score">
                    {result.score}
                </div>


                <div className="result-summary">

                    <span>
                        POINTS
                    </span>


                    <span
                        className="result-summary-separator"
                        aria-hidden="true"
                    >
                        •
                    </span>


                    <span>
                        {formattedTime}
                    </span>


                    <span
                        className="result-summary-separator"
                        aria-hidden="true"
                    >
                        •
                    </span>


                    <span>
                        {resultReason}
                    </span>

                </div>


                <div
                    className={
                        `result-registration ${registrationClass}`
                    }
                    aria-live="polite"
                >
                    {registrationText}
                </div>


                <div className="result-actions">

                    {registerMatch.isError && (

                        <ResultButton
                            onClick={
                                retryRegistration
                            }
                        >
                            RETRY SAVE
                        </ResultButton>

                    )}


                    <ResultButton
                        onClick={
                            onPlayAgain
                        }
                    >
                        PLAY AGAIN
                    </ResultButton>


                    <ResultButton
                        onClick={
                            onMainMenu
                        }
                    >
                        MAIN MENU
                    </ResultButton>

                </div>

            </section>

        </main>
    );
}