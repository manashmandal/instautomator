import selectors from "./selectors";

export async function isViewStoryPrompted(page) {
  const buttons = await page.$$(selectors.storyPageButtonsSelector);

  for (const button in buttons) {
    const text = await page.evaluate((el) => el.textContent, button);
    console.log({ text });
    if (text === "View Story") {
      return { exists: true, element: button };
    }
  }

  return { exists: false, element: null };
}
