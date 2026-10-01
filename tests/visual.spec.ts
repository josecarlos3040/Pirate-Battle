import {
    test,
    expect
} from "@playwright/test";

test(
    "main menu visual",
    async ({ page }) => {

        await page.goto("/");

        await expect(
            page
        ).toHaveScreenshot(
            "main-menu.png",
            {
                fullPage: true
            }
        );
    }
);