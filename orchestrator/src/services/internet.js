import { chromium } from "playwright";

export async function searchWeb(query) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://duckduckgo.com/");
  await page.fill("input[name=q]", query);
  await page.keyboard.press("Enter");
  await page.waitForSelector("#links");
  const links = await page.$$eval("#links a.result__a", (els) =>
    els.slice(0, 5).map((a) => a.href)
  );
  await browser.close();
  return links;
}

export async function navigate(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const html = await page.content();
  await browser.close();
  return html;
}

export async function click(url, selector) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.click(selector);
  const html = await page.content();
  await browser.close();
  return html;
}