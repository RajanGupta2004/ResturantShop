import express from 'express'
import { AddToCart, createOrder, customerLogin, customerSignUp, EditCustomerProfile, GetCartItem, GetCustomerProfile, getOrderById, getOrders, refreshToken } from '../controllers/customer.controller.js'
import { VerifyToken } from '../middleware/Auth.middleware.js'
import { VerifyCustomer } from '../middleware/customer.middleware.js'


const router = express.Router()



//--------------customer login----------------------------------------

router.post("/signup" , customerSignUp)
router.post("/login" , customerLogin)
router.post("/refreshToken" , refreshToken)


router.get("/profile" , VerifyToken,VerifyCustomer, GetCustomerProfile)
router.patch("/update" , VerifyToken , VerifyCustomer , EditCustomerProfile)
router.post("/otp")




// -------------------create order---------------------------------

router.post("/addtoCart" ,VerifyToken ,VerifyCustomer, AddToCart)
router.get("/addtoCart" ,VerifyToken ,VerifyCustomer, GetCartItem)

// -------------------- create order----------------------------

router.post("/create-order", VerifyToken ,VerifyCustomer  , createOrder)
router.get("/getorder", VerifyToken ,VerifyCustomer  , getOrders)
router.get("/getorder/:id", VerifyToken ,VerifyCustomer  , getOrderById)




export default router