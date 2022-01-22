const {Client}=require('pg')

const client = new Client
({
    host:"localhost",
    user:"postgres",
    port: 5000,
    password: "Isha@123",
    dataBase:"postgres"
});
 
module.exports=client;