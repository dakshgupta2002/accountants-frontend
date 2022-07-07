import React, { useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import Header from "../Header";
import "../stylesheets/Allotment.css";

export default function Allotment() {
  const [username, setUsername] = useState("");
  const [date, setDate] = useState("2000-01-01");
  const [amountPrice, setAmountPrice] = useState(0);
  const [downPayment, setDownPayment] = useState(25);
  const [rateInterest, setRateInterest] = useState(12.5);
  const [penalInterest, setPenalInterest] = useState(4);
  const [installmentsNumber, setInstallmentsNumber] = useState(3);
  const [plot, setPlot] = useState('Shop')

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
          <MenuItem key={1} value="Shop"> Shop </MenuItem>
          <MenuItem key={2} value="Booth"> Booth </MenuItem>
        </TextField>

      </div>


      <div id="payments"></div> <br />
      <button id="addPayment">Add Payment</button>
      <hr />
      <br />
      <button id="submit">Calculate</button>
      <table id="result"></table>
    </div>
  );
}
