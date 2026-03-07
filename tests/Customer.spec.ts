import { test, expect} from '@playwright/test'
import { verifyLoginPage } from './previousStep'

test.describe('Resort Custmoer information', () => {

    test('Display customer list', async ({page}) => {
        await verifyLoginPage({page})
        await page.locator('div.sidebar-item', { hasText: 'ข้อมูลลูกค้า' }).click()
        await expect(page).toHaveURL('/customers')
    })

    
})