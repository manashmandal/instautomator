import { launchPuppet } from "./puppet";
import selectors from "./selectors";
import credentials from "./credentials";
import { sleep } from "./utils";
import { isViewStoryPrompted, traverseStories } from "./crawling_functions";
import config from "./config";

(async () => {
  const browser = await launchPuppet();

  const page = await browser.newPage();

  await page.goto("https://instagram.com");
  await page.waitForSelector(selectors.usernameSelector);
  await page.type(selectors.usernameSelector, credentials.email);
  await page.type(selectors.passwordSelector, credentials.password);
  await page.click(selectors.loginButtonSelector);

  const url = "https://www.instagram.com/stories/thecumberverse/";
  // await page.click("div[role='button']");
  await sleep(config.defaultSleepTimeInMillis);

  await page.goto(url);

  await sleep(config.defaultSleepTimeInMillis);

  const out = await isViewStoryPrompted(page);

  if (out.exists) {
    await out.element.click();
  }

  await sleep(config.oneSecondSleepInMillis);

  console.log({ url: page.url() });

  // await page.click(selectors.storyNextButtonSelector);
  try {
    for await (const storyContent of traverseStories(page)) {
    }
  } catch (e) {
    console.error(e);
  }

  await sleep(config.longSleepTimeInMillis);
  await page.close();
  await browser.close();
})();
