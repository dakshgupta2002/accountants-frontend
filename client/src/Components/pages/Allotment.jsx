import React, { useState } from "react";
import { TextField, MenuItem, Button } from "@mui/material";
import Header from "../Header";
import "../stylesheets/Allotment.css";
import { seperator, round } from '../../utils/numberFormat'

export default function Allotment() {
  const [username, setUsername] = useState("");
  const [allotmentDate, setAllotmentDate] = useState("2000-01-01");
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

  const resetResult = () => {
    document.getElementById("result").innerHTML = `
    <tr>
        <th>Year</th>
        <th>Principle Amount</th>
        <th>Interest Amount</th>
        <th>Penal Amount</th>
    </tr>
    `;
  };

  const addResult = (
    displayDate,
    numOfDays,
    principleAmount,
    interestAmount,
    penalAmount,
    className
  ) => {
    if (className === "paymentClass") {
      document.getElementById("result").innerHTML += ` 
            <span>
                Payment was made!
            </span>
        `;
    }
    let entry = `
      <tr class=${className}>
          <td>${displayDate.toLocaleDateString("en-GB")}, ${Math.round(numOfDays)}</td>
          <td>${seperator(round(principleAmount))}</td>
          <td>${seperator(round(interestAmount))}</td>
          <td>${seperator(round(penalAmount))}</td>
      </tr>
    `;
    document.getElementById("result").innerHTML += entry;
  };
  const calculate = () => {
    resetResult();

    //calculate the installments and payments net 
    let principleAmount = (amountPrice) * (1 - downPayment / 100);
    let penalAmount, interestAmount;

    let beginDate; //date from which interest begins
    let currentDate = new Date(allotmentDate); //date upto which due is calculated
    let today = new Date().getTime();
    let currentPaymentNum = 0;
    let currentInstallmentNum=installmentsNumber;
    for (let i = 0; i < 100; i++) {

        //increment currentDate by 6 or 12 months (installment)
        beginDate = new Date(currentDate);
        if (currentInstallmentNum > 0) { //add time by 6 mons
            console.log("Pay installment number", installmentsNumber)
            currentDate.setMonth(currentDate.getMonth() + 6);
            currentInstallmentNum-=1;
        } else { //add 12 months
            //console.log("Yearly compound interest beginning")
            currentDate.setFullYear(currentDate.getFullYear() + 1);
            currentDate.setDate(1);
        }

        //console.log("Interest from", beginDate.toLocaleDateString(), "to", currentDate.toLocaleDateString());
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (currentDate.getTime() > today) {
            //console.log("Time limit reached to today")
            currentDate = new Date(new Date(today).toLocaleDateString());
            i = 100; // only find interest till today 
        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        if (paymentsHistory.length - 1 < currentPaymentNum) {
            //console.log("No payment will be made, calculating interest")
            // payment was not made, so calculate interest and add to principle
            const numOfDays = (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
            interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
            penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

            //append these values to result 
            addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);
            principleAmount += interestAmount + penalAmount;
        } else {
            //else add interest but first check if payment was made
            const paymentDate = new Date(paymentsHistory[currentPaymentNum].paymentDate);

            if (paymentDate.getTime() <= currentDate.getTime()) {
                //console.log("Payment was made before or on time")
                let numOfDays = (paymentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);

                if (currentInstallmentNum >= 0) penalAmount = 0;
                else penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;

                addResult(paymentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);

                //adjust the payment made in the principle and interest
                let thisPaymentAmount = paymentsHistory[currentPaymentNum].paymentAmount;
                // console.log(installmentNumber, interestAmount, penalAmount, principleAmount)
                if (thisPaymentAmount >= penalAmount) {
                    thisPaymentAmount -= penalAmount;
                    penalAmount = 0;
                } else {
                    penalAmount -= thisPaymentAmount;
                    thisPaymentAmount = 0;
                }

                if (thisPaymentAmount >= interestAmount) {
                    thisPaymentAmount -= interestAmount;
                    interestAmount = 0;
                } else {
                    interestAmount -= thisPaymentAmount;
                    thisPaymentAmount = 0;
                }
                principleAmount += penalAmount + interestAmount - thisPaymentAmount;
                currentPaymentNum += 1;
                addResult(paymentDate, numOfDays, principleAmount, interestAmount, penalAmount, 'paymentClass');

                /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                // interest from payment date to current date
                numOfDays = (currentDate.getTime() - paymentDate.getTime()) / (1000 * 60 * 60 * 24);
                if (currentInstallmentNum >= 0) penalAmount = 0;
                else penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
                addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);

                principleAmount += interestAmount + penalAmount;

            } else if (currentInstallmentNum >= 0 && (paymentDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24) <= 10) { // within 10 days 
                //if made within 10 days, then no penalty and interest of 6 mos
                //console.log("Payment was made within the warning time")
                penalAmount = 0;
                const numOfDays = (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
                addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);
                /////////////////////////////////////////////////////////////////////////////////////////////////////////////
                //adjust the payment made in the principle and interest
                let thisPaymentAmount = paymentsHistory[currentPaymentNum][1];
                if (thisPaymentAmount >= interestAmount) {
                    thisPaymentAmount -= interestAmount;
                    interestAmount = 0;
                } else {
                    interestAmount -= thisPaymentAmount;
                }
                principleAmount += interestAmount - thisPaymentAmount;
                currentPaymentNum += 1;

                //append these values to result 
                addResult(paymentDate, numOfDays, principleAmount, interestAmount, penalAmount, 'paymentClass');
                principleAmount += interestAmount + penalAmount;

            } else {
                //console.log("No payment was made in this due date, calculating interest")
                // payment was not made, so calculate interest and add to principle
                const numOfDays = (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
                //payment was not made on this date, add interest and move on
                interestAmount = principleAmount * (rateInterest / 100) * numOfDays / 365;
                penalAmount = principleAmount * (penalInterest / 100) * numOfDays / 365;

                //append these values to result 
                addResult(currentDate, numOfDays, principleAmount, interestAmount, penalAmount, null);
                principleAmount += interestAmount + penalAmount;
            }

        }
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        if (currentInstallmentNum === 0) {
          currentInstallmentNum-=1;
        }

    }

    document.getElementById('result').innerHTML += `
        <h1>
            Net outstanding dues = ${seperator(Math.round((principleAmount + interestAmount + penalAmount + Number.EPSILON) * 100) / 100)}
        </h1>
    `
  };

  const saveUser = () => {
    //send API call to save all data and payments
  }

  return (
    <div className="allotment">
      <Header />
      <h1>Land Allotment Calculator</h1>
      <br /> <br/>
      <div className="buttonContainer">
        <Button variant="contained" color="secondary" onClick={saveUser}>
          Save user
        </Button>
      </div>
      <br/>
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
          onChange={(e) => setAllotmentDate(e.target.value)}
          value={allotmentDate}
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

      <div className="buttonContainer">
        <Button variant="contained" color="secondary" onClick={addPayment}>
          Add Payment
        </Button>
      </div>

      <div className="payments">
        {paymentsHistory.length === 0 ? (
          <h4>No payments were made by {username}</h4>
        ) : null}
        {paymentsHistory.map((paymentLog, index) => {
          return (
            <div className="paymentLog" key={index}>
              <span>Payment {index + 1}</span>
              <TextField
                type="date"
                InputLabelProps={{ shrink: true }}
                label="Payment Date"
                margin="normal"
                value={paymentLog?.paymentDate}
                onChange={(e) => {
                  let updatedPaymentHistory = [...paymentsHistory];
                  updatedPaymentHistory[index].paymentDate = e.target.value;
                  setPaymentsHistory(updatedPaymentHistory);
                }}
              />

              <TextField
                type="number"
                InputLabelProps={{ shrink: true }}
                label="Payment Amount"
                margin="normal"
                value={paymentLog.paymentAmount}
                onChange={(e) => {
                  let updatedPaymentHistory = [...paymentsHistory];
                  updatedPaymentHistory[index].paymentAmount = e.target.value;
                  setPaymentsHistory(updatedPaymentHistory);
                }}
              />
            </div>
          );
        })}
      </div>

      <br />
      <div className="buttonContainer">
        <Button variant="contained" color="secondary" onClick={calculate}>
          Calculate
        </Button>
      </div>

      <table id="result"></table>
    </div>
  );
}
