import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import foodRouter from "./routers/food.router.js";
import userRouter from "./routers/user.router.js";
import orderRouter from "./routers/order.router.js"
import uploadRouter from "./routers/upload.router.js"
import mysql from "mysql2"

dotenv.config();
export const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

connection.connect((err)=>{
    if(err){
        console.error(err)
    }else{
        console.log("Mysql Connected")
    }
})


const app = express()
app.use(express.json())
app.use(
    cors({
        credentials: true,
        origin: ["http://localhost:3000"],
    })
)

app.use('/api/foods', foodRouter)
app.use('/api/users', userRouter)
app.use('/api/orders', orderRouter)
app.use('/api/upload', uploadRouter)

const PORT = 5000;
app.listen(PORT, () =>{
    console.log('Listening on port ' + PORT);
})