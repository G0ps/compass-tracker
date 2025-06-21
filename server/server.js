import express from 'express'
import cors from 'cors'
import "dotenv/config"

const app = express();
app.use(cors());
app.use(express.json());

app.get('/' , (req , res) => {
    return res.send("Server Online");
});

app.listen(process.env.PORT , () => {
    console.log("Server Initialised")
    console.log(`http://localhost:${process.env.PORT}`)
});