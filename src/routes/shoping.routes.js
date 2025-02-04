import express from 'express'
import { GetFoodAvailibility, GetFoodIn30Min, GetSearchFood, GetTopResturant, ResturantById } from '../controllers/shoping.controller.js'


const router = express.Router()



// -------------------food availibility-----------------

router.get("/:pincode" , GetFoodAvailibility)
// ------------------------------------------------------


// -------------------Top resturant-----------------

router.get("/top-resturant/:pincode" , GetTopResturant)
// ------------------------------------------------------


// -------------------food in 30 min-----------------

router.get("/food-in-30-min/:pincode" , GetFoodIn30Min)
// ------------------------------------------------------



// -------------------search food-----------------

router.get("/serach/:pincode" , GetSearchFood)
// ------------------------------------------------------


// -------------------Find resturant by Id------------

router.get("/resturant/:id" , ResturantById)
// ------------------------------------------------------



export default router