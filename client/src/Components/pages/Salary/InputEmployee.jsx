import React, { useState } from "react";
import { ModalContainer } from "../../sections";
import { Button, TextField } from "@mui/material";
import { GetEmployee } from "../../../Api/Salary";

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
  reimburse,
  setReimburse
}) {
  const [isInputOpen, setIsInputOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchEmpByCode = async () => {
    const emp = await GetEmployee(id);
    if (emp?.msg === 'NULL'){
      window.alert("No employee of this code found")
    }else{
      setMonth(emp.month)
      setYear(emp.year)
      setId(emp.code)
      setName(emp.name)
      setDesignation(emp.designation)
      setDepartment(emp.department)
      setLocation(emp.location)
      setPFAccount(emp.PFAccount)
      setUAN(emp.UAN)
      setPAN(emp.PAN)
      setBank(emp.bank)
      setESI(emp.ESI)
      setBasic(emp.basic)
      setSpecialAllowance(emp.specialAllowance)
      setProvidentFund(emp.providentFund)
      setInsurance(emp.insurance)
      setReimburse(emp.reimburse)
      setIsSearchOpen(false);
    }
  }

  return (
    <>
      <Button
        onClick={() => setIsInputOpen(true)}
        variant="contained"
        color="warning"
      >
        Add Employee
      </Button>

      <Button
        onClick={() => setIsSearchOpen(true)}
        variant="contained"
        color="warning"
      >
        Import Employee
      </Button>

      <ModalContainer
        isOpen={isSearchOpen}
        close={() => setIsSearchOpen(false)}
      >
        <TextField
          type="text"
          InputLabelProps={{ shrink: true }}
          margin="dense"
          fullWidth
          label="Search Employee Code"
          value={id}
          onChange={(e) => {
            setId(e.target.value);
          }}
        />

        <Button
          fullWidth
          variant="contained"
          color="success"
          onClick={searchEmpByCode}
          margin="dense"
        >
          Search
        </Button>
      </ModalContainer>

      <ModalContainer isOpen={isInputOpen} close={() => setIsInputOpen(false)}>
        <div>
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Month"
            value={month}
            onChange={(e) => {
              setMonth(e.target.value);
            }}
          />

          <TextField
            type="number"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Year"
            value={year}
            onChange={(e) => {
              setYear(e.target.value);
            }}
          />

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
          <TextField
            type="text"
            InputLabelProps={{ shrink: true }}
            margin="dense"
            fullWidth
            label="Reimburse"
            value={reimburse}
            onChange={(e) => {
              setReimburse(e.target.value);
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
          onClick={() => setIsInputOpen(false)}
        >
          Done!
        </Button>
      </ModalContainer>
    </>
  );
}
