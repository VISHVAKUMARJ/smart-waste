import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  page.on('response', response => {
    if (response.url().includes('/api/')) {
      console.log('API RESPONSE:', response.url(), response.status());
    }
  });
  
  await page.goto('http://localhost:5173/login');
  await page.fill('input[type="email"]', 'john@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000); // Wait 2 seconds to see what happens
  
  console.log('Current URL:', page.url());
  const content = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML CONTENT:', content.substring(0, 200));
  
  await browser.close();
})();
