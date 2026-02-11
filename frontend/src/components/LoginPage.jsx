import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addUser } from "../redux/userSlice";
import { BASE_URL } from "../utils/constants";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpError, setOtpError] = useState("");

  const [otp, setOtp] = useState(Array(6).fill(""));
  const inputRef = useRef([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await axios.post(
        `${BASE_URL}/api/v1/user/send-otp`,
        { email },
        { withCredentials: true }
      );

      setShowOTP(true);
    } catch (err) {
      setError(err?.response?.data?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setOtpError("");

      const res = await axios.post(
        `${BASE_URL}/api/v1/user/verify-otp`,
        {
          email,
          otp: otp.join(""),
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(addUser(res.data.user)); 
        navigate("/", { replace: true });
      }
    } catch (err) {
      setOtpError(err?.response?.data?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showOTP) inputRef.current[0]?.focus();
  }, [showOTP]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;

    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e,
    index
  ) => {
    if (e.key !== "Backspace") return;

    if (otp[index]) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
    } else if (index > 0) {
      inputRef.current[index - 1]?.focus();
    }
  };

  const isOTPComplete = otp.every((digit) => digit !== "");

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-md rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Login with OTP
        </h2>

  
        <div className="space-y-4">
          <input
            type="email"
            disabled={showOTP}
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />

          {!showOTP && (
            <button
              disabled={!email || loading}
              onClick={handleSendOtp}
              className="w-full py-2 bg-black text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          )}

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>


        {showOTP && (
          <div className="mt-6 space-y-4 text-center">
            <p className="text-sm text-gray-600">
              Enter OTP sent to your email
            </p>

            <div className="flex justify-center gap-3">
              {otp.map((val, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRef.current[index] = el)}
                  value={val}
                  onChange={(e) =>
                    handleChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 border text-center text-xl"
                />
              ))}
            </div>

            {otpError && (
              <p className="text-red-500 text-sm">{otpError}</p>
            )}

            {isOTPComplete && (
              <div className="flex gap-3">
                <button
                  disabled={loading}
                  onClick={handleVerifyOtp}
                  className="flex-1 py-2 bg-black text-white rounded-md"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  disabled={loading}
                  onClick={handleSendOtp}
                  className="flex-1 py-2 border rounded-md"
                >
                  Resend
                </button>
              </div>
            )}
          </div>
        )}

        <p className="text-sm text-center mt-4">
          New here?{" "}
          <Link to="/signup" className="text-violet-500">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
