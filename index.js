const express = require("express")
const app = express()

app.get('/', (req,res)=>{
    res.end(JSON.stringify({ a: 'pppppcdsac' }));
})

app.listen(3001)
console.log(`on port 3001`)