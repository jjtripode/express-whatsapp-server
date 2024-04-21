const OpenAI = require("openai");
const express = require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

console.log(`api es ${process.env.OPENAI_API_KEY}`)
console.log(`api es ${process.env.WHATSAPP_WEBHOOK_TOKEN}`)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express()

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook",(req,res)=>{
  console.log('entro al get');
  let mode=req.query["hub.mode"];
  let challenge=req.query["hub.challenge"];
  let token=req.query["hub.verify_token"];
  console.log('lee request')
   if(mode && token){

       if(mode==="subscribe" && token===process.env.WHATSAPP_WEBHOOK_TOKEN){
   console.log('return 1')
           
        res.status(200).send(challenge);
       }else{
   console.log('return 2')

           res.status(403).send();
       }

   }
   console.log('return 3')
   res.status(403).send();
});

app.post("/webhook",(req,res)=>{ //i want some 

   let body_param=req.body;

   console.log(JSON.stringify(body_param,null,2));

   if(body_param.object){
       console.log("inside body param");
       if(body_param.entry && 
           body_param.entry[0].changes && 
           body_param.entry[0].changes[0].value.messages && 
           body_param.entry[0].changes[0].value.messages[0]  
           ){
              let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
              let from = body_param.entry[0].changes[0].value.messages[0].from; 
              let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

              console.log("phone number "+phon_no_id);
              console.log("from "+from);
              console.log("boady param "+msg_body);
              let token='EAAU6Jo9BgUgBO4ZArt7Cr9BLAHC4H6jBezJq4vLAMNfZB8TOcgkkbkdGd8CIqqAs6XD9o0p83jjf6YoWqXt8Re3Q6GFY2wviUBy66r7NQrSjtGgZAzEKExxQ7H7AAWAYTENJgZCRWxCH9w6DBeM8UGZASBwQPWuZAKHgMJ2fnmdnWxZBclmVdCxGOpeJA4PJAsbTZAVDrTyfZCklB0yLv'
              axios({
                  method:"POST",
                  url:"https://graph.facebook.com/v18.0/"+phon_no_id+"/messages?access_token="+token,
                  data:{
                      messaging_product:"whatsapp",
                      to:from,
                      text:{
                          body:"Hi.. I'm Prasath, your message is "+msg_body
                      }
                  },
                  headers:{
                      "Content-Type":"application/json"
                  }

              });

              res.sendStatus(200);
           }else{
               res.sendStatus(404);
           }

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