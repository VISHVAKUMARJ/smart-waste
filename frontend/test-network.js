import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('FAILED REQUEST:', response.url(), response.status());
    }
  });
  
  await page.goto('http://localhost:5173/dashboard', { waitUntil: 'networkidle' });
  await browser.close();
})();
