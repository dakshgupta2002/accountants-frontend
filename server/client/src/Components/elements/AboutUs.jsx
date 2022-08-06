import React from "react";
import Lottie from "react-lottie";
import "../stylesheets/Home.css";
import aboutUs from "../../assets/lottie/team-work.json";
import { Typography, Box } from "@mui/material";

export default function AboutUs() {
  return (
    <div className="section">
      <div>
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: aboutUs,
          }}
          height={400}
          width={400}
        />
      </div>

      <div>
        <Typography variant="h3" component="div" gutterBottom>
          About Our Team
        </Typography>

        <Box>
            
        </Box>
      </div>
    </div>
  );
}
