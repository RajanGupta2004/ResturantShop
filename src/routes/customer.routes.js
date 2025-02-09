import express from 'express'
import { customerLogin, customerSignUp } from '../controllers/customer.controller.js'


const router = express.Router()


router.post("/signup" , customerSignUp)
router.post("/login" , customerLogin)


router.post("/profile")
router.post("/update")
router.post("/otp")




export default router