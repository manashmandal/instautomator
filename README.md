## What can be done better given enough time

1. Handle edge cases, i.e if a profile is private
2. Statistically calculated delay instead of guesses, maybe read config from database
3. Handle errors
4. Retry on error
5. Instead of using Faktory, use a better scalable components like Kafka/Kinesis(AWS Variant)
6. Right now a single instance of browser handles everything, this can be made scalable if we can start as many instances on demand
7. Use cookie persistency for efficient login
8. Graceful shutdown
9. Handle login so that the account doesn't get banned
10. Add caching layer and deduplicate mechanism


### Proposed Architecture 

![architecture](./docs/images/proposed_arch.png)


### How to run

Since my instagram account was blocked halfway (completing the browser and crawling part) I couldn't complete this fully with APIs but I proposed what the project structure will look like.

Python project under `app` is mostly mock and will not work.

* You have to create a `credentials.js` file inside `browser` folder.

The schema is 

```js
export default {
  email: "test",
  password: "test",
};
```

* Then `faktory` service from `docker-compose.yml` run as `docker compose up faktory`
* When `faktory` is running, install the dependencies. Better to use `bun`.
* Run the file `app.js` using `bun app.js` and it will listen for incoming tasks.
* While `app.js` is running you can run `bun producer.js` to produce a task.
* The crawler should be started and will crawl the instagram page of a given `user` in the payload
* No data persistent layer was added so it will just print the html contents

