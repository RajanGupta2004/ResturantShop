import express from 'express'
import { createVendor, GetDeliveryUser, getVendorById, getVendors, VerifyDeliveryUserByAdmin } from '../controllers/admin.controller.js'

const router = express.Router()



router.post("/vandor" , createVendor )
router.get("/vandors" ,getVendors )
router.get("/vandor/:id" ,getVendorById )



router.post("/veryfy-delivery-user" ,VerifyDeliveryUserByAdmin )
router.get("/delivery-user" ,GetDeliveryUser )





export default router