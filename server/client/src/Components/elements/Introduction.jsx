import React from "react";
import Lottie from "react-lottie";
import "../stylesheets/Home.css";
import introduction from "../../assets/lottie/tax-calculator.json";
import { Typography, Box } from "@mui/material";

export default function Introduction() {
  return (
    <div className="section">
      <div>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: introduction,
          }}
          height={400}
          width={400}
        />
      </div>

      <div>
        <Typography variant="h3" component="div" gutterBottom>
          The Accountants
        </Typography>

        <Box>

        </Box>
      </div>
    </div>
  );
}
