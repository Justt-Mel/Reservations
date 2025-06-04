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

const seed =async ()=>{
    const SQL =`
    DROP TABLE IF EXISTS reservations;
    DROP TABLE IF EXISTS restaurants;
    DROP TABLE IF EXISTS customers;

    CREATE TABLE customers(
    id  UUID PRIMARY KEY,
    name VARCHAR(100),
    party_size INT
    );
    CREATE TABLE restaurants(
    id UUID PRIMARY KEY,
    name VARCHAR(100) UNIQUE
    );
    CREATE TABLE reservations(
    id UUID PRIMARY KEY, 
    customers_id UUID REFERENCES customers(id) NOT NULL,
    restaurants_id UUID REFERENCES restaurants(id) NOT NULL,
    created_at TIMESTAMP DEFAULT now()
    );
    `
    await client.query(SQL)
    console.log("TABLES CREATED")
    await Promise.all([
        newCustomer({name:'Josh'}),
        newCustomer({name:'Cassandra'}),
        newCustomer({name:'Melissa'}),
        newCustomer({name:'Pedro'}),
        newCustomer({name:'Tom'})
    ])
    console.log("table seeded")

}
module.exports ={
    seed,
    client
}