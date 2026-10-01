import {
    test,
    expect
} from "@playwright/test";

test.use({
    viewport: {
        width: 390,
        height: 844
    },

    hasTouch: true,

    isMobile: true
});


test(
    "shows touch controls on mobile",
    async ({ page }) => {

        await page.goto("/");


        await page
            .getByRole(
                "button",
                {
                    name: "Play"
                }
            )
            .click();


        await expect(
            page.getByRole(
                "button",
                {
                    name:
                        "Move forward"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name:
                        "Rotate left"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name:
                        "Fire front cannon"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name:
                        "Pause game"
                }
            )
        ).toBeVisible();
    }
);