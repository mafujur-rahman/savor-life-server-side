const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// midleware
app.use(cors())
app.use(express())

app.get('/', (req,res) =>{
    res.send("savor life server is running")
})

app.listen(port, () =>{
    console.log(`server connected: ${port}`);
})