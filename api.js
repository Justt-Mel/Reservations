const express = require('express')
const app = express.Router()
const {
    fetchCustomers,
    fetchRestaurants
} = require('./resDb')

app.get('/customers', async (req, res, next )=>{
    try {
        res.send(await fetchCustomers())
    } catch (error) {
        next(error)
    }
})

app.get('/restaurants', async (req, res, next) => {
    try {
        res.send(await fetchRestaurants())
    } catch (error) {
        next(error)
    }
})





module.exports = app