const faktory = require("faktory-worker");
import { constructStoryUrl } from "./utils";
import { authenticatePuppeteerBrowser, launchPuppet } from "./puppet";
import config from "./config";
import { runScraping } from "./crawling_functions";

const TASK_SCRAPE_IG_STORIES = "ScrapeInstagramStories";

async function setupFaktoryWorker() {
  console.log("Initializing resources or setting up connections...");
  const puppet = await launchPuppet();
  authenticatePuppeteerBrowser(puppet);

  faktory.register(TASK_SCRAPE_IG_STORIES, async ({ igUserName, token }) => {
    const storyUrl = constructStoryUrl(igUserName);
    await runScraping(puppet, storyUrl);
  });
}

async function startWorker() {
  await setupFaktoryWorker();

  // Starting the worker after all initialization is done
  const worker = await faktory.work({
    host: config.factoryUrl,
    port: config.factoryPort,
  });
  console.log("Faktory worker started");

  // Graceful shutdown logic (optional)
  process.on("SIGTERM", async () => {
    console.log("Shutting down worker...");
    await worker.stop();
    console.log("Worker shutdown complete.");
  });
}

startWorker().catch((err) => console.error(err));
