import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [ //ระบุว่าให้รันบน Browser อะไรบ้าง
    {
      name: 'chromium', //ชื่อโปรเจค
      use: { ...devices['Desktop Chrome'] }, //Browser ที่จะให้รัน
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    }
  ],
  webServer: { //ระบุว่าให้รัน Server อะไรบ้าง
    command: 'npm run dev', //คำสั่งให้รัน
    url: 'http://localhost:5173', //URL ที่จะให้รัน
    reuseExistingServer: !process.env.CI, //ถ้ามี Server อยู่แล้วให้ใช้ Server นั้น
  },
});
