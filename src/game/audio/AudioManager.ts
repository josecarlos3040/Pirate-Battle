import cannonFireUrl
    from "../../assets/sounds/cannon_fire_2.wav";

import explosionUrl
    from "../../assets/sounds/ship_explosion_1.wav";

import collisionUrl
    from "../../assets/sounds/ship_collision.wav";

import oceanAmbienceUrl
    from "../../assets/sounds/ocean_ambience_loop.wav";


export class AudioManager {

    private cannon:
        HTMLAudioElement;

    private explosion:
        HTMLAudioElement;

    private collision:
        HTMLAudioElement;

    private ocean:
        HTMLAudioElement;


    constructor() {

        this.cannon =
            new Audio(
                cannonFireUrl
            );

        this.explosion =
            new Audio(
                explosionUrl
            );

        this.collision =
            new Audio(
                collisionUrl
            );

        this.ocean =
            new Audio(
                oceanAmbienceUrl
            );


        // ================================
        // VOLUMES
        // ================================

        this.cannon.volume =
            0.35;

        this.explosion.volume =
            0.5;

        this.collision.volume =
            0.3;

        this.ocean.volume =
            0.18;


        // ================================
        // AMBIENCE
        // ================================

        this.ocean.loop =
            true;
    }


    // ===================================
    // SOUND EFFECT HELPER
    // ===================================

    private playSound(
        audio: HTMLAudioElement
    ) {

        /*
         * Clonamos o Audio para permitir
         * vários efeitos simultâneos.
         *
         * Ex:
         * dois inimigos explodem quase
         * ao mesmo tempo.
         */

        const sound =
            audio.cloneNode(
                true
            ) as HTMLAudioElement;


        sound.volume =
            audio.volume;


        void sound.play().catch(
            () => {
                // Browser pode bloquear áudio
                // antes da primeira interação.
            }
        );
    }


    // ===================================
    // CANNON
    // ===================================

    public playCannon() {

        this.playSound(
            this.cannon
        );
    }


    // ===================================
    // EXPLOSION
    // ===================================

    public playExplosion() {

        this.playSound(
            this.explosion
        );
    }


    // ===================================
    // COLLISION / HIT
    // ===================================

    public playCollision() {

        this.playSound(
            this.collision
        );
    }


    // ===================================
    // OCEAN
    // ===================================

    public startOcean() {

        if (
            !this.ocean.paused
        ) {
            return;
        }


        void this.ocean
            .play()
            .catch(
                () => {

                    /*
                     * Caso o navegador bloqueie
                     * autoplay, tenta novamente
                     * na primeira interação.
                     */

                    const retry =
                        () => {

                            void this.ocean
                                .play()
                                .catch(
                                    () => {}
                                );


                            window.removeEventListener(
                                "pointerdown",
                                retry
                            );

                            window.removeEventListener(
                                "keydown",
                                retry
                            );
                        };


                    window.addEventListener(
                        "pointerdown",
                        retry,
                        {
                            once: true
                        }
                    );


                    window.addEventListener(
                        "keydown",
                        retry,
                        {
                            once: true
                        }
                    );
                }
            );
    }


    public pauseOcean() {

        this.ocean.pause();
    }


    public resumeOcean() {

        void this.ocean
            .play()
            .catch(
                () => {}
            );
    }


    // ===================================
    // DESTROY
    // ===================================

    public destroy() {

        this.ocean.pause();

        this.ocean.currentTime =
            0;


        this.cannon.src =
            "";

        this.explosion.src =
            "";

        this.collision.src =
            "";

        this.ocean.src =
            "";
    }
}