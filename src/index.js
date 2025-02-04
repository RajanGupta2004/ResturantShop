import { app } from "./app.js"
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
dotenv.config()



const port = process.env.PORT || 8001


// database connection
connectDB()


app.listen(port , ()=>{
    console.clear()
    console.log(`server is listen on http://localhost:${port}`)
})


