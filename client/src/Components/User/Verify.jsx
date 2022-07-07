import React from 'react';
import OTPInput, { ResendOTP } from "otp-input-react";
import { UserVerify } from '../../Api/User';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function Verify() {
    const navigate = useNavigate();
    const [OTP, setOTP] = React.useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();
        const res = await UserVerify({
            "otp": OTP,
            "email": localStorage.getItem('email')
        })

        if (res.status === 200) {
            localStorage.setItem('verified', true);
            navigate('/register/create');
        } else {
            alert("Invalid OTP");
        }
    }

    return (
        <>
            <OTPInput value={OTP} onChange={setOTP} autoFocus OTPLength={6} otpType="number" disabled={false} secure />
            <ResendOTP onResendClick={() => console.log("Resend clicked")} />
            <Button
                onClick={handleSubmit}
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Verify OTP
            </Button>

        </>
    );

}