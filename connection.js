const {Client}=require('pg')

const client = new Client
({
    host:"localhost",
    user:"postgres",
    port: 5000,
    password: "password",
    dataBase:"postgres"
});
 
module.exports=client;
