const mongoose = require('mongoose')


const PaymentSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    razorpay_order_id: {
      type: String,
      required: true,
    },

    razorpay_payment_id: {
      type: String,
    },

    razorpay_signature: {
      type: String,
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    status: {
      type: String,
      enum: ["created", "attempted", "paid", "failed"],
      default: "created",
    },

    receipt: {
      type: String,
    },

    notes: {
      firstname: String,
      lastname: String,
      membershipType: String,
    },
    
},{timestamps : true})



const Payment = mongoose.model("Payment" , PaymentSchema)

module.exports = Payment;