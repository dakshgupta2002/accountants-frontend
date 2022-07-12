import React from "react";
import Lottie from "react-lottie";
import "../stylesheets/Home.css";
import services from "../../assets/lottie/tax-vat-gst-sheet.json";
import customerCare from "../../assets/lottie/customer-care.json";
import welcome from "../../assets/images/welcome.svg";

import { Typography, Box, Stack, Paper } from "@mui/material";

export default function Services() {
  return (
    <div>
      <div className="section">
        <div>
          <Typography variant="h3" component="div" gutterBottom>
            Our Services
          </Typography>

          <Box>
            <Stack spacing={2}>
              <Paper>Item 1</Paper>
              <Paper>Item 2</Paper>
              <Paper>Item 3</Paper>
            </Stack>
          </Box>
        </div>
        <div>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: services,
            }}
            height={400}
            width={400}
          />
        </div>
      </div>
      <div className="section">
        <div>
          <Lottie
            options={{
              loop: true,
              autoplay: true,
              animationData: customerCare,
            }}
            height={400}
            width={400}
          />
        </div>
        <div>
          <Typography variant="h3" component="div" gutterBottom>
            Ask for help!
          </Typography>

          <Box>
            <Stack spacing={2}>
              <Paper>
                Evaluation of your business by professionals at their work.
              </Paper>
              <Paper>Item 2</Paper>
              <Paper>Item 3</Paper>
            </Stack>
          </Box>
        </div>
      </div>

      <div className="section">
        <div>
          <Typography variant="h3" component="div" gutterBottom>
            Join us today!
          </Typography>

          <Box>
            <Stack spacing={2}>
              <Paper>Prices lower than the most.</Paper>
              <Paper>Transparency at every step of our work.</Paper>
              <Paper>Item 3</Paper>
            </Stack>
          </Box>
        </div>
        <div>
          <img alt="welcome" src={welcome} height={400} width={400} />
        </div>
      </div>
    </div>
  );
}
