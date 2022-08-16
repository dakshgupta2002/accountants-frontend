import React from "react";
import OTPInput from "otp-input-react";
import { UserVerify } from "../../Api/User";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../stylesheets/Verification.css";

export default function Verify() {
  const navigate = useNavigate();
  const [OTP, setOTP] = React.useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await UserVerify({
      otp: OTP,
      email: localStorage.getItem("email"),
    });

    if (res.status === 200) {
      localStorage.setItem("verified", true);
      navigate("/register/create");
    } else {
      toast.error("OTP did not match. Try again.");
    }
  };

  return (
    <div className="otp">
      <OTPInput
        value={OTP}
        onChange={setOTP}
        autoFocus
        OTPLength={6}
        otpType="number"
        disabled={false}
        separator={<span>-</span>}
        containerStyle={{fontSize: '1rem'}}
        secure
      />
      {/* <ResendOTP onResendClick={() => console.log("Resend clicked")} /> */}
      <Button onClick={handleSubmit} variant="contained" sx={{ mt: 3, mb: 2 }}>
        Verify OTP
      </Button>
    </div>
  );
}
