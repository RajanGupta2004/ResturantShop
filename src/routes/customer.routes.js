import express from 'express'
import { AddToCart, createOrder, CreatePayment, customerLogin, customerSignUp, deletedCartItem, EditCustomerProfile, GetCartItem, GetCustomerProfile, getOrderById, getOrders, refreshToken, updateCartItem, VerifyOffer } from '../controllers/customer.controller.js'
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




// -------------------cart functionality---------------------------------

router.post("/addtoCart" ,VerifyToken ,VerifyCustomer, AddToCart)
router.get("/GetCartItem" ,VerifyToken ,VerifyCustomer, GetCartItem)
router.patch("/updateCartItem" ,VerifyToken ,VerifyCustomer, updateCartItem)
router.delete("/deletedCartItem" ,VerifyToken ,VerifyCustomer, deletedCartItem)



//--------------------------apply  offers---------------------------------
router.get("/offers/verify/:id",VerifyToken ,VerifyCustomer , VerifyOffer)


// ---------------------------create payment oders---------------------

router.post("/payment",VerifyToken ,VerifyCustomer , CreatePayment)


// -------------------- create order----------------------------

router.post("/create-order", VerifyToken ,VerifyCustomer  , createOrder)
router.get("/getorder", VerifyToken ,VerifyCustomer  , getOrders)
router.get("/getorder/:id", VerifyToken ,VerifyCustomer  , getOrderById)




export default router