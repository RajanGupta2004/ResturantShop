import express from 'express'
import cookieParser from 'cookie-parser'
import adminRoutes from './routes/admin.routes.js'
import vandorRoutes from "./routes/vandor.routes.js"
import shopingRoutes from './routes/shoping.routes.js'
import customerRoutes from './routes/customer.routes.js'
import deleveryRoutes from "./routes/deliver.routes.js"

const app = express()



// app level All middleware
app.use(express.json())
app.use(cookieParser({
    
}))

// ------------------load all routes---------------------------
app.use("/admin" , adminRoutes)
app.use("/vandor" , vandorRoutes)
app.use("/shoping" , shopingRoutes)
app.use("/customer" , customerRoutes)
app.use("/delivery" , deleveryRoutes)


//-------------------------------------------------------------

 // health check routs
app.get("/" , (req , res)=>{
    return res.status(200).json({message:"server is up and running...."})
})

export {app}

