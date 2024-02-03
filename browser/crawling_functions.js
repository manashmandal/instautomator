import selectors from "./selectors";
import { sleep } from "./utils";
import { launchPuppet } from "./puppet";
import config from "./config";

export async function isViewStoryPrompted(page) {
  const elements = await page.$$(selectors.storyPageButtonsSelector);

  for (const element of elements) {
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

  sleep(config.shortSleepTimeInMillis);

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

export async function takeExistingStorySnapshot(page) {
  return await page.content();
}

export async function takePostOfStorySnapshotFromUrl(url) {
  const puppet = await launchPuppet();
  let htmlContent;
  const page = await puppet.newPage();
  await page.goto(url);
  await sleep(config.defaultSleepTimeInMillis);
  htmlContent = await page.content();
  await page.close();
  return htmlContent;
}

export async function* traverseStories(page) {
  while (page.url().includes("stories")) {
    await page.click(selectors.storyNextButtonSelector);
    sleep(config.shortSleepTimeInMillis);
    const url = await clickOnCenterToSeePost(page);
    if (url !== undefined && url !== null) {
      yield await takePostOfStorySnapshotFromUrl(url);
    } else {
      yield await takeExistingStorySnapshot(page);
    }
    sleep(config.oneSecondSleepInMillis);
  }
}

export async function runScraping(puppet, url) {
  const page = await puppet.newPage();
  await page.goto(url);

  await sleep(config.defaultSleepTimeInMillis);

  const out = await isViewStoryPrompted(page);

  if (out.exists) {
    await out.element.click();
  }

  await sleep(config.oneSecondSleepInMillis);

  console.log({ url: page.url() });

  try {
    for await (const storyContent of traverseStories(page)) {
      console.log(storyContent.slice(0, 100));
    }
  } catch (e) {
    console.error(e);
  }

  await sleep(config.longSleepTimeInMillis);
  await page.close();
}
