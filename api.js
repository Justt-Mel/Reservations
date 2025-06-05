const express = require('express')
const app = express.Router()
const {
    fetchCustomers,
    fetchRestaurants,
    fetchReservation,
    newCustomer,
    newRestaurant,
    newReservation
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

app.get('/reservations', async (req, res, next) => {
    try {
        res.send(await fetchReservation())
    } catch (error) {
        next(error)
    }
})

app.post('/customers', async (req, res, next)=>{
    try {
        res.send( await newCustomer(req.body))
    } catch (error) {
        next(error)
    }
})

app.post('/restaurants', async (req, res, next)=>{
    try {
        res.send( await newRestaurant(req.body))
    } catch (error) {
        next(error)
    }
})

app.post('/reservations', async (req, res, next)=>{
    try {
        res.send( await newReservation(req.body))
    } catch (error) {
        next(error)
    }
})

module.exports = app