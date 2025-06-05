const express = require('express')
const app = express()
const {seed, 
       client
      } = require('./resDb')
app.use(express.json())
app.use ('/api', require('./api'))


const init = async () => {
    await client.connect()
    seed()
    const PORT = 3000 
    app.listen(PORT, () => {
        console.log(`connected to ${PORT}`)
    })
}
init()