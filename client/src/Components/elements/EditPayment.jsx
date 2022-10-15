import React from "react";
import { Button, TextField } from "@mui/material";
import { ModalContainer } from "../sections";

export default function EditPayment({ isOpen, close, payments, setPayments }) {
  const UpdatePayments = () => {};
  return (
    <ModalContainer isOpen={isOpen} close={close}>
      {payments.map((payment, index) => {
        return (
          <div key={index}>
            <TextField
              type="date"
              InputLabelProps={{ shrink: true }}
              label="Payment Date"
              margin="normal"
              value={payment.paymentDate}
              onChange={(e) => {
                let updatedPaymentHistory = [...payments];
                updatedPaymentHistory[index].paymentDate = e.target.value;
                setPayments(updatedPaymentHistory);
              }}
            />

            <TextField
              type="number"
              InputLabelProps={{ shrink: true }}
              label="Payment Amount"
              margin="normal"
              value={payment.paymentAmount}
              onChange={(e) => {
                let updatedPaymentHistory = [...payments];
                updatedPaymentHistory[index].paymentAmount = e.target.value;
                setPayments(updatedPaymentHistory);
              }}
            />
          </div>
        );
      })}
    </ModalContainer>
  );
}
