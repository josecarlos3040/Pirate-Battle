import {
    test,
    expect
} from "@playwright/test";

test.beforeEach(
    async ({ page }) => {

        await page.addInitScript(
            () => {
                localStorage.clear();
            }
        );

        await page.goto(
            "/",
            {
                waitUntil:
                    "domcontentloaded"
            }
        );
    }
);

test(
    "shows the main menu",
    async ({ page }) => {

        await expect(
            page.getByRole(
                "heading",
                {
                    name:
                        "Pirate Battle"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name: "Play"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name: "Options"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name: "Ranking"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name:
                        "Match History"
                }
            )
        ).toBeVisible();
    }
);