import express from 'express'
import { deliveryLogin, deliverySignUp, UpdateDeliveryUserStatus } from '../controllers/delivery.controller.js'
import { VerifyToken } from '../middleware/Auth.middleware.js'
import { VerifyDeliveryUser } from '../middleware/delivery.middleware.js'

const router = express.Router()



// ---------------Create delivery user---------------------
router.post("/signup" , deliverySignUp )

//-----------------Login delivery user------------------
router.post("/signin" , deliveryLogin )


// ------------UpdateDeliveryUserStatus----------------

router.post("/service" ,VerifyToken,VerifyDeliveryUser,  UpdateDeliveryUserStatus )







export default router