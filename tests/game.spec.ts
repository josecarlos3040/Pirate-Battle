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
    "starts a match",
    async ({ page }) => {

        await page
            .getByRole(
                "button",
                {
                    name: "Play"
                }
            )
            .click();


        await expect(
            page.locator(
                "canvas"
            )
        ).toBeVisible();
    }
);


test(
    "pauses with Escape",
    async ({ page }) => {

        await page
            .getByRole(
                "button",
                {
                    name: "Play"
                }
            )
            .click();


        await expect(
            page.locator(
                "canvas"
            )
        ).toBeVisible();


        await page.keyboard.press(
            "Escape"
        );


        await expect(
            page.getByRole(
                "heading",
                {
                    name: "Paused"
                }
            )
        ).toBeVisible();


        await expect(
            page.getByRole(
                "button",
                {
                    name:
                        "Resume"
                }
            )
        ).toBeVisible();
    }
);

test(
    "resumes a paused match",
    async ({ page }) => {

        await page
            .getByRole(
                "button",
                {
                    name: "Play"
                }
            )
            .click();


        // Espera o Pixi/Game estar
        // realmente na tela.
        await expect(
            page.locator(
                "canvas"
            )
        ).toBeVisible();


        // Agora pode pausar.
        await page.keyboard.press(
            "Escape"
        );


        // Confirma que o Pause abriu
        // ANTES de tentar clicar Resume.
        await expect(
            page.getByRole(
                "heading",
                {
                    name: "Paused"
                }
            )
        ).toBeVisible();


        await page
            .getByRole(
                "button",
                {
                    name: "Resume"
                }
            )
            .click();


        await expect(
            page.getByRole(
                "heading",
                {
                    name: "Paused"
                }
            )
        ).not.toBeVisible();


        await expect(
            page.locator(
                "canvas"
            )
        ).toBeVisible();
    }
);