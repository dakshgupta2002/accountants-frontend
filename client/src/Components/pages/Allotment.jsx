import React, { useState } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import Header from "../Header";
import "../stylesheets/Allotment.css";

export default function Allotment() {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("2000-01-01");
  const [amountPrice, setAmountPrice] = useState(100000);
  const [downPayment, setDownPayment] = useState(25);
  const [rateInterest, setRateInterest] = useState(12.5);
  const [penalInterest, setPenalInterest] = useState(4);
  const [installmentsNumber, setInstallmentsNumber] = useState(3);
  const [plot, setPlot] = useState("Shop");

  const [paymentsHistory, setPaymentsHistory] = useState([]);

  const addPayment = () => {
    setPaymentsHistory([
      ...paymentsHistory,
      {
        paymentDate: "",
        paymentAmount: "",
      },
    ]);
  };

  return (
    <div className="allotment">
      <Header />
      <h1>Land Allotment Calculator</h1>
      <br />
      <div className="formData">
        <TextField
          label="Username"
          required={true}
          variant="outlined"
          type="text"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())} //no space in username
        />
        <TextField
          label="Date of Allotment"
          variant="outlined"
          type="Date"
          fullWidth
          margin="normal"
          onChange={(e) => setDate(e.target.value)}
          value={date}
        />
        <TextField
          label="Amount Price"
          required={true}
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          value={amountPrice}
          onChange={(e) => setAmountPrice(e.target.value)}
        />
        <TextField
          label="Down Payment (%)"
          required={true}
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          value={downPayment}
          onChange={(e) => setDownPayment(e.target.value)}
        />
        <TextField
          label="Number of Installments"
          required={true}
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          value={installmentsNumber}
          onChange={(e) => setInstallmentsNumber(e.target.value)}
        />
        <TextField
          label="Interest Rate"
          required={true}
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          value={rateInterest}
          onChange={(e) => setRateInterest(e.target.value)}
        />
        <TextField
          label="Penality Rate"
          required={true}
          variant="outlined"
          type="number"
          fullWidth
          margin="normal"
          value={penalInterest}
          onChange={(e) => setPenalInterest(e.target.value)}
        />

        <TextField
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          select
          fullWidth
          margin="normal"
          label="Type of plot"
        >
          <MenuItem key={1} value="Shop">
            {" "}
            Shop{" "}
          </MenuItem>
          <MenuItem key={2} value="Booth">
            {" "}
            Booth{" "}
          </MenuItem>
        </TextField>
      </div>

      <div className="payments">
        {paymentsHistory.map((paymentLog, index) => {
          return (
            <div className="paymentLog" key={index}>
              <span>Payment {index + 1}</span>
              <TextField
                type="date"
                InputLabelProps={{shrink: true}}
                label="Payment Date"
                margin="normal"
                value={paymentLog?.paymentDate}
                onChange={(e) => {
                  let updatedPaymentHistory = paymentsHistory;
                  updatedPaymentHistory[index].paymentDate = e.target.value;
                  console.log(updatedPaymentHistory);
                  setPaymentsHistory(updatedPaymentHistory);
                }}
              />

              <TextField
                type="number"
                InputLabelProps={{shrink: true}}
                label="Payment Amount"
                margin="normal"
                value={paymentLog.paymentAmount}
                onChange={(e) => {
                  let updatedPaymentHistory = paymentsHistory;
                  updatedPaymentHistory[index].paymentAmount = e.target.value;
                  setPaymentsHistory(updatedPaymentHistory);
                  setTimeout( () => {
                    console.log(paymentsHistory);
                  }, 100)
                }}
              />
            </div>
          );
        })}
      </div>

      <Button variant="contained" color="secondary" onClick={addPayment}>
        Add Payment
      </Button>

      <br />

      <button id="submit">Calculate</button>
      <table id="result"></table>
    </div>
  );
}
