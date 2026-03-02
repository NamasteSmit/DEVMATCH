import axios from "axios";
import { BASE_URL, RZP_KEY_ID } from "../utils/constants";
import { useState } from "react";

const Premium = () => {
    const[res , setRes] = useState(false);

    console.log(res)

  const handlePayment = async (type) => {
    console.log("type : :" , type)
    try {
      const data = await axios.post(
        BASE_URL + "/api/v1/payment/create-order",
        {
          MemberShipType: type,
        },
        { withCredentials: true },
      );

      const order = data.data.order;

      // 2️⃣ Razorpay options
      const options = {
        key: RZP_KEY_ID, // rzp_test_xxxxx
        amount: order.amount,
        currency: order.currency,
        name: "DevTinder",
        description: "Membership Payment",
        order_id: order.id,
        prefill :{
            firstname : order.notes.firstname,
            lastname : order.notes.lastname,
            MemberShipType : order.notes.memberShipType
        },

        handler: async function (response) {
          // 3️⃣ Send payment details to backend for verification
          const res = await axios.get(BASE_URL + "/api/v1/payment/verification", response, {
            withCredentials: true,
          });

          setRes(res.data.isPremium)

        },

        theme: {
          color: "#ec4899",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.log("error", err);
    }
  };

  return !res ? (
      <div className="min-h-screen bg-gray-100/20 flex items-center justify-center px-6 py-16">
      <div className="grid md:grid-cols-2 gap-10 max-w-5xl w-full">
        {/* Premium Card */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700 hover:scale-105 transition duration-300">
          <h2 className="text-2xl font-bold text-white mb-4">
            Premium Membership
          </h2>

          <p className="text-gray-400 mb-6">
            Unlock exclusive features to boost your dev connections.
          </p>

          <h3 className="text-4xl font-extrabold text-white mb-6">
            ₹700{" "}
            <span className="text-lg font-medium text-gray-400">/month</span>
          </h3>

          <ul className="space-y-3 text-gray-300 mb-8">
            <li>✅ Unlimited Swipes</li>
            <li>✅ See Who Liked You</li>
            <li>✅ 5 Super Likes / day</li>
            <li>✅ Advanced Filters</li>
          </ul>

          <button
            onClick={() => handlePayment("premium")}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold transition duration-300"
          >
            Pay Now
          </button>
        </div>

        {/* Premium Plus Card */}
        <div className="relative bg-gradient-to-br from-purple-700 to-pink-600 rounded-2xl shadow-2xl p-8 text-white hover:scale-105 transition duration-300">
          {/* Badge */}
          <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full">
            MOST POPULAR
          </span>

          <h2 className="text-2xl font-bold mb-4">Premium Plus 🚀</h2>

          <p className="text-gray-100 mb-6">
            Get maximum visibility and priority matching.
          </p>

          <h3 className="text-4xl font-extrabold mb-6">
            ₹900{" "}
            <span className="text-lg font-medium text-gray-200">/month</span>
          </h3>

          <ul className="space-y-3 mb-8">
            <li>🔥 All Premium Features</li>
            <li>🔥 Unlimited Super Likes</li>
            <li>🔥 Boost Profile 3x/week</li>
            <li>🔥 Priority in Search Results</li>
            <li>🔥 Direct Message Requests</li>
          </ul>

          <button
            onClick={() => handlePayment("plus")}
            className="w-full bg-white text-purple-700 hover:bg-gray-200 py-3 rounded-xl font-semibold transition duration-300"
          >
            Pay Now
          </button>
        </div>
      </div>
    </div>
  ) : <p className="text-sm text-red-500 text-center py-8">You are now a Premium user</p>;
};

export default Premium;
