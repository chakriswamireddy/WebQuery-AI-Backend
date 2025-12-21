 
import { chromium } from "playwright";

export async function scrapeWebsite(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  const text = await page.evaluate(() => document.body.innerText);

  await browser.close();

  return text.slice(0, 8000); // limit tokens
}
