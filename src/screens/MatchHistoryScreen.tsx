import {
    useState
} from "react";

import {
    useMatchHistory
} from "../api/queries";

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

import iconLeftUrl
    from "../assets/png/default/ui/controls/icon_turn_left.png";

import iconRightUrl
    from "../assets/png/default/ui/controls/icon_turn_right.png";

import waterTileUrl
    from "../assets/png/default/tiles/tile_73.png";


type MatchHistoryScreenProps = {
    onBack: () => void;
};


type MainButtonProps = {
    text: string;
    onClick: () => void;
};


type PageButtonProps = {
    direction: "left" | "right";
    disabled: boolean;
    onClick: () => void;
};


function MainButton({
    text,
    onClick
}: MainButtonProps) {

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
            className="log-main-button"
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
            {text}
        </button>
    );
}


function PageButton({
    direction,
    disabled,
    onClick
}: PageButtonProps) {

    const [
        state,
        setState
    ] = useState<
        "normal" |
        "hover" |
        "pressed"
    >("normal");


    let image =
        buttonRoundNormalUrl;


    if (
        state === "hover" &&
        !disabled
    ) {
        image =
            buttonRoundHoverUrl;
    }


    if (
        state === "pressed" &&
        !disabled
    ) {
        image =
            buttonRoundPressedUrl;
    }


    const icon =
        direction === "left"
            ? iconLeftUrl
            : iconRightUrl;


    return (
        <button
            type="button"
            className="log-page-button"
            disabled={disabled}
            aria-label={
                direction === "left"
                    ? "Previous page"
                    : "Next page"
            }
            style={{
                backgroundImage:
                    `url(${image})`
            }}
            onPointerEnter={() => {
                if (!disabled) {
                    setState("hover");
                }
            }}
            onPointerLeave={() =>
                setState("normal")
            }
            onPointerDown={() => {
                if (!disabled) {
                    setState("pressed");
                }
            }}
            onPointerUp={() => {
                if (!disabled) {
                    setState("hover");
                }
            }}
            onClick={onClick}
        >
            <img
                src={icon}
                alt=""
            />
        </button>
    );
}


function formatDuration(
    duration: number
) {

    const totalSeconds =
        Math.max(
            0,
            Math.round(duration)
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    return (
        `${minutes
            .toString()
            .padStart(2, "0")}:` +
        `${seconds
            .toString()
            .padStart(2, "0")}`
    );
}


export function MatchHistoryScreen({
    onBack
}: MatchHistoryScreenProps) {

    const [
        page,
        setPage
    ] = useState(1);


    const history =
        useMatchHistory(page);


    return (
        <main
            className="log-screen"
            style={{
                backgroundImage:
                    `url(${waterTileUrl})`
            }}
        >

            <section
                className="log-panel"
                style={{
                    backgroundImage:
                        `url(${panelMenuUrl})`
                }}
            >

                <h1 className="log-title">
                    Match History
                </h1>


                <p className="log-subtitle">
                    CAPTAIN'S LOG
                </p>


                {history.isLoading && (

                    <div className="log-message">
                        Loading history...
                    </div>

                )}


                {history.isError && (

                    <div className="log-message log-error">

                        <p>
                            Failed to load history.
                        </p>


                        <MainButton
                            text="RETRY"
                            onClick={() => {
                                void history.refetch();
                            }}
                        />

                    </div>

                )}


                {history.data &&
                    history.data.items.length === 0 && (

                    <div className="log-message">
                        No matches yet.
                    </div>

                )}


                {history.data &&
                    history.data.items.length > 0 && (

                    <div className="history-list">

                        {history.data.items.map(
                            match => (

                                <article
                                    className="history-row"
                                    key={
                                        match.id
                                    }
                                >

                                    <div className="history-score">

                                        <span>
                                            SCORE
                                        </span>

                                        <strong>
                                            {
                                                match.score
                                            }
                                        </strong>

                                    </div>


                                    <div className="history-info">

                                        <strong>
                                            {
                                                match.reason ===
                                                "time"
                                                    ? "TIME UP"
                                                    : "SHIP DESTROYED"
                                            }
                                        </strong>

                                        <span>
                                            {
                                                new Date(
                                                    match.date
                                                )
                                                    .toLocaleString()
                                            }
                                        </span>

                                    </div>


                                    <div className="history-duration">

                                        <span>
                                            TIME
                                        </span>

                                        <strong>
                                            {
                                                formatDuration(
                                                    match.duration
                                                )
                                            }
                                        </strong>

                                    </div>

                                </article>

                            )
                        )}

                    </div>

                )}


                {history.data && (

                    <div className="log-pagination">

                        <PageButton
                            direction="left"
                            disabled={
                                page <= 1
                            }
                            onClick={() =>
                                setPage(
                                    value =>
                                        value - 1
                                )
                            }
                        />


                        <span>
                            PAGE {page} OF{" "}
                            {
                                history.data
                                    .totalPages
                            }
                        </span>


                        <PageButton
                            direction="right"
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
                        />

                    </div>

                )}


                <div className="log-back-area">

                    <MainButton
                        text="MAIN MENU"
                        onClick={onBack}
                    />

                </div>

            </section>

        </main>
    );
}