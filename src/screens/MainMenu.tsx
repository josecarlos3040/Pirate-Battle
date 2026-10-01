import {
    useState
} from "react";

import type {
    GameResult
} from "../game/core/Game";

import titlePirateBattleUrl
    from "../assets/png/default/ui/menu/title_pirate_battle.png";

import panelMenuUrl
    from "../assets/png/default/ui/menu/panel_menu.png";

import buttonNormalUrl
    from "../assets/png/default/ui/menu/button_primary_normal.png";

import buttonHoverUrl
    from "../assets/png/default/ui/menu/button_primary_hover.png";

import buttonPressedUrl
    from "../assets/png/default/ui/menu/button_primary_pressed.png";


type MainMenuProps = {
    onPlay: () => void;
    onOptions: () => void;
    onRanking: () => void;
    onHistory: () => void;

    lastResult?: GameResult | null;
};


type PirateButtonProps = {
    children: React.ReactNode;
    onClick: () => void;
};


function PirateButton({
    children,
    onClick
}: PirateButtonProps) {

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
            className="pirate-menu-button"

            style={{
                backgroundImage:
                    `url(${image})`
            }}

            onPointerEnter={() =>
                setState(
                    "hover"
                )
            }

            onPointerLeave={() =>
                setState(
                    "normal"
                )
            }

            onPointerDown={() =>
                setState(
                    "pressed"
                )
            }

            onPointerUp={() =>
                setState(
                    "hover"
                )
            }

            onClick={onClick}
        >
            {children}
        </button>
    );
}


export function MainMenu({
    onPlay,
    onOptions,
    onRanking,
    onHistory
}: MainMenuProps) {

    return (
        <main className="pirate-menu-screen">

            <section
                className="pirate-menu-panel"

                style={{
                    backgroundImage:
                        `url(${panelMenuUrl})`
                }}
            >

                <h1 className="sr-only">
                    Pirate Battle
                </h1>
                <img
                    className="pirate-title"
                    src={
                        titlePirateBattleUrl
                    }
                    alt="Pirate Battle"
                />


                <div className="pirate-main-actions">

                    <PirateButton
                        onClick={
                            onPlay
                        }
                    >
                        PLAY
                    </PirateButton>


                    <PirateButton
                        onClick={
                            onOptions
                        }
                    >
                        OPTIONS
                    </PirateButton>

                </div>


                <div className="pirate-secondary-actions">

                    <PirateButton
                        onClick={
                            onRanking
                        }
                    >
                        RANKING
                    </PirateButton>


                    <PirateButton
                        onClick={
                            onHistory
                        }
                    >
                        MATCH HISTORY
                    </PirateButton>

                </div>


                <div className="pirate-instructions">

                    <h2>
                        HOW TO PLAY
                    </h2>


                    <div className="pirate-controls-grid">

                        <span>
                            W
                        </span>

                        <p>
                            Move forward
                        </p>


                        <span>
                            A / D
                        </span>

                        <p>
                            Rotate ship
                        </p>


                        <span>
                            SPACE
                        </span>

                        <p>
                            Fire front cannon
                        </p>


                        <span>
                            Q / E
                        </span>

                        <p>
                            Fire side cannons
                        </p>


                        <span>
                            ESC
                        </span>

                        <p>
                            Pause
                        </p>

                    </div>

                </div>

            </section>

        </main>
    );
}