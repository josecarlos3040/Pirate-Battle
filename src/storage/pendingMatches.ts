import type {
    CreateMatchRequest
} from "../api/types";

const PENDING_KEY =
    "pirate-battle-pending-matches";

export function loadPendingMatches():
    CreateMatchRequest[] {
    try {
        const saved =
            localStorage.getItem(
                PENDING_KEY
            );

        if (!saved) {
            return [];
        }

        return JSON.parse(
            saved
        ) as CreateMatchRequest[];
    } catch {
        return [];
    }
}

export function savePendingMatch(
    match: CreateMatchRequest
) {
    const pending =
        loadPendingMatches();

    const alreadyExists =
        pending.some(
            item =>
                item.id === match.id
        );

    if (alreadyExists) {
        return;
    }

    pending.push(match);

    localStorage.setItem(
        PENDING_KEY,
        JSON.stringify(pending)
    );
}

export function removePendingMatch(
    matchId: string
) {
    const pending =
        loadPendingMatches()
            .filter(
                match =>
                    match.id !== matchId
            );

    localStorage.setItem(
        PENDING_KEY,
        JSON.stringify(pending)
    );
}