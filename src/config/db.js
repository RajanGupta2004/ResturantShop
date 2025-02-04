
import mongoose from "mongoose"
const connectDB = async ()=>{
    try {
        console.log("MongoDb connection URL:" ,process.env.DB_URI)

        await mongoose.connect(process.env.DB_URI)

        console.log("Database conection successfully....")
        
    } catch (error) {
        console.log("Error in to connect to db" , error)
        
    }
}


export default connectDB