const OpenAI = require("openai");
const express = require("express")
require('dotenv').config();

console.log(`api es ${process.env.OPENAI_API_KEY}`)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express()

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