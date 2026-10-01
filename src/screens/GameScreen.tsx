import {
    useEffect,
    useState
} from "react";

import {
    GameCanvas
} from "../components/GameCanvas";

import {
    MobileControls
} from "../components/MobileControls";

import type {
    GameResult
} from "../game/core/Game";

import type {
    GameOptions
} from "../game/config/gameOptions";


import panelMenuUrl
    from "../assets/png/default/ui/menu/panel_menu.png";

import buttonNormalUrl
    from "../assets/png/default/ui/menu/button_primary_normal.png";

import buttonHoverUrl
    from "../assets/png/default/ui/menu/button_primary_hover.png";

import buttonPressedUrl
    from "../assets/png/default/ui/menu/button_primary_pressed.png";


type GameScreenProps = {
    options:
        GameOptions;

    onGameOver: (
        result:
            GameResult
    ) => void;

    onMainMenu:
        () => void;
};


type PauseButtonProps = {
    children:
        React.ReactNode;

    onClick:
        () => void;
};


function PauseButton({
    children,
    onClick
}: PauseButtonProps) {

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
            className="pause-menu-button"

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

            onClick={
                onClick
            }
        >
            {children}
        </button>
    );
}


export function GameScreen({
    options,
    onGameOver,
    onMainMenu
}: GameScreenProps) {

    const [
        paused,
        setPaused
    ] = useState(
        false
    );

        useEffect(() => {

        const handleEscape =
            (
                event:
                    KeyboardEvent
            ) => {

                if (
                    event.code !==
                    "Escape"
                ) {
                    return;
                }


                if (event.repeat) {
                    return;
                }


                /*
                * O Game também possui listener
                * de Escape.
                *
                * Como esta tela é montada antes
                * da inicialização assíncrona do
                * Pixi, centralizamos o toggle
                * aqui e impedimos o segundo
                * listener de alternar novamente.
                */
                event.stopImmediatePropagation();


                setPaused(
                    current =>
                        !current
                );
            };


        window.addEventListener(
            "keydown",
            handleEscape
        );


        return () => {

            window.removeEventListener(
                "keydown",
                handleEscape
            );

        };

    }, []);


    return (
        <main className="game-screen">

            <GameCanvas
                options={
                    options
                }

                paused={
                    paused
                }

                onGameOver={
                    onGameOver
                }

                onPauseChange={
                    setPaused
                }
            />


            <MobileControls
                onPause={() =>
                    setPaused(
                        true
                    )
                }
            />


            {paused && (

                <div
                    className="pause-overlay"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="pause-title"
                >

                    <section
                        className="pause-panel"

                        style={{
                            backgroundImage:
                                `url(${panelMenuUrl})`
                        }}
                    >

                        <h1
                            id="pause-title"
                            className="pause-title"
                        >
                            Paused
                        </h1>


                        <p className="pause-subtitle">
                            Ready when you are.
                        </p>


                        <div className="pause-actions">

                            <PauseButton
                                onClick={() =>
                                    setPaused(
                                        false
                                    )
                                }
                            >
                                RESUME
                            </PauseButton>


                            <PauseButton
                                onClick={
                                    onMainMenu
                                }
                            >
                                MAIN MENU
                            </PauseButton>

                        </div>

                    </section>

                </div>

            )}

        </main>
    );
}