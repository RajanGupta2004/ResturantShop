
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const GeneratePassword = async (password, salt) => {

    return await bcrypt.hash(password, salt)

}
export const comparePassword = async (password, hashedPassword) => {

    return await bcrypt.compare(password, hashedPassword)

}


export const GenerateSignature = async (payload) => {

    try {
        const accesstoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" })
        return accesstoken

    } catch (error) {
        console.log("Error ti generate token", error)
        

    }
}




