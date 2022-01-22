const dotenv = require('dotenv');
const client =require('./connection.js')
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
app.set('port',process.env.PORT||3000);
app.use(express.json())
dotenv.config();
console.log(process.env.ACCESS_TOKEN_SECRET);


app.listen(3000, ()=>{
    console.log("Server is now listening at port 3000");
}
)
client.connect();

app.get('/',(req,res)=>
{
    client.query('SELECT * FROM users',( err,result)=>
    {
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
}
)

app.get('/profile',(req,res)=>
{
    client.query('SELECT username, followers, following FROM users ',( err,result)=>
    {
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
}
)

const users = [{id:1},
    { email: 'abc@foo.com' }
  ]
app.post('/users', (req, res) => {

        const { email } = req.body;
        const userExists = users.find(u => u.email === email);
        if (userExists) {
          return res.status(400).json({ error: 'User already exists' })
        }
        res.json(req.body);
    const user ={email: email}  
   const accessToken1= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
   res.json({accessToken:accessToken1})
   client.end;
});

app.post('/follow',(req,res)=>
{
    const followers =req.body.followers
    console.log(followers);
    client.query('UPDATE users SET followers=followers+1 WHERE id=$1',[followers],( err,result)=>
    {
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})

app.post('/following',(req,res)=>
{
    const following =req.body.following
    console.log(following);
    client.query('UPDATE users SET following = following+1 WHERE id=$2',[process.env.USER],( err,result)=>
    {
        if(!err){
            res.send(result.rows);
        }
        });
client.end;
     } )


app.post('/unfollow',(req,res)=>
{
    const followers =req.body.followers
    console.log(followers);
    client.query('UPDATE users SET followers=followers-1 WHERE id=$1',[followers],( err,result)=>
    {
        if(!err){
            res.send(result.rows);
        }
    });
    client.end;
})


app.post('/login',(req,res)=>{
   
    const username =req.body.username
    const user ={username: username} 
    process.env.USER= username;
    console.log(user);
    console.log(process.env.USER);
    console.log(process.env.ACCESS_TOKEN_SECRET);
   const accessToken= jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
   res.json({accessToken:accessToken})
   client.end;
})

    app.get('/:id',(request, response) => {
        const id = parseInt(request.params.id)
        const authHeader = request.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == null) return response.sendStatus(401)
      
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err) => {
          if (err) return response.sendStatus(403)
      
        })

        client.query('SELECT * FROM users WHERE id = $1', [id], (error, results) =>
         {
            if(!error){
                response.send(results.rows);
          }
         
        });
      
    client.end;
      })
