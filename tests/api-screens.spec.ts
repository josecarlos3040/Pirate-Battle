import {
    test,
    expect
} from "@playwright/test";

test.beforeEach(
    async ({ page }) => {
        await page.goto("/");

        await page.evaluate(() => {
            localStorage.clear();

            localStorage.setItem(
                "pirate-battle-network-scenario",
                "success"
            );
        });

        await page.reload();
    }
);


test(
    "shows empty ranking",
    async ({ page }) => {

        await page
            .getByRole(
                "button",
                {
                    name: "Ranking"
                }
            )
            .click();


        await expect(
            page.getByRole(
                "heading",
                {
                    name: "Ranking"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByText(
                "No ranking entries."
            )
        ).toBeVisible();
    }
);


test(
    "shows empty match history",
    async ({ page }) => {

        await page
            .getByRole(
                "button",
                {
                    name:
                        "Match History"
                }
            )
            .click();


        await expect(
            page.getByRole(
                "heading",
                {
                    name:
                        "Match History"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByText(
                "No matches yet."
            )
        ).toBeVisible();
    }
);

test(
    "shows ranking error",
    async ({ page }) => {

        await page.evaluate(() => {
            localStorage.setItem(
                "pirate-battle-network-scenario",
                "ranking-error"
            );
        });


        await page
            .getByRole(
                "button",
                {
                    name: "Ranking"
                }
            )
            .click();


        await expect(
            page.getByText(
                "Failed to load ranking."
            )
        ).toBeVisible();
    }
);

test(
    "shows history error",
    async ({ page }) => {

        await page.evaluate(() => {
            localStorage.setItem(
                "pirate-battle-network-scenario",
                "history-error"
            );
        });


        await page
            .getByRole(
                "button",
                {
                    name:
                        "Match History"
                }
            )
            .click();


        await expect(
            page.getByText(
                "Failed to load history."
            )
        ).toBeVisible();
    }
);