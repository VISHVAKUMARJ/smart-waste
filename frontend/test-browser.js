import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.error('PAGE ERROR:', error.message));
  
  console.log('Navigating to http://localhost:5173/dashboard');
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  
  const content = await page.evaluate(() => document.body.innerHTML);
  console.log('HTML CONTENT:', content);
  
  await browser.close();
})();
