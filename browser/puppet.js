import puppeteer from "puppeteer";

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
