
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const GeneratePassword = async (password, salt) => {

    return await bcrypt.hash(password, salt)

}
export const comparePassword = async (password, hashedPassword) => {

    return await bcrypt.compare(password, hashedPassword)

}


export const GenerateSignature = async (payload) => {

    try {
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
        const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "4d" })

       return Promise.resolve({ accessToken, refreshToken })

    } catch (error) {
        console.log("Error ti generate token", error)
        

    }
}




