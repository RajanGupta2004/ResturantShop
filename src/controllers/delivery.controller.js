import Customer from "../models/customer.model.js";
import Delivery from "../models/delivery.model.js";
import Food from "../models/food.model.js";
import Offer from "../models/offers.model.js";
import Order from "../models/orders.model.js";
import Transaction from "../models/Transaction.model.js";
import { ApiResponse } from "../utility/ApiResponse.js";
import { GenerateOTP, sendOTPOnRequest } from "../utility/notificationUtlity.js";
import { comparePassword, GeneratePassword, GenerateSignature } from "../utility/passwordUtility.js";
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from "uuid";


export const deliverySignUp = async (req, res) => {
    try {

        const { email, password, phone } = req.body;

        if (!email || !password || !phone) {
            return res.status(400).json(new ApiResponse(400, "All filed are required"))
        }

        // find user exist or not
        const customer = await Delivery.findOne({ email: email })

        if (customer) {
            return res.status(400).json(new ApiResponse(400, "Delivery person already exist"))
        }

        // hashed password
        const salt = 10;
        const hashedPassword = await GeneratePassword(password, salt)

        // generate OTP
        const { otp, expiresAt } = GenerateOTP()
        console.log(otp, expiresAt)


        const delivery = await Delivery.create({
            email: email,
            password: hashedPassword,
            phone,
            firstName: "",
            lastName: "",
            address: "",
            otp: otp,
            otp_expiry: expiresAt,
            verified: false,
            lat: 0,
            lng: 0,

        })

        if (!delivery) {
            return res.status(500).json(new ApiResponse(500, "something went wrong to create delivery"))
        }

        // send OTP

        // await sendOTPOnRequest(otp, phone)

        // generate token 
        const payload = {
            _id: delivery._id,
            phone: delivery.phone,
            verified: delivery.verified
        }

        const { accessToken, refreshToken } = await GenerateSignature(payload)

        return res.status(200).json(new ApiResponse(201, "user created", { delivery, accessToken, refreshToken },))

    } catch (error) {
        console.log('Error in  customerSignUp ', error);
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}



export const deliveryLogin = async (req, res) => {
    try {

        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json(new ApiResponse(400, "all filed are required..."))
        }

        // find user exist or not

        const delivery = await Delivery.findOne({ email }).select("-refreshToken")

        if (!delivery) {
            return res.status(404).json(new ApiResponse(404, "delivery person not found"))
        }


        // compare password

        const isPasswordCorrect = await comparePassword(password, delivery.password)

        if (!isPasswordCorrect) {
            return res.status(401).json(new ApiResponse(401, "Invalid email and password..."))
        }


        // generate token
        const payload = {
            _id: delivery._id,
            email: delivery.email,
            verified: delivery.verified
        }
        const { accessToken, refreshToken } = await GenerateSignature(payload)

        // console.log(accessToken, refreshToken)

        delivery.refreshToken = refreshToken

        delivery.save()

        const options = {
            // httpOnly: true,
            // secure: true,
            // sameSite: "Strict", // Helps prevent CSRF attacks,
            // signed: true, // Prevents tampering
        }


        return res.status(200).cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json(new ApiResponse(200, "Login successfull", { delivery, accessToken, refreshToken }))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}



export const refreshToken = async (req, res) => {
    try {
        const incommingRefreshToken = req.cookies?.token || req.headers?.authorization?.split(" ")[1];

        if (!incommingRefreshToken) {
            return res.status(401).json({
                success: false,
                message: "Unauthorised request"
            })
        }

        // verify token or decode

        const decodedToken = jwt.verify(incommingRefreshToken, process.env.JWT_SECRET)
        console.log("decodedToken", decodedToken)

        if (!decodedToken) {
            return res.status(401).json({
                success: false,
                message: "Invalid token "
            })
        }

        // find user based on decoded token 

        const user = await Delivery.findById(decodedToken?._id)
        // console.log("user", user)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid access token.."
            })
        }


        // compare the both token incomming refreshToken and refreshToken store in DB

        if (incommingRefreshToken !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or used"
            })

        }

        // generate new access token

        const payload = {
            _id: user._id,
            email: user.email,
            verified: user.verified
        }
        const { accessToken, refreshToken } = await GenerateSignature(payload)

        // console.log("accessToken", accessToken)
        // console.log("refreshToken", refreshToken)

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict", // Helps prevent CSRF attacks,
            signed: true, // Prevents tampering
        }

        return res.status(200)
            .cookie('accessToken', accessToken, options)
            .cookie('refreshToken', refreshToken, options)
            .json({
                success: true,
                message: "new accesToken generated successfull..."
            })

    } catch (error) {
        console.log("Refresh Token ERROR ", error)

    }
}



export const UpdateDeliveryUserStatus = async (req , res)=>{
    try {

        const deliveryUser = req.user;

        const {lat , lng} = req.body;


        const existingDeliveryUser = await Delivery.findById(deliveryUser._id);

        if(!existingDeliveryUser){
            return res.status(200).json(new ApiResponse(404, "deliveryUser Not found"))
        }

        existingDeliveryUser.isAvailable = !existingDeliveryUser.isAvailable

        if(lat && lng){
            existingDeliveryUser.lat = lat,
            existingDeliveryUser.lng=lng
        }

        await existingDeliveryUser.save()

        return res.status(200).json(new ApiResponse(200, "deliver user service active"));

        
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))
    }
}


export const GetCustomerProfile = async (req, res) => {
    try {
        const customer = req.user

        const customerProfile = await Customer.findById(customer._id)
        if (!customerProfile) {
            return res.status(200).json(new ApiResponse(404, "Customer Not found"))
        }

        return res.status(200).json(new ApiResponse(200, "customer profile", customerProfile));

    } catch (error) {
        console.log("Error in to get user profile", error)
        return res.status(500).json(new ApiResponse(500, "Internal server error ", error.message))

    }
}

export const EditCustomerProfile = async (req, res) => {
    try {
        const { firstName, lastName, address } = req.body;

        const customer = await Customer.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, address },
            { new: true, runValidators: true } // Ensures updated document is returned and validations are applied
        );

        if (!customer) {
            return res.status(404).json(new ApiResponse(404, "Customer not found"));
        }

        return res.status(200).json(new ApiResponse(200, "Profile updated successfully", customer));
    } catch (error) {
        console.error("Error in EditCustomerProfile", error);
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
};












export const getOrders = async (req, res) => {
    try {

        const customerId = req.user._id

        const orders = await Customer.findById(customerId).populate("orders")

        if (!orders) {
            return res.status(404).json(new ApiResponse(404, "Data not found..."))
        }

        return res.status(200).json(new ApiResponse(200, "created order", orders))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));

    }
}



export const getOrderById = async (req, res) => {
    try {
        const orderID = req.params.id;

        const orderData = await Order.findById(orderID).populate("items.food")

        if (!orderData) {
            return res.status(404).json(new ApiResponse(404, "Data not found..."))
        }

        return res.status(200).json(new ApiResponse(200, "Data fetch successfully", orderData))
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));

    }
}




// ---------------------cart functionality----------------------------------

export const AddToCart = async (req, res) => {
    try {

        const { foodId, unit } = req.body;

        if (!foodId || !unit) {
            return res.status(400).json(new ApiResponse(400, "foodId and unit is required...."))
        }

        // find food exist or not

        const food = await Food.findById(foodId)

        if (!food) {
            return res.status(404).json(new ApiResponse(404, "Food is not present..."))
        }

        const customerId = req.user._id

        const existingCustomer = await Customer.findById(customerId).populate("cart.food");;

        if (!existingCustomer) {
            return res.status(404).json(new ApiResponse(404, "Customer Not found"))
        }

        // find food same  exist in cart or not 

        const existingFood = existingCustomer.cart.find((item) => item.food.toString() === foodId);

        if (existingFood) {
            existingCustomer.cart.unit += unit
        } else {
            existingCustomer.cart.push({ food: foodId, unit })
        }

        await existingCustomer.save();

        return res.status(201).json(new ApiResponse(201, "Item added successfully", existingCustomer.cart));

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
}


export const GetCartItem = async (req, res) => {
    try {

        const customerId = req.user._id

        const customer = await Customer.findById(customerId).populate("cart.food");

        if (!customer || customer.cart.length === 0) {
            return res.status(404).json(new ApiResponse(404, "Cart is empty"));
        }

        return res.status(200).json(new ApiResponse(200, "List of All customers....", customer.cart))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
}


export const updateCartItem = async (req, res) => {
    try {
        const { foodId, unit } = req.body;
        const customerId = req.user._id;

        let customer = await Customer.findById(customerId);

        if (!customer) {
            return res.status(404).json(new ApiResponse(404, "Customer not found"));
        }

        const item = customer.cart.find(item => item.food.toString() === foodId);
        if (!item) {
            return res.status(404).json(new ApiResponse(404, "Item not found in cart"));
        }

        item.unit = unit;  // Update the quantity
        await customer.save();

        return res.status(200).json(new ApiResponse(200, "Cart updated", customer.cart));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
};


export const deletedCartItem = async (req, res) => {

    try {

        const customerId = req.user._id;


        const customer = await Customer.findById(customerId).populate("cart.food");

        if (!customer) {
            return res.status(404).json(new ApiResponse(404, "Customer not found"));
        }

        if (customer.cart.length === 0) {
            return res.status(200).json(new ApiResponse(200, "Cart is already empty"));
        }

        await Customer.updateOne({ _id: customerId }, { $set: { cart: [] } });

        return res.status(200).json(new ApiResponse(200, "Cart Item deleted successfully...."))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }

}



export const VerifyOffer = async (req, res) => {
    try {

        const customer = req.user;

        const offerId = req.params.id;

        const existimgCustomer = await Customer.findById(customer._id);

        if (!existimgCustomer) {
            return res.status(404).json(new ApiResponse(400, "Customer not found"));
        }

        if (!offerId) {
            return res.status(400).json(new ApiResponse(400, "OfferId is required"));
        }

        const appliedOffer = await Offer.findById(offerId);

        if (!appliedOffer) {
            return res.status(404).json(new ApiResponse(404, "Offer  not found"));
        }

        if (!appliedOffer.isActive) {
            return res.status(404).json(new ApiResponse(404, "Offer expired..."));
        }

        return res.status(200).json(new ApiResponse(200, "Offer verifyed successfully", appliedOffer))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));

    }
}



export const CreatePayment = async (req, res) => {
    try {
        const customer = req.user;
        const { amount, paymentMode, offerId } = req.body;

        let payableAmount = Number(amount);

        const offer = await Offer.findById(offerId);
        if (offer) {
            payableAmount -= offer.discountValue;
        }

        // Perform payment API call
        let paymentResponse = "Payment cash on delivery";
        let status = "pending";

        if (paymentMode !== "COD") {
            try {
                // Simulate API call for payment processing
                const paymentResult = await PaymentService.processPayment({
                    amount: payableAmount,
                    customerId: customer._id,
                    paymentMode
                });

                paymentResponse = paymentResult.response;
                status = paymentResult.success ? "completed" : "failed";
            } catch (paymentError) {
                return res.status(400).json(new ApiResponse(400, "Payment failed", paymentError.message));
            }
        }

        // Create transaction
        const transaction = await Transaction.create({
            customer: customer._id,
            vendorId: "",
            orderId: "",
            orderValue: payableAmount,
            offerUsed: offerId || "N/A",
            status,
            paymentMode,
            paymentResponse
        });

        return res.status(201).json(new ApiResponse(201, "Payment processed successfully", transaction));
    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));
    }
};




const ValidateTransation = async (txnId) => {
    const currentTransation = await Transaction.findById(txnId);
    if (currentTransation) {
        if (currentTransation.status !== "failed") {
          return  { status: true, currentTransation }

        }
    }

    return { status: false, currentTransation }
}

export const createOrder = async (req, res) => {
    try {

        const { txnId, amount, items } = req.body

        if (!items) {
            return res.status(400).json(new ApiResponse(400, "item data is required"))
        }

        const customerId = req.user._id;

        const customer = await Customer.findById(customerId)

        if (!customer) {
            return res.status(404).json(new ApiResponse(404, "customer doest not exist"))
        }

        const { status, currentTransation } = await ValidateTransation(txnId);

        if (!status) {
            return res.status(404).json({ message: 'Error while Creating Order!' })
        }

        let totalPrice = 0;
        const orderItems = [];
        let vandorId = null;

        // Validate each food item and calculate total price
        for (let item of items) {
            const food = await Food.findById(item._id);
            if (!food) {
                return res.status(404).json(new ApiResponse(404, `Food item with ID ${item._id} not found`));
            }

            // Check if all items belong to the same vendor
            if (!vandorId) {
                vandorId = food.vandorId; // Set vendorId from the first item
            } else if (food.vandorId.toString() !== vandorId.toString()) {
                return res.status(400).json(new ApiResponse(400, "All items must be from the same vendor"));
            }

            totalPrice += food.price * item.unit;

            orderItems.push({
                food: food._id,
                unit: item.unit
            });
        }

        const orderID = uuidv4();

        const newOrder = await Order.create({
            customerId,
            vandorId,
            orderID: orderID,
            items: orderItems,
            totalPrice,
            paidAmount: amount,
            orderDate: new Date(),
            orderStatus: "pending",
            remarks: "",
            readyTime: 45

        })


        if (!newOrder) {
            return res.status(500).json(new ApiResponse(500, "Unable to create order"))
        }

        if (currentTransation) {
            currentTransation.vendorId = vandorId;
            currentTransation.orderId = orderID;
            currentTransation.status = 'completed';

            await currentTransation.save();
        }

        customer.orders.push(newOrder);

        await customer.save();
        return res.status(201).json(new ApiResponse(201, "New order created successfully...", newOrder))

    } catch (error) {
        return res.status(500).json(new ApiResponse(500, "Internal server error", error.message));

    }
}
