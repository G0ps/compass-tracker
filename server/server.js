import express from 'express'
import cors from 'cors'
import "dotenv/config"

import {connect} from './db/mongoDb.js'
import bookingRouter from './routes/bookingUrls.js';

const app = express();
app.use(cors({
    origin : true
}));
app.use(express.json());

app.get('/' , (req , res) => {
    return res.send("Server Online");
});

app.use('/server' , bookingRouter)

try{
    await connect();

    app.listen(process.env.PORT , () => {
        console.log("Server Initialised")
        console.log(`http://localhost:${process.env.PORT}`)
    });
}catch(error){
    console.log(error.message);
}