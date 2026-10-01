import {
    defineConfig,
    devices
} from "@playwright/test";

export default defineConfig({
    testDir: "./tests",

    fullyParallel: false,

    workers: 1,

    timeout: 45_000,

    expect: {
        timeout: 10_000
    },

    retries: 0,

    reporter: "html",

    use: {
        baseURL:
            "http://127.0.0.1:5173",

        trace:
            "on-first-retry",

        screenshot:
            "only-on-failure",

        video:
            "retain-on-failure"
    },

    projects: [
        {
            name: "chromium",

            use: {
                ...devices[
                    "Desktop Chrome"
                ]
            }
        }
    ],

    webServer: {
        command:
            "npm run dev -- --host 127.0.0.1",

        url:
            "http://127.0.0.1:5173",

        reuseExistingServer:
            true
    }
});