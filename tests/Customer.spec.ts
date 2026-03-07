import { test, expect} from '@playwright/test'
import { verifyLoginPage } from './previousStep'

test.describe('Resort Custmoer information', () => {
    
    test.beforeEach(async ({page}) => {
        await verifyLoginPage({page});
        // ให้ไปที่หน้าข้อมูลลูกค้าก่อนเสมอ เนื่องจากแต่ละ test จะได้หน้าใหม่ (Page) แยกกัน
        await page.locator('div.sidebar-item', { hasText: 'ข้อมูลลูกค้า' }).click();
        await expect(page).toHaveURL('/customers');
    })

    test('Display customer list', async ({page}) => {
        // ทดสอบว่าหน้าโหลดเนื้อหาขึ้นมาถูกต้องหรือไม่
        const statusCells = page.locator('table tbody tr td:nth-child(6)');
        const rowCount = await statusCells.count();
        expect(rowCount).toBeGreaterThan(0);
    })

    test('Filter Customer that status active' , async ({page}) => {
        await page.getByRole('button', { name: 'ใช้งาน', exact: true }).click();
        await page.waitForTimeout(1000);

        const statusCells = page.locator('table tbody tr td:nth-child(6)'); 
        const rowCount = await statusCells.count();
        expect(rowCount).toBeGreaterThan(0);

        // วนลูปเช็คว่า "ทุกแถว" ต้องแสดงคำว่า "ใช้งาน"
        for (let i = 0; i < rowCount; i++) {
          await expect(statusCells.nth(i)).toContainText('ใช้งาน');
        }
    });

    test('Filter Customer that status inactive' , async ({page}) => {
        await page.getByRole('button', { name: 'ไม่ใช้งาน', exact: true }).click();
        await page.waitForTimeout(1000);

        const statusCells = page.locator('table tbody tr td:nth-child(6)'); 
        const rowCount = await statusCells.count();
        expect(rowCount).toBeGreaterThan(0);

        // วนลูปเช็คว่า "ทุกแถว" ต้องแสดงคำว่า "ไม่ใช้งาน"
        for (let i = 0; i < rowCount; i++) {
          await expect(statusCells.nth(i)).toContainText('ไม่ใช้งาน');
        }
    });
    
})