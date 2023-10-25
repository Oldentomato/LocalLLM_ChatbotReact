const express = require('express')
const app = express()
const port = 5000
const bodyParser = require("body-parser")
const cors = require("cors")

app.use(cors({ origin: "*" }));

app.use(bodyParser.json())
app.use('/api/ai', require('./router/openai'))

app.get('/healthcheck', (req,res)=>{
    res.status(200).json({success:true})
})

app.listen(port,()=> console.log(`Server App listening on port ${port}!`))