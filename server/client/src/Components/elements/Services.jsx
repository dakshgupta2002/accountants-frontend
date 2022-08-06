import React from "react";
import Lottie from "react-lottie";
import "../stylesheets/Home.css";
import services from "../../assets/lottie/tax-vat-gst-sheet.json";
import customerCare from "../../assets/lottie/customer-care.json";
import welcome from "../../assets/images/welcome.svg";

import { Typography, Box, Stack, Paper } from "@mui/material";

export default function Services() {
  const List = ({ children }) => {
    return (
      <Paper
        elevation={2}
        sx={{
          width: "100%",
          height: "fit-content",
          minHeight: "50px",
          color: "#303854",
          padding: '10px'
        }}
      >
        {children}
      </Paper>
    );
  };

  const Content = ({ children }) => {
    return (
      <Box
        sx={{
          width: "90vw",
          maxWidth: "600px"
        }}
      >
        {children}
      </Box>
    );
  };
  return (
    <div>
      <div className="section">
        <div>
          <Typography variant="h3" component="div" gutterBottom>
            Our Services
          </Typography>

          <Content>
            <Stack spacing={2}>
              <List>Item 1</List>
              <List>Item 2</List>
              <List>Item 3</List>
            </Stack>
          </Content>
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

          <Content>
            <Stack spacing={2}>
              <List>
                Evaluation of your business by professionals at their work.
              </List>
              <List>Item 2</List>
              <List>Item 3</List>
            </Stack>
          </Content>
        </div>
      </div>

      <div className="section">
        <div>
          <Typography variant="h3" component="div" gutterBottom>
            Join us today!
          </Typography>

          <Content>
            <Stack spacing={2}>
              <List>Prices lower than the most.</List>
              <List>Transparency at every step of our work.</List>
              <List>Item 3</List>
            </Stack>
          </Content>
        </div>
        <div>
          <img alt="welcome" src={welcome} height={400} width={400} />
        </div>
      </div>
    </div>
  );
}
