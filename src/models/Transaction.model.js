import mongoose from 'mongoose';



const TransactionSchema = new mongoose.Schema(
  {
    customer: {
      type: String,
      required: true,
    },
    vendorId: {
      type: String,
    //   required: true,
    },
    orderId: {
      type: String,
    //   required: true,
    },
    orderValue: {
      type: Number,
      required: true,
    },
    offerUsed: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMode: {
      type: String,
      required: true,
    },
    paymentResponse: {
      type: String,
      default: '',
    },
  },

);

const Transaction = mongoose.model('Transaction', TransactionSchema);

export default Transaction 
