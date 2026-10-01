import {
    test,
    expect
} from "@playwright/test";

test.beforeEach(
    async ({ page }) => {
        await page.goto("/");

        await page.evaluate(() => {
            localStorage.clear();
        });

        await page.reload();
    }
);

test(
    "saves game options",
    async ({ page }) => {

        await page
            .getByRole(
                "button",
                {
                    name: "Options"
                }
            )
            .click();

        const sessionTime =
            page.getByLabel(
                "Game Session Time"
            );

        const spawnTime =
            page.getByLabel(
                "Enemy Spawn Time"
            );

        await sessionTime.fill(
            "90"
        );

        await spawnTime.fill(
            "4"
        );

        await page
            .getByRole(
                "button",
                {
                    name: "Save"
                }
            )
            .click();

        await expect(
            page.getByRole(
                "heading",
                {
                    name:
                        "Pirate Battle"
                }
            )
        ).toBeVisible();

        await page.reload();

        await page
            .getByRole(
                "button",
                {
                    name: "Options"
                }
            )
            .click();

        await expect(
            sessionTime
        ).toHaveValue(
            "90"
        );

        await expect(
            spawnTime
        ).toHaveValue(
            "4"
        );
    }
);

test(
    "rejects invalid session time",
    async ({ page }) => {

        await page
            .getByRole(
                "button",
                {
                    name: "Options"
                }
            )
            .click();

        await page
            .getByLabel(
                "Game Session Time"
            )
            .fill(
                "20"
            );

        await page
            .getByRole(
                "button",
                {
                    name: "Save"
                }
            )
            .click();

        await expect(
            page.getByText(
                "Session time must be between 60 and 180 seconds."
            )
        ).toBeVisible();
    }
);