const mysql = require('mysql2');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSERNAME,
    password: process.env.DBPASSWORD,
    database: process.env.DBNAME,
    port: process.env.DBPORT,
    waitForConnections: true,
    connectionLimit: 10
})

const promisePool = pool.promise();

const testConnection = async ()=> {
    try{
        const connection = await promisePool.getConnection();
        console.log("Database connected successfully");
        connection.release();
    }catch(err){
        console.error("Database connection failed",err);
        process.exit(1);
    }
}

module.exports = {pool: promisePool, testConnection};