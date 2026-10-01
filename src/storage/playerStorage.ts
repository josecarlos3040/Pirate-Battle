const PLAYER_ID_KEY =
    "pirate-battle-player-id";

export function getPlayerId() {
    let id =
        localStorage.getItem(
            PLAYER_ID_KEY
        );

    if (!id) {
        id = crypto.randomUUID();

        localStorage.setItem(
            PLAYER_ID_KEY,
            id
        );
    }

    return id;
}

export const PLAYER_NAME =
    "Player";