import {
    useEffect,
    useRef
} from "react";

import {
    useRegisterMatch
} from "./queries";

import {
    loadPendingMatches,
    removePendingMatch
} from "../storage/pendingMatches";

export function usePendingMatchRecovery() {
    const registerMatch =
        useRegisterMatch();

    const alreadyTried =
        useRef(false);

    useEffect(() => {
        if (
            alreadyTried.current
        ) {
            return;
        }

        alreadyTried.current = true;

        const pending =
            loadPendingMatches();

        for (
            const match
            of pending
        ) {
            registerMatch.mutate(
                match,
                {
                    onSuccess: () => {
                        removePendingMatch(
                            match.id
                        );
                    }
                }
            );
        }
    }, []);
}