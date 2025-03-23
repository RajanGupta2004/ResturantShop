import express from 'express'
import { deliveryLogin, deliverySignUp, EditDeliveryUserProfile, GetDeliverUserProfile, UpdateDeliveryUserStatus } from '../controllers/delivery.controller.js'
import { VerifyToken } from '../middleware/Auth.middleware.js'
import { VerifyDeliveryUser } from '../middleware/delivery.middleware.js'

const router = express.Router()



// ---------------Create delivery user---------------------
router.post("/signup" , deliverySignUp )

//-----------------Login delivery user------------------
router.post("/signin" , deliveryLogin )


// ------------UpdateDeliveryUserStatus----------------

router.post("/service" ,VerifyToken,VerifyDeliveryUser,  UpdateDeliveryUserStatus )




// ------------------------get Deliver User profile-------------------------------

router.get("/profile" , VerifyToken,VerifyDeliveryUser,GetDeliverUserProfile );


//---------------------update delivey user profile------------------------------------

router.patch("/profile" , VerifyToken,VerifyDeliveryUser,EditDeliveryUserProfile );






export default router