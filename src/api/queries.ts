import {
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import {
    createMatch,
    getMatchHistory,
    getRanking
} from "./matches";

export function useRanking(
    page: number
) {
    return useQuery({
        queryKey: [
            "ranking",
            page
        ],

        queryFn: () =>
            getRanking(page),

        placeholderData:
            previousData =>
                previousData
    });
}

export function useMatchHistory(
    page: number
) {
    return useQuery({
        queryKey: [
            "match-history",
            page
        ],

        queryFn: () =>
            getMatchHistory(page),

        placeholderData:
            previousData =>
                previousData
    });
}

export function useRegisterMatch() {
    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn:
            createMatch,

        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: [
                        "ranking"
                    ]
                }),

                queryClient.invalidateQueries({
                    queryKey: [
                        "match-history"
                    ]
                })
            ]);
        }
    });
}