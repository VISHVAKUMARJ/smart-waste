import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  console.log('Navigating to login');
  await page.goto('http://localhost:5173/login');
  
  await page.fill('input[type="email"]', 'john@example.com');
  await page.fill('input[type="password"]', 'password');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for network idle...');
  await page.waitForLoadState('networkidle');
  
  console.log('Current URL:', page.url());
  const content = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML CONTENT:', content);
  
  await browser.close();
})();
