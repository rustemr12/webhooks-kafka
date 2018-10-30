const express = require('express')
const app = express()
const bodyParser = require('body-parser');

// respond with "hello world" when a GET request is made to the homepage
app.use(bodyParser.json())
app.post('/', function (req, res) {
  console.log(req.body)
  res.send('test')
})

app.listen(3005, () => console.log('Example app listening on port 3000!'))
