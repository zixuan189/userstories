require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use('/api', require('./routes/api'))

const port = parseInt(process.env.PORT) || 8080
app.listen(port, () => {})