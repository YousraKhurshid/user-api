const express = require('express')
const app = express()
require('dotenv').config()
const mongoose = require('mongoose')
const port = process.env.SERVER_PORT
const cors = require('cors')
const path = require('path')

// const clientpath = path.join(__dirname,'./Client/dist')
// app.use('/', express.static(clientpath))


app.use(express.json())
app.use(cors())
app.use('/api',require('./user/router'))



// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname,'./Client/dist/index.html'))
// })

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
