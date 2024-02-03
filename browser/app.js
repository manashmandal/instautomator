import { launchPuppet } from "./puppet";
import selectors from "./selectors";
import credentials from "./credentials";
import { sleep } from "./utils";
import { isViewStoryPrompted, traverseStories } from "./crawling_functions";

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
  await sleep(3000);

  await page.goto(url);

  await sleep(2000);

  // const elements = await page.$$(selectors.storyPageButtonsSelector);

  // for (const element of elements) {
  //   // Perform actions with each element, e.g., get the text content
  //   const text = await page.evaluate((el) => el.textContent, element);
  //   console.log(text);
  // }

  const out = await isViewStoryPrompted(page);

  if (out.exists) {
    await out.element.click();
  }

  await sleep(1000);

  console.log({ url: page.url() });

  // await page.click(selectors.storyNextButtonSelector);
  for await (const storyContent of traverseStories(page)) {
    console.log(storyContent);
  }

  await sleep(5000);
  await page.close();
  await browser.close();
})();
