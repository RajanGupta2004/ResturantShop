import express from 'express'
import { Addfood, Getfood, GetVandorProfile, UpdateVandorProfile, UpdateVandorService, VandorLogin } from '../controllers/vandor.controller.js'
import { VerifyToken } from '../middleware/Auth.middleware.js'
import { VerifyVendor } from '../middleware/vander.middleware.js'

const router = express.Router()

router.post("/login" ,VandorLogin )
router.get("/profile" , VerifyToken , VerifyVendor ,GetVandorProfile )
router.patch("/profile", VerifyToken,VerifyVendor , UpdateVandorProfile )
router.patch("/service", VerifyToken ,VerifyVendor, UpdateVandorService )

router.post("/food" ,VerifyToken,VerifyVendor, Addfood)
router.get("/food" ,VerifyToken,VerifyVendor, Getfood)



export default router