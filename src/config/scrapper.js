import { chromium } from "playwright";

export async function scrapeWebsite(url) {
  const startTime = Date.now();
  console.log(`[SCRAPER] Starting scrape for URL: ${url}`);

  let browser;

  try {
    console.log("[SCRAPER] Launching Chromium...");
    browser = await chromium.launch({ headless: true });

    console.log("[SCRAPER] Opening new page...");
    const page = await browser.newPage();

    console.log("[SCRAPER] Navigating to URL...");
    await page.goto(url, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });

    console.log("[SCRAPER] Page loaded. Extracting text...");
    const text = await page.evaluate(() => document.body.innerText || "");

    const duration = Date.now() - startTime;
    console.log(
      `[SCRAPER] Scrape completed in ${duration}ms. Extracted ${text.length} characters.`
    );

    return text.slice(0, 8000);
  } catch (error) {
    console.error("[SCRAPER] Scrape failed:", {
      url,
      message: error.message,
      stack: error.stack,
    });

    throw error;  
  } finally {
    if (browser) {
      console.log("[SCRAPER] Closing browser...");
      await browser.close();
    }
  }
}
