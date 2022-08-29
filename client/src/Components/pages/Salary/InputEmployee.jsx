import React, { useState } from "react";
import { ModalContainer } from "../../sections";
import { Button, TextField } from "@mui/material";

export default function InputEmployee({
  month,
  year,
  id,
  name,
  designation,
  department,
  location,
  PFAccount,
  UAN,
  PAN,
  bank,
  ESI,
  basic,
  specialAllowance,
  providentFund,
  insurance,
  setMonth,
  setYear,
  setId,
  setName,
  setDesignation,
  setDepartment,
  setLocation,
  setPFAccount,
  setUAN,
  setPAN,
  setBank,
  setESI,
  setBasic,
  setSpecialAllowance,
  setProvidentFund,
  setInsurance,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="contained"
        color="warning"
      >
        Add Employee
      </Button>
      <ModalContainer isOpen={isOpen} close={() => setIsOpen(false)}>
        <div>
          <h4>Employee Details</h4>
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Employee Code"
            value={id}
            onChange={(e) => {
              setId(e.target.value);
            }}
          />
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Designation"
            value={designation}
            onChange={(e) => {
              setDesignation(e.target.value);
            }}
          />

          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Department"
            value={department}
            onChange={(e) => {
              setDepartment(e.target.value);
            }}
          />

          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Location"
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
            }}
          />
        </div>
        <hr />

        <div>
          <h4>Account Details</h4>
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="PF Account Number"
            value={PFAccount}
            onChange={(e) => {
              setPFAccount(e.target.value);
            }}
          />
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="UAN"
            value={UAN}
            onChange={(e) => {
              setUAN(e.target.value);
            }}
          />
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="PAN Number"
            value={PAN}
            onChange={(e) => {
              setPAN(e.target.value);
            }}
          />
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Bank Details"
            value={bank}
            onChange={(e) => {
              setBank(e.target.value);
            }}
          />
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="ESI number"
            value={ESI}
            onChange={(e) => {
              setESI(e.target.value);
            }}
          />
        </div>
        <hr />

        <div>
          <h4>Earnings Details</h4>
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="BASIC"
            value={basic}
            onChange={(e) => {
              setBasic(e.target.value);
            }}
          />
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Special Allowance"
            value={specialAllowance}
            onChange={(e) => {
              setSpecialAllowance(e.target.value);
            }}
          />
        </div>
        <hr />

        <div>
          <h4>Deductions Details</h4>
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Provident Fund"
            value={providentFund}
            onChange={(e) => {
              setProvidentFund(e.target.value);
            }}
          />
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Employee State Insurance"
            value={insurance}
            onChange={(e) => {
              setInsurance(e.target.value);
            }}
          />
        </div>
        <hr />
        <br />

        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={() => setIsOpen(false)}
        >
          Done!
        </Button>
      </ModalContainer>
    </>
  );
}
