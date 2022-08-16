import React, { useState } from "react";
import { TextField, MenuItem, Button, Tabs, Tab } from "@mui/material";
import Header from "../Header";
import "../stylesheets/Allotment.css";
import { seperator, round } from "../../utils/numberFormat";
import { CreateAllotment, UpdateAllotment } from "../../Api/Allotment";
import { toast } from "react-toastify";
import SavedAllotments from "./SavedAllotments";
import Data from '../elements/Data'
import InterestCalculation from "../elements/InterestCalculation";
import PaymentsCalculation from "../elements/PaymentsCalculation";
import AddAllottee from "./AddAllottee";
import AddPayment from "./AddPayment";
import ReactToPdf from "react-to-pdf";
import { DownloadTableExcel } from "react-export-table-to-excel";

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
  const [isAllotteeOpen, setIsAllotteeOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const ref = React.createRef();

  let principleTimespanTemp = [];
  let installmentsScheduleTemp = [];

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
      beginDate = new Date(currentDate);
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
        // console.log("Pay installment number", installmentsNumber);
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
          let thisPaymentAmount =
            paymentsHistory[currentPaymentNum].paymentAmount;
          console.log(thisPaymentAmount);
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
              round(principleAmount + interestAmount + penalAmount)
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

      <ReactToPdf targetRef={ref} filename="div-blue.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Generate pdf</button>}
      </ReactToPdf>

      <DownloadTableExcel
        filename="users table"
        sheet="users"
        currentTableRef={ref.current}
      >
        <button> Export excel </button>
      </DownloadTableExcel>

      <div className="inputModals">
        <AddAllottee
          isOpen={isAllotteeOpen}
          close={() => setIsAllotteeOpen(false)}
          username={username}
          setUsername={setUsername}
          setAllotmentDate={setAllotmentDate}
          allotmentDate={allotmentDate}
          amountPrice={amountPrice}
          setAmountPrice={setAmountPrice}
          downPayment={downPayment}
          setDownPayment={setDownPayment}
          installmentsNumber={installmentsNumber}
          setInstallmentsNumber={setInstallmentsNumber}
          rateInterest={rateInterest}
          setRateInterest={setRateInterest}
          penalInterest={penalInterest}
          setPenalInterest={setPenalInterest}
          plot={plot}
          setPlot={setPlot}
        />

        <AddPayment
          isOpen={isPaymentOpen}
          close={() => {
            setIsPaymentOpen(false);
          }}
          paymentsHistory={paymentsHistory}
          setPaymentsHistory={setPaymentsHistory}
        />
      </div>

      <div className="buttonContainer">
        <Button variant="contained" color="secondary" onClick={calculate}>
          Calculate
        </Button>

        <Button
          variant="contained"
          margin="normal"
          onClick={() => setIsAllotteeOpen(true)}
        >
          + Allottee
        </Button>

        <Button
          variant="contained"
          margin="normal"
          onClick={() => setIsPaymentOpen(true)}
        >
          + Payment
        </Button>

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

      <div className="result" ref={ref}>
        <div className="data">
          <div className="dataDiv">Allottee: {username}</div>
          <div className="dataDiv">Date of Allotment: {allotmentDate}</div>
          <div className="dataDiv">Amount Price: {amountPrice}</div>
          <div className="dataDiv">Down Payment: {downPayment}</div>
          <div className="dataDiv">
            Number of Installments: {installmentsNumber}
          </div>
          <div className="dataDiv">Interest Rate: {rateInterest}</div>
          <div className="dataDiv">Penality Rate: {penalInterest}</div>
          <div className="dataDiv">Type of Land: {plot ? "plot" : "booth"}</div>
        </div>
        {/* <PaymentsCalculation paymentsHistory={paymentsHistory} /> */}
        <Data installmentsSchedule={installmentsSchedule} paymentsHistory={paymentsHistory} principleTimespan={principleTimespan}/>
        {/* <InterestCalculation principleTimespan={principleTimespan} /> */}
      </div>

      <div id="result"></div>
    </div>
  );
}
