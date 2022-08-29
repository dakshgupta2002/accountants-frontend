import React, { useState } from "react";
import { ModalContainer } from "../../sections";
import { Button, TextField } from "@mui/material";

export default function AddPayment({
  isOpen,
  close,
  paymentsHistory,
  setPaymentsHistory,
}) {
  const [paymentDate, setPaymentDate] = useState(new Date());
  const [paymentAmount, setPaymentAmount] = useState(0);

  const addPayment = () => {
    setPaymentsHistory([
      ...paymentsHistory,
      {
        id: paymentsHistory.length,
        paymentDate,
        paymentAmount,
      },
    ].sort( (a,b) => {
      return new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime();
    }));

    close();
  };

  return (
    <ModalContainer isOpen={isOpen} close={close}>
      <h1>Payment {paymentsHistory.length + 1}</h1>

      <TextField
        type="date"
        InputLabelProps={{ shrink: true }}
        label="Payment Date"
        margin="normal"
        value={paymentDate}
        onChange={(e) => {
          setPaymentDate(e.target.value);
        }}
      />

      <TextField
        type="number"
        InputLabelProps={{ shrink: true }}
        label="Payment Amount"
        margin="normal"
        value={paymentAmount}
        onChange={(e) => {
          setPaymentAmount(e.target.value);
        }}
      />

      <div className="buttonContainer">
        <Button variant="contained" color="secondary" onClick={addPayment}>
          Add Payment
        </Button>
      </div>
    </ModalContainer>
  );
}
