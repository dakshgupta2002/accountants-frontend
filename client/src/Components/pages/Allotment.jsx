import React, { useState } from "react";
import { TextField, MenuItem, Button, Tabs, Tab } from "@mui/material";
import Header from "../Header";
import "../stylesheets/Allotment.css";
import { seperator, round } from "../../utils/numberFormat";
import { CreateAllotment, UpdateAllotment } from "../../Api/Allotment";
import { toast } from "react-toastify";
import SavedAllotments from "./SavedAllotments";
import InstallmentCalculation from "../elements/InstallmentCalculation";
import InterestCalculation from "../elements/InterestCalculation";
import PaymentsCalculation from "../elements/PaymentsCalculation";

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
  const [fetchSaved, setFetchSaved] = useState(0);
  const [installmentsSchedule, setInstallmentsSchedule] = useState([]);
  const [principleTimespan, setPrincipleTimespan] = useState([]);
  const [allotmentId, setAllotmentId] = useState(null);
  const [tabValue, setTabValue] = useState('0');

  let principleTimespanTemp = [];
  let installmentsScheduleTemp = [];

  const addPayment = () => {
    setPaymentsHistory([
      ...paymentsHistory,
      {
        id: paymentsHistory.length,
        paymentDate: "",
        paymentAmount: "",
      },
    ]);
  };

  const scheduleInstallmentsDisplay = () => {
    setInstallmentsSchedule([]);
    installmentsScheduleTemp = [];

    let principle = amountPrice * (1 - downPayment / 100),
      installmentValue =
        (amountPrice * (1 - downPayment / 100)) / installmentsNumber,
      interest = 0,
      beginDate = new Date(allotmentDate),
      currentDate = new Date(allotmentDate),
      numOfDays = 0;

    for (let i = 0; i < installmentsNumber; i++) {
      currentDate.setMonth(currentDate.getMonth() + 6);
      numOfDays =
        (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
      interest = (((principle * rateInterest) / 100) * numOfDays) / 365;

      installmentsScheduleTemp.push({
        id: Math.ceil(Math.random() * 1000),
        installmentsNumber: i + 1,
        date: currentDate.toLocaleDateString("en-GB"),
        amount: seperator(round(principle)),
        interest: seperator(round(interest)),
        total: seperator(round(installmentValue + interest)),
      });
      principle -= installmentValue;
    }
    setInstallmentsSchedule(installmentsScheduleTemp);
  };

  const resetResult = () => {
    document.getElementById("result").innerHTML = "";
    principleTimespanTemp = [];
    setPrincipleTimespan([]);
    installmentsScheduleTemp = [];
    setInstallmentsSchedule([]);
  };

  const addResult = (
    displayDate,
    numOfDays,
    principleAmount,
    interestAmount,
    penalAmount,
    className
  ) => {
    principleTimespanTemp.push({
      id: Math.ceil(Math.random() * 1000),
      date: displayDate.toLocaleDateString("en-GB"),
      days: Math.round(numOfDays),
      principle: seperator(round(principleAmount)),
      interest: seperator(round(interestAmount)),
      penal: seperator(round(penalAmount)),
      total: seperator(round(principleAmount + interestAmount + penalAmount)),
    });
  };

  const calculate = () => {
    resetResult();
    scheduleInstallmentsDisplay();
    //calculate the installments and payments net
    let principleAmount = amountPrice * (1 - downPayment / 100);
    let penalAmount, interestAmount;

    let beginDate, //date from which interest begins
      currentDate = new Date(allotmentDate), //date upto which due is calculated
      today = new Date().getTime(),
      currentPaymentNum = 0,
      currentInstallmentNum = installmentsNumber;

    for (let i = 0; i < 100; i++) {
      //maximum number of years there can be
      //increment currentDate by 6 or 12 months (installment)
      beginDate = new Date(currentDate);
      if (currentInstallmentNum > 0) {
        //add time by 6 mons
        console.log("Pay installment number", installmentsNumber);
        currentDate.setMonth(currentDate.getMonth() + 6);
        currentInstallmentNum -= 1;
      } else {
        //add 12 months
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        currentDate.setDate(1);
      }

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
        const numOfDays =
          (currentDate.getTime() - beginDate.getTime()) / (1000 * 60 * 60 * 24);
        interestAmount =
          (principleAmount * (rateInterest / 100) * numOfDays) / 365;
        penalAmount =
          (principleAmount * (penalInterest / 100) * numOfDays) / 365;

        //append these values to result
        addResult(
          currentDate,
          numOfDays,
          principleAmount,
          interestAmount,
          penalAmount,
          ""
        );
        principleAmount += interestAmount + penalAmount;
      } else {
        //else add interest but first check if payment was made
        const paymentDate = new Date(
          paymentsHistory[currentPaymentNum].paymentDate
        );

        if (paymentDate.getTime() <= currentDate.getTime()) {
          let numOfDays =
            (paymentDate.getTime() - beginDate.getTime()) /
            (1000 * 60 * 60 * 24);

          if (currentInstallmentNum >= 0) penalAmount = 0;
          else
            penalAmount =
              (principleAmount * (penalInterest / 100) * numOfDays) / 365;

          interestAmount =
            (principleAmount * (rateInterest / 100) * numOfDays) / 365;

          addResult(
            paymentDate,
            numOfDays,
            principleAmount,
            interestAmount,
            penalAmount,
            ""
          );

          //adjust the payment made in the principle and interest
          let thisPaymentAmount =
            paymentsHistory[currentPaymentNum].paymentAmount;

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
          addResult(
            paymentDate,
            numOfDays,
            principleAmount,
            interestAmount,
            penalAmount,
            "paymentClass"
          );

          /////////////////////////////////////////////////////////////////////////////////////////////////////////////
          // interest from payment date to current date
          numOfDays =
            (currentDate.getTime() - paymentDate.getTime()) /
            (1000 * 60 * 60 * 24);
          if (currentInstallmentNum >= 0) penalAmount = 0;
          else
            penalAmount =
              (principleAmount * (penalInterest / 100) * numOfDays) / 365;

          interestAmount =
            (principleAmount * (rateInterest / 100) * numOfDays) / 365;
          addResult(
            currentDate,
            numOfDays,
            principleAmount,
            interestAmount,
            penalAmount,
            ""
          );

          principleAmount += interestAmount + penalAmount;
        } else if (
          currentInstallmentNum >= 0 &&
          (paymentDate.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24) <=
            10
        ) {
          //if made within 10 days, then no penalty and interest of 6 mos
          penalAmount = 0;
          const numOfDays =
            (currentDate.getTime() - beginDate.getTime()) /
            (1000 * 60 * 60 * 24);
          interestAmount =
            (principleAmount * (rateInterest / 100) * numOfDays) / 365;
          addResult(
            currentDate,
            numOfDays,
            principleAmount,
            interestAmount,
            penalAmount,
            ""
          );

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
          addResult(
            paymentDate,
            numOfDays,
            principleAmount,
            interestAmount,
            penalAmount,
            "paymentClass"
          );

          principleAmount += interestAmount + penalAmount;
        } else {
          //console.log("No payment was made in this due date, calculating interest")
          // payment was not made, so calculate interest and add to principle
          const numOfDays =
            (currentDate.getTime() - beginDate.getTime()) /
            (1000 * 60 * 60 * 24);
          //payment was not made on this date, add interest and move on
          interestAmount =
            (principleAmount * (rateInterest / 100) * numOfDays) / 365;
          penalAmount =
            (principleAmount * (penalInterest / 100) * numOfDays) / 365;

          //append these values to result
          addResult(
            currentDate,
            numOfDays,
            principleAmount,
            interestAmount,
            penalAmount,
            ""
          );

          principleAmount += interestAmount + penalAmount;
        }
      }
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      if (currentInstallmentNum === 0) {
        currentInstallmentNum -= 1;
      }
    }

    setPrincipleTimespan(principleTimespanTemp);
    document.getElementById("result").innerHTML += `
        <h1>
            Net outstanding dues = ${seperator(
              Math.round(
                (principleAmount + interestAmount + penalAmount) * 100
              ) / 100
            )}
        </h1>
    `;
  };

  const saveAllotment = async () => {
    //send API call to save all data and payments
    if (
      !username.trim() ||
      !allotmentDate ||
      !amountPrice ||
      !downPayment ||
      !rateInterest ||
      !penalInterest ||
      !installmentsNumber ||
      !plot
    ) {
      toast.error("Information missing to save");
    }
    const res = await CreateAllotment({
      username,
      allotmentDate,
      amountPrice,
      downPayment,
      rateInterest,
      penalInterest,
      installmentsNumber,
      plot,
      payments: paymentsHistory,
    });

    toast.success("User saved for future use.");
    setFetchSaved(fetchSaved + 1);
  };

  const updateAllotment = async () => {
    //send API call to update data and payments
    if (
      !username.trim() ||
      !allotmentDate ||
      !amountPrice ||
      !downPayment ||
      !rateInterest ||
      !penalInterest ||
      !installmentsNumber ||
      !plot
    ) {
      toast.error("Information missing to save");
    }
    const res = await UpdateAllotment({
      _id: allotmentId,
      username,
      allotmentDate,
      amountPrice,
      downPayment,
      rateInterest,
      penalInterest,
      installmentsNumber,
      plot,
      payments: paymentsHistory,
    });

    toast.success("User updated for future use.");
    setFetchSaved(fetchSaved + 1);
  };

  return (
    <div className="allotment">
      <Header />

      <h1>Land Allotment Calculator</h1>

      <div className="buttonContainer">
        <SavedAllotments
          setAllotmentId={setAllotmentId}
          setUsername={setUsername}
          setAllotmentDate={setAllotmentDate}
          setAmountPrice={setAmountPrice}
          setDownPayment={setDownPayment}
          setRateInterest={setRateInterest}
          setPenalInterest={setPenalInterest}
          setInstallmentsNumber={setInstallmentsNumber}
          setPlot={setPlot}
          setPaymentsHistory={setPaymentsHistory}
          fetchSaved={fetchSaved}
          setFetchSaved={setFetchSaved}
          resetResult={resetResult}
        />
        <Button
          variant="contained"
          color="success"
          sx={{ mx: "10px" }}
          onClick={allotmentId ? updateAllotment : saveAllotment}
        >
          {allotmentId ? "Update User" : "Save user"}
        </Button>
      </div>
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
          onChange={(e) => setUsername(e.target.value)} //no space in username
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
      <Tabs value={tabValue} onChange={(event, newValue) => {setTabValue(newValue)}}>
        <Tab label="Installments" value="0" />
        <Tab label="Payments" value="1" />
        <Tab label="Interest Calculation" value="2" />
      </Tabs>

      {tabValue === '0' ? (
        <InstallmentCalculation installmentsSchedule={installmentsSchedule} />
      ) : tabValue === '1' ? (
        <PaymentsCalculation paymentsHistory={paymentsHistory} />
      ) : (
        <InterestCalculation principleTimespan={principleTimespan} />
      )}
      <div id="result" />
    </div>
  );
}
