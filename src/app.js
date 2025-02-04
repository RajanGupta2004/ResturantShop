import express from 'express'
import adminRoutes from './routes/admin.routes.js'
import vandorRoutes from "./routes/vandor.routes.js"
import shopingRoutes from './routes/shoping.routes.js'

const app = express()



app.use(express.json())

// ------------------load all routes---------------------------
app.use("/admin" , adminRoutes)
app.use("/vandor" , vandorRoutes)
app.use("/shoping" , shopingRoutes)


//-------------------------------------------------------------

 // health check routs
app.get("/" , (req , res)=>{
    return res.status(200).json({message:"server is up and running...."})
})

export {app}

