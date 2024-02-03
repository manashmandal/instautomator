import puppeteer from "puppeteer";
import credentials from "./credentials";
import config from "./config";
import selectors from "./selectors";

let puppet;

export async function launchPuppet() {
  if (puppet) {
    return puppet;
  }
  puppet = await puppeteer.launch({
    headless: false,
    slowMo: 5,
    defaultViewport: null,
  });
  return puppet;
}

export async function authenticatePuppeteerBrowser(browser) {
  const page = await browser.newPage();
  await page.goto(config.instagramBaseUrl);
  await page.waitForSelector(selectors.usernameSelector);
  await page.type(selectors.usernameSelector, credentials.email);
  await page.type(selectors.passwordSelector, credentials.password);
  await page.click(selectors.loginButtonSelector);
}
