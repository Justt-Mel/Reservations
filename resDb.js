const pg = require('pg')
const client = new pg.Client('postgres://artma:postgres@localhost/reservations')
const {v4} = require('uuid')
const uuidv4 = v4

const newCustomer = async (customer)=>{
    const SQL = `
    INSERT INTO customers (id, name)
    VALUES ($1, $2)
    RETURNING *
    `
    const response = await client .query(SQL, [uuidv4(), customer.name])
    return response.rows[0]
}

const fetchCustomers = async () =>{
    const SQL = `
    SELECT *
    FROM customers
    `
    const response = await client.query(SQL)
    return response.rows
}

const newRestaurant = async (restaurant)=> {
    const SQL = `
    INSERT INTO restaurants (id,name)
    VALUES ($1, $2)
    RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), restaurant.name])
    return response.rows[0]
}

const fetchRestaurants = async () =>{
    const SQL =`
    SELECT *
    FROM restaurants
    `
    const response = await client.query(SQL)
    return response.rows
}

const newReservation = async (reservation) =>{
    const SQL = `
    INSERT INTO reservations (id, customers_id, restaurants_id,party_size)
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `
    const response = await client.query(SQL, [uuidv4(), reservation.customers_id, reservation.restaurants_id, reservation.party_size])
    return response.rows[0]
}

const seed =async ()=>{
    const SQL =`
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS customers;

    CREATE TABLE customers(
    id  UUID PRIMARY KEY,
    name VARCHAR(100)
    );
    CREATE TABLE restaurants(
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE
    );
    CREATE TABLE reservations(
    id UUID PRIMARY KEY, 
    customers_id UUID REFERENCES customers(id) NOT NULL,
    restaurants_id UUID REFERENCES restaurants(id) NOT NULL,
    party_size INT,
    created_at TIMESTAMP DEFAULT now()
    );
    `
    await client.query(SQL)
    console.log("TABLES CREATED")
    const [Josh, Cassandra, Melissa, Pedro, Tom] = await Promise.all([
        newCustomer({name:'Josh'}),
        newCustomer({name:'Cassandra'}),
        newCustomer({name:'Melissa'}),
        newCustomer({name:'Pedro'}),
        newCustomer({name:'Tom'})
    ])

    const [pizzaSpot, Meraluna, Vincenzo, JinRamen, jacobsPickle] = await Promise.all([
        newRestaurant({name:'Pizza Spot'}),
        newRestaurant({name:'Meraluna'}),
        newRestaurant({name:'Vincenzo'}),
        newRestaurant({name:'Jin Ramen'}),
        newRestaurant({name:'jacobs Pickle'})
    ])

    await Promise.all([
        newReservation({customers_id: Cassandra.id, restaurants_id: pizzaSpot.id, party_size: 4}),
        newReservation({customers_id: Pedro.id, restaurants_id: jacobsPickle.id, party_size: 3}),
        newReservation({customers_id: Josh.id, restaurants_id: JinRamen.id, party_size: 5}),
        newReservation({customers_id: Melissa.id, restaurants_id: Meraluna.id, party_size: 1}),
        newReservation({customers_id: Tom.id, restaurants_id: Vincenzo.id, party_size: 7})
    ])

    console.log("table seeded")

}
module.exports ={
    seed,
    client,
    fetchCustomers,
    fetchRestaurants
}