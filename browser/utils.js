export async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export function constructStoryUrl(username) {
  return `https://www.instagram.com/stories/${username}/`;
}