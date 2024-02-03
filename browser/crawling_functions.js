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

  // Calculate the center of the viewport
  const centerX = width / 2;
  const centerY = height / 2;

  // Perform a mouse click at the center of the viewport
  await page.mouse.click(centerX, centerY);
}

export async function traverseStories(page) {
  while (page.url().includes("stories")) {
    await page.click(selectors.storyNextButtonSelector);
    sleep(200);
    await clickOnCenterToSeePost(page);
    sleep(1000);
  }
}
