import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
    QueryClient,
    QueryClientProvider
} from "@tanstack/react-query";

import App from "./App";

import "./index.css";

const queryClient =
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: 1,
                staleTime: 10_000
            }
        }
    });

async function enableMocking() {
    const { worker } =
        await import(
            "./mocks/browser"
        );

    await worker.start({
        serviceWorker: {
            url: "/mockServiceWorker.js"
        },

        onUnhandledFrame:
            "warn"
    });
}

enableMocking()
    .then(() => {
        console.log(
            "MSW READY"
        );

        createRoot(
            document.getElementById(
                "root"
            )!
        ).render(
            <StrictMode>
                <QueryClientProvider
                    client={queryClient}
                >
                    <App />
                </QueryClientProvider>
            </StrictMode>
        );
    })
    .catch(error => {
        console.error(
            "MSW FAILED TO START:",
            error
        );
    });