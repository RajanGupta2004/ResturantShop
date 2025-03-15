import express from 'express'
import { Addfood, AddOffers, EditOffer, GetCurrentOrder, Getfood, GetOffers, GetOrderDetails, GetVandorProfile, ProcessOrder, UpdateVandorProfile, UpdateVandorService, VandorLogin } from '../controllers/vandor.controller.js'
import { VerifyToken } from '../middleware/Auth.middleware.js'
import { VerifyVendor } from '../middleware/vander.middleware.js'

const router = express.Router()

router.post("/login" ,VandorLogin )
router.get("/profile" , VerifyToken , VerifyVendor ,GetVandorProfile )
router.patch("/profile", VerifyToken,VerifyVendor , UpdateVandorProfile )
router.patch("/service", VerifyToken ,VerifyVendor, UpdateVandorService )

router.post("/food" ,VerifyToken,VerifyVendor, Addfood)
router.get("/food" ,VerifyToken,VerifyVendor, Getfood)


//-----------GetOrderDetails Data----------------
router.get("/GetCurrentOrder" ,VerifyToken,VerifyVendor, GetCurrentOrder)

router.patch('/order/:id/process',VerifyToken,VerifyVendor, ProcessOrder);
router.get('/order/:id',VerifyToken,VerifyVendor, GetOrderDetails)



// -------------------offer routes----------------------------------
router.post('/offers',VerifyToken,VerifyVendor, AddOffers)
router.get('/offers',VerifyToken,VerifyVendor, GetOffers)
router.patch('/offers/:id',VerifyToken,VerifyVendor, EditOffer)






export default router