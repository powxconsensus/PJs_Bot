const { WebClient } = require("@slack/web-api");
const dotenv = require("dotenv");
const fs = require("fs");
const request = require("request");
dotenv.config({ path: "./.env" });
// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;

// Initialize

const web = new WebClient(token);
let cnt = 13;
var CronJob = require("cron").CronJob;

var job = new CronJob(
  "0 6 * * * *",
  function () {
    const conversationId = process.env.CONVERSATION_ID;
    const dir = "./public/PJs/";
    const files = fs.readdirSync(dir);
    let filepath = `./public/PJs/`;
    let isFound = false;
    for (const file of files) {
      if (file.includes(cnt.toString())) {
        filepath += file;
        isFound = true;
      }
    }
    if (!isFound) return;
    // (async () => {
    //   // Post a message to the channel, and await the result.
    //   // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage
    //   const result = await web.chat.postMessage({
    //     text: "Hello world!",
    //     channel: conversationId,
    //     attachments: [
    //       {
    //         type: "file",
    //         title: {
    //           type: "plain_text",
    //           text: "Please enjoy this photo of a kitten",
    //         },
    //         block_id: "image4",
    //         // image_url: "http://placekitten.com/500/500",
    //         // file
    //         // image_url: fs.createReadStream(filepath),
    //         file: fs.createReadStream(filepath),
    //         alt_text: "An incredibly cute kitten.",
    //       },
    //     ],
    //   });
    //   console.log(fs.createReadStream(filepath));
    //   // The result contains an identifier for the message, `ts`.
    //   console.log(
    //     `Successfully send message ${result.ts} in conversation ${conversationId}`
    //   );
    // })();
    var options = {
      method: "POST",
      url: "https://slack.com/api/files.upload",
      headers: { "cache-control": "no-cache" },
      formData: {
        token: token,
        channels: conversationId,
        file: fs.createReadStream(filepath),
        initial_comment: `Hello everyone, A warm farewell to Varun from PJs! `,
      },
    };

    request(options, function (error, response, body) {
      if (error) throw new Error(error);
      cnt++;
      console.log(
        `Successfully send message ${body.ts} in conversation ${conversationId}`
      );
    });
  },
  null,
  true,
  "Asia/Kolkata"
);
// Use this if the 4th param is default value(false)
job.start();
