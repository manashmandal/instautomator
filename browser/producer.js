const faktory = require("faktory-worker");
import config from "./config";
const TASK_SCRAPE_IG_STORIES = "ScrapeInstagramStories";

(async () => {
  const client = await faktory.connect({
    host: config.factoryUrl,
    port: config.factoryPort,
  });
  await client
    .job(TASK_SCRAPE_IG_STORIES, { igUserName: "username", token: "token" })
    .push();
  await client.close(); // reuse client if possible! remember to disconnect!
})().catch((e) => console.error(e));
