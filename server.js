const OpenAI = require("openai");
const express = require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

console.log(`api es openAI${process.env.OPENAI_API_KEY}`)
console.log(`api es wapi ${process.env.GRAPH_API_TOKEN}`)
console.log(`api es wh ${process.env.WEBHOOK_VERIFY_TOKEN}`)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express()

const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT, business_phone_number_id } = process.env;

app.post("/webhook", async (req, res) => {
  // log incoming messages
  console.log("Incoming webhook message:");
  console.log("------------------------------------------------------------------------------");
  console.log(JSON.stringify(req.body));
  console.log("------------------------------------------------------------------------------");

  // check if the webhook request contains a message
  // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
  const message = req.body.entry?.[0]?.changes[0]?.value?.messages?.[0];

  // check if the incoming message contains text
  // if (message?.type === "text") {
  //   // extract the business number to send the reply from it
  //   const business_phone_number_id =
  //     req.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;

    // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    await axios({
      method: "POST",
      url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
      headers: {
        Authorization: `Bearer ${GRAPH_API_TOKEN}`,
      },
      data: {
        messaging_product: "whatsapp",
        to: message.from,
        text: { body: "Echo: " + message.text.body },
        context: {
          message_id: message.id, // shows the message as a reply to the original user message
        },
      },
    });

    // mark incoming message as read
    // await axios({
    //   method: "POST",
    //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
    //   headers: {
    //     Authorization: `Bearer ${GRAPH_API_TOKEN}`,
    //   },
    //   data: {
    //     messaging_product: "whatsapp",
    //     status: "read",
    //     message_id: message.id,
    //   },
    // });
  // }

  res.sendStatus(200);
});

// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
  console.log("------------------------------------------------------------------------------");
  console.log(req);
  console.log("------------------------------------------------------------------------------");
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  // check the mode and token sent are correct
  if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
    // respond with 200 OK and challenge token from the request
    res.status(200).send(req.query["hub.challenge"]);
    console.log("Webhook verified successfully!");
  } else {
    // respond with '403 Forbidden' if verify tokens do not match
    res.sendStatus(403);
  }
});

app.get("/", (req, res) => {
  res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`);
});
