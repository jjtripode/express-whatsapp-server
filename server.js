const OpenAI = require("openai");
const express = require("express")
require('dotenv').config();

console.log(`api es ${process.env.OPENAI_API_KEY}`)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express()

app.get('/webhook', async (req,res)=>{
  console.log(req);
    if (
        req.query['hub.mode'] == 'subscribe' &&
        req.query['hub.verify_token'] == process.env.WHATSAPP_WEBHOOK_TOKEN
    ) {
        res.send(req.query['hub.challenge']);
    } else {
        res.sendStatus(400);
    }
})

app.post("/webhook", (req, res) => {
  let body = req.body;

  if (req.body.object) {
    if (
      req.body.entry &&
      req.body.entry[0].changes &&
      req.body.entry[0].changes[0] &&
      req.body.entry[0].changes[0].value.messages &&
      req.body.entry[0].changes[0].value.messages[0]
    ) {

      // do your stuff here.....

      let phone_number_id =
        req.body.entry[0].changes[0].value.metadata.phone_number_id;
      let from = req.body.entry[0].changes[0].value.messages[0].from; // extract the phone number from the webhook payload
      let msg_body = req.body.entry[0].changes[0].value.messages[0].text.body; // extract the message text from the webhook payload
    }
    res.sendStatus(200);
  } else {
    // Return a '404 Not Found' if event is not from a WhatsApp API
    res.sendStatus(404);
  }
});

app.get('/', async (req,res)=>{
  res.end(JSON.stringify({ a: 'pppppcdsac' }));
})

app.get('/chatgpt', async (req,res)=>{
  const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });
  
  res.end(JSON.stringify({ a: 'pppppcdsac' }));
})

app.listen(3001)
console.log(`on port 3001`)