import express from 'express'
import { Addfood, Getfood, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, VandorLogin } from '../controllers/vandor.controller.js'
import { VerifyToken } from '../middleware/Auth.middleware.js'

const router = express.Router()

router.post("/login" ,VandorLogin )
router.get("/profile" , VerifyToken ,GetVandorProfile )
router.patch("/profile", VerifyToken , UpdateVandorProfile )
router.patch("/service", VerifyToken , UpdateVandorService )

router.post("/food" ,VerifyToken, Addfood)
router.get("/food" ,VerifyToken, Getfood)



export default router