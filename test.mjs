import puppeteer from "puppeteer"
import path from "path"
const dirname = path.dirname(new URL(import.meta.url).pathname)

const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 1280, height: 720 });
const text = "あいう"
await page.goto(`file://${path.join(dirname.slice(1),"static/index.html?text=" + text)}`);
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshot.png'});

await browser.close();