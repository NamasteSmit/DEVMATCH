const express = require("express");
const router = express.Router();
const userAuth = require("../middlewares/auth");
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");

const memberShipType = {
  premium: 700,
  plus: 900,
};

router.post("/create-order", userAuth, async (req, res) => {
  const { MemberShipType } = req.body;
  console.log(MemberShipType)
  try {
    const options = {
      amount: memberShipType[MemberShipType] * 100, // ₹500 ---> in paise (500 * 100)
      currency: "INR",
      receipt: "receipt_order_1",
      notes: {
        //meta data that you want to attach with your payemnt
        firstname: "smit", // userAuth middleware se ayega
        lastname: "patel", // userAuth middleware se ayega
        memberShipType: MemberShipType,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    //you can save it in database

    const payment = await Payment.create({
      user: req.user._id,
      razorpay_order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      receipt: order.receipt,
      notes: order.notes,
    });

    //return response
    res.status(200).json({
      success: true,
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
});

router.post("/webhook", async (req, res) => {
  try {
    const webhookSignature = req.headers["x-razorpay-signature"];

    // Validate signature
    validateWebhookSignature(
      req.body, // raw body
      webhookSignature,
      "devTinder123",
    );

    if(!validateWebhookSignature){
        return res.status(400).json({success : false , error : "payment failed"})
    }

    const event = req.body;// req.body.event mein milega

    // Handle events
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;

      await Payment.findOneAndUpdate(
        { razorpay_order_id: paymentEntity.order_id },
        {
          razorpay_payment_id: paymentEntity.id,
          status: "paid",
        },
      );

      console.log("Payment Captured & DB Updated");
    }

    if (event.event === "payment.failed") {
      const paymentEntity = event.payload.payment.entity;

      await Payment.findOneAndUpdate(
        { razorpay_order_id: paymentEntity.order_id },
        {
          status: "failed",
        },
      );

      console.log("Payment Failed Updated");
    }

    res.status(200).json({ status: "ok" });
  } catch (err) {
    console.error("Webhook Error:", err.message);
    res.status(400).json({ error: "Invalid webhook signature" });
  }
});


router.get("/verification" , async(req , res)=>{
     try{
        return res.status(200).json({
            isPremium : true
        })
     }catch(err){
         return res.status(500).json({
            isPremium : false
         })
     }
})

module.exports = router;
