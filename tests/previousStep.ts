import { expect , Page } from "@playwright/test";

export const verifyLoginPage = async ({page}: {page: Page}) => {
    await page.goto('/login')
    await page.locator('input#email-input').fill('admin@resort.com')
    await page.locator('input#password-input').fill('123456')
    await page.locator('button#login-button').click()
}