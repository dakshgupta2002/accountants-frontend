import React, { useState } from "react";
import { Button } from "@mui/material";
import Header from "../../Header";
import "../../stylesheets/Allotment.css";
import { seperator, round } from "../../../utils/numberFormat";
import { CreateAllotment, UpdateAllotment } from "../../../Api/Allotment";
import { toast } from "react-toastify";
import SavedAllotments from "./SavedAllotments";
import Data from "../../elements/Data";
import EditPayment from "../../elements/EditPayment";
import AddAllottee from "./AddAllottee";
import AddPayment from "./AddPayment";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

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
  const [isEditPaymentOpen, setIsEditPaymentOpen] = useState(false);

  const ref = React.createRef();

  let principleTimespanTemp = [];
  let installmentsScheduleTemp = [];

  const givePenalty = (currentDate, runningAmount) => {
    const a = new Date(currentDate);
    const b = new Date(allotmentDate);
    const numOfMonths = (a.getMonth() - b.getMonth()) + 12*(a.getFullYear() - b.getFullYear());
    const installmentsPassed = Math.floor(numOfMonths / 6);

    // if all installments should have been paid
    if (installmentsPassed > installmentsNumber) return true;

    // find the value that should have been left
    let principleAmount = amountPrice * (1 - downPayment / 100);
    const amountThatShouldBeLeft = Math.floor(
      principleAmount * (1 - installmentsPassed / installmentsNumber)
    );
    console.log({currentDate, allotmentDate, numOfMonths, installmentsPassed, amountThatShouldBeLeft, runningAmount})
    return amountThatShouldBeLeft < runningAmount;
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
    payment,
    displayDate,
    numOfDays,
    principleAmount,
    interestAmount,
    cumulativeInterest,
    penalAmount,
    cumulativePenality
  ) => {
    principleTimespanTemp.push({
      id: Math.ceil(Math.random() * 1000),
      payment: seperator(round(payment)),
      date: new Date(displayDate).toLocaleDateString("en-GB"),
      days: Math.round(numOfDays),
      principle: seperator(round(principleAmount)),
      cumInterest: seperator(round(cumulativeInterest)),
      interest: seperator(round(interestAmount)),
      penal: seperator(round(penalAmount)),
      cumPenal: seperator(round(cumulativePenality)),
      total: seperator(round(principleAmount + cumulativeInterest)),
    });
  };

  const calculate = () => {
    resetResult();
    scheduleInstallmentsDisplay();
    //calculate the installments and payments net
    let principleAmount = amountPrice * (1 - downPayment / 100);
    let runningAmount = principleAmount;
    let penalAmount, interestAmount;
    let cumInterest = 0,
      cumPenal = 0;

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

      // console.log(givePenalty(currentDate, runningAmount));
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
          (runningAmount * (rateInterest / 100) * numOfDays) / 365;

        penalAmount =
          givePenalty(currentDate, runningAmount) === true
            ? (runningAmount * (penalInterest / 100) * numOfDays) / 365
            : 0;

        cumInterest += interestAmount;
        cumPenal += penalAmount;

        //append these values to result
        addResult(
          0,
          currentDate,
          numOfDays,
          principleAmount,
          interestAmount,
          cumInterest,
          penalAmount,
          cumPenal
        );
        runningAmount += interestAmount;
      } else {
        //balance out all payments made during begin and current date
        while (currentPaymentNum < paymentsHistory.length) {
          const paymentDate = new Date(
            paymentsHistory[currentPaymentNum].paymentDate
          );

          //if payment's date is valid adjust it
          if (paymentDate.getTime() <= currentDate.getTime()) {
            let numOfDays =
              (paymentDate.getTime() - beginDate.getTime()) /
              (1000 * 60 * 60 * 24);

            penalAmount =
              givePenalty(paymentDate, runningAmount) === true
                ? (runningAmount * (penalInterest / 100) * numOfDays) / 365
                : 0;

            interestAmount =
              (runningAmount * (rateInterest / 100) * numOfDays) / 365;

            cumInterest += interestAmount;
            cumPenal += penalAmount;

            addResult(
              0,
              paymentDate,
              numOfDays,
              principleAmount,
              interestAmount,
              cumInterest,
              penalAmount,
              cumPenal
            );

            //adjust the payment made in the principle and interest
            let thisPaymentAmount =
              paymentsHistory[currentPaymentNum].paymentAmount;

            if (thisPaymentAmount >= cumPenal) {
              thisPaymentAmount -= cumPenal;
              cumPenal = 0;
            } else {
              cumPenal -= thisPaymentAmount;
              thisPaymentAmount = 0;
            }

            if (thisPaymentAmount >= cumInterest) {
              thisPaymentAmount -= cumInterest;
              cumInterest = 0;
            } else {
              cumInterest -= thisPaymentAmount;
              thisPaymentAmount = 0;
            }
            if (thisPaymentAmount >= principleAmount) {
              thisPaymentAmount -= principleAmount;
              principleAmount = 0;
            } else {
              principleAmount -= thisPaymentAmount;
              thisPaymentAmount = 0;
            }

            runningAmount = principleAmount + cumInterest;

            addResult(
              paymentsHistory[currentPaymentNum].paymentAmount,
              paymentDate,
              numOfDays,
              principleAmount,
              interestAmount,
              cumInterest,
              penalAmount,
              cumPenal
            );

            currentPaymentNum += 1;
            beginDate = new Date(paymentDate);
          } else {
            break;
          }
        }

        let warningPayment = false;

        if (paymentsHistory.length > currentPaymentNum) {
          const paymentDate = new Date(
            paymentsHistory[currentPaymentNum].paymentDate
          );
          //if he pays within 10 days of warning while installments are going on
          if (
            currentInstallmentNum >= 0 &&
            (paymentDate.getTime() - currentDate.getTime()) /
              (1000 * 60 * 60 * 24) <=
              10
          ) {
            console.log("payment within warning period");
            warningPayment = true;
            //if made within 10 days, then no penalty and interest of 6 mos
            const numOfDays =
              (currentDate.getTime() - beginDate.getTime()) /
              (1000 * 60 * 60 * 24);
            penalAmount =
              givePenalty(currentDate, runningAmount) === true
                ? (runningAmount * (penalInterest / 100) * numOfDays) / 365
                : 0;
            interestAmount =
              (runningAmount * (rateInterest / 100) * numOfDays) / 365;
            cumInterest += interestAmount;
            cumPenal += penalAmount;

            addResult(
              0,
              currentDate,
              numOfDays,
              principleAmount,
              interestAmount,
              cumInterest,
              penalAmount,
              cumPenal
            );

            /////////////////////////////////////////////////////////////////////////////////////////////////////////////
            //adjust the payment made in the principle and interest
            let thisPaymentAmount =
              paymentsHistory[currentPaymentNum].paymentAmount;

            if (thisPaymentAmount >= cumPenal) {
              thisPaymentAmount -= cumPenal;
              cumPenal = 0;
            } else {
              cumPenal -= thisPaymentAmount;
              thisPaymentAmount = 0;
            }

            if (thisPaymentAmount >= cumInterest) {
              thisPaymentAmount -= cumInterest;
              cumInterest = 0;
            } else {
              cumInterest -= thisPaymentAmount;
              thisPaymentAmount = 0;
            }
            if (thisPaymentAmount >= principleAmount) {
              thisPaymentAmount -= principleAmount;
              principleAmount = 0;
            } else {
              principleAmount -= thisPaymentAmount;
              thisPaymentAmount = 0;
            }

            runningAmount = principleAmount + interestAmount;

            addResult(
              paymentsHistory[currentPaymentNum].paymentAmount,
              paymentDate,
              numOfDays,
              principleAmount,
              interestAmount,
              cumInterest,
              penalAmount,
              cumPenal
            );
            currentPaymentNum += 1;
          }
        }

        if (warningPayment === false) {
          // calculate interest from last payment/begin and add to principle
          const numOfDays =
            (currentDate.getTime() - beginDate.getTime()) /
            (1000 * 60 * 60 * 24);
          //payment was not made on this date, add interest and move on
          interestAmount =
            (runningAmount * (rateInterest / 100) * numOfDays) / 365;
          penalAmount =
            givePenalty(currentDate, runningAmount) === true
              ? (runningAmount * (penalInterest / 100) * numOfDays) / 365
              : 0;
          cumInterest += interestAmount;
          cumPenal += penalAmount;

          //append these values to result
          addResult(
            0,
            currentDate,
            numOfDays,
            principleAmount,
            interestAmount,
            cumInterest,
            penalAmount,
            cumPenal
          );

          runningAmount = principleAmount + interestAmount;
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
              round(principleAmount + cumInterest + cumPenal)
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

      <ReactHTMLTableToExcel
        id="test-table-xls-button"
        className="download-table-xls-button"
        table="data"
        filename={username}
        sheet="interest"
        buttonText="Export XLS"
      />

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

        <EditPayment
          isOpen={isEditPaymentOpen}
          close={() => setIsEditPaymentOpen(false)}
          payments={paymentsHistory}
          setPayments={setPaymentsHistory}
        />
      </div>

      <div className="buttonContainer">
        <div style={{ display: "flex" }}>
          <Button
            sx={{ mx: "10px" }}
            variant="contained"
            margin="normal"
            onClick={() => setIsAllotteeOpen(true)}
          >
            + Allottee
          </Button>

          <Button
            sx={{ mx: "10px" }}
            variant="contained"
            margin="normal"
            onClick={() => setIsPaymentOpen(true)}
          >
            + Payment
          </Button>

          <Button
            sx={{ mx: "10px" }}
            variant="contained"
            margin="normal"
            onClick={() => setIsEditPaymentOpen(true)}
          >
            Edit Payments
          </Button>
        </div>

        <div style={{ display: "flex" }}>
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

          <Button variant="contained" color="secondary" onClick={calculate}>
            Calculate
          </Button>
        </div>
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
        <Data
          id={"data"}
          installmentsSchedule={installmentsSchedule}
          paymentsHistory={paymentsHistory}
          principleTimespan={principleTimespan}
        />
      </div>

      <div id="result"></div>
    </div>
  );
}
