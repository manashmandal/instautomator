import selectors from "./selectors";
import { sleep } from "./utils";

export async function isViewStoryPrompted(page) {
  const elements = await page.$$(selectors.storyPageButtonsSelector);

  for (const element of elements) {
    // Perform actions with each element, e.g., get the text content
    const text = await page.evaluate((el) => el.textContent, element);

    if (text.includes("View")) {
      return { exists: true, element: element };
    }
  }

  return { exists: false, element: null };
}

async function clickOnCenterToSeePost(page) {
  const { width, height } = await page.evaluate(() => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  });

  const centerX = width / 2;
  const centerY = height / 2;

  await page.mouse.click(centerX, centerY);

  sleep(300);

  const postUrls = await page.$$(selectors.storyPostUrlSelector);

  let foundPostUrl;

  for (const postUrl of postUrls) {
    const url = await page.evaluate((el) => el.href, postUrl);
    if (url.includes("/p/")) {
      foundPostUrl = url;
    }
  }

  return foundPostUrl;
}

export async function traverseStories(page) {
  while (page.url().includes("stories")) {
    await page.click(selectors.storyNextButtonSelector);
    sleep(200);
    const url = await clickOnCenterToSeePost(page);
    console.log({ url });
    sleep(1000);
  }
}
