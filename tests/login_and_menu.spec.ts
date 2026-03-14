import { test, expect } from '@playwright/test';

test.describe('Vela Resort - Authentication and Menu Flow', () => { //Test Scenario

  test.beforeEach(async ({page}) => {
    await page.goto('/login')
    await page.locator('input#email-input').fill('admin@resort.com')
    await page.locator('input#password-input').fill('123456')
    await page.locator('button#login-button').click()
  })

  test('should display login page when accessing the root url', async ({ page }) => {
    // Navigate to root
    await page.goto('/');
    
    // Check redirection to login
    await expect(page).toHaveURL(/.*login/);
    
    // Check login elements
    await expect(page.locator('h1.auth-title')).toHaveText('ยินดีต้อนรับกลับ');
    await expect(page.locator('input#email-input')).toBeVisible();
    await expect(page.locator('input#password-input')).toBeVisible();
    await expect(page.locator('button#login-button')).toBeVisible();
  });

  test('should show error on empty fields', async ({ page }) => {
    await page.goto('/login');
    await page.click('button#login-button');
    
    // Verify required field error
    await expect(page.locator('#error-message')).toHaveText('กรุณากรอกข้อมูลให้ครบถ้วน');
  });

  test('should show error on invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input#email-input', 'user@fake.com');
    await page.fill('input#password-input', 'wrongpassword');
    await page.click('button#login-button');
    
    // Wait for the simulated API call (1 second)
    const errorMessage = page.locator('#error-message');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
    await expect(errorMessage).toHaveText('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
  });

  test('should login successfully and redirect to menu', async ({ page }) => {
    await page.goto('/login');
    
    // Fill correct credentials
    await page.fill('input#email-input', 'admin@resort.com');
    await page.fill('input#password-input', '123456');
    await page.click('button#login-button');
    
    // Wait for redirect to menu and verify URL
    await expect(page).toHaveURL(/.*menu/, { timeout: 5000 });
    
    // Verify elements on menu page
    await expect(page.locator('.title')).toHaveText('รายการที่พักปัจจุบัน');
    await expect(page.locator('.user-name')).toHaveText('คุณแอดมิน');
    
    // Verify properties list is shown
    const properties = page.locator('.property-card');
    await expect(properties).toHaveCount(6);
  });

  test('should be able to logout from menu', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.fill('input#email-input', 'admin@resort.com');
    await page.fill('input#password-input', '123456');
    await page.click('button#login-button');
    await expect(page).toHaveURL(/.*menu/, { timeout: 5000 });
    
    // Click logout
    await page.click('#logout-button');
    
    // Verify redirected back to login
    await expect(page).toHaveURL(/.*login/);
    await expect(page.locator('h1.auth-title')).toBeVisible();
  });

});
