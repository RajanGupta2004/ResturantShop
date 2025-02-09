import express from 'express'
import { ApiResponse } from '../utility/ApiResponse.js'
import { createVendor, getVendorById, getVendors } from '../controllers/admin.controller.js'

const router = express.Router()



router.post("/vandor" , createVendor )
router.get("/vandors" ,getVendors )
router.get("/vandor/:id" ,getVendorById )





export default router