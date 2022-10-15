import React, { useState } from "react";
import "../../stylesheets/Salary.css";
import logo from "../../../assets/logos/3d.jpg";
import { Button } from "@mui/material";
import InputEmployee from "./InputEmployee";
import ReactToPdf from "react-to-pdf";
import { useRef } from "react";
import { PostEmployee } from "../../../Api/Salary";
import Header from "../../Header";

export default function Salary() {
  const [month, setMonth] = useState("May");
  const [year, setYear] = useState(2022);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("Jaipur Airport");
  const [PFAccount, setPFAccount] = useState("");
  const [UAN, setUAN] = useState("");
  const [PAN, setPAN] = useState("");
  const [bank, setBank] = useState("");
  const [ESI, setESI] = useState("");
  const [basic, setBasic] = useState(0);
  const [specialAllowance, setSpecialAllowance] = useState(0);
  const [providentFund, setProvidentFund] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [reimburse, setReimburse] = useState(0);

  const body = useRef();

  const save = async () => {
    //send api call on backend
    const res = await PostEmployee(id, {
      month,
      year,
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
      reimburse
    });

    window.alert("Employee Details saved/updated.");
  };

  return (
    <div>
      <Header />
      <div className="operations">
        <InputEmployee
          month={month}
          year={year}
          id={id}
          name={name}
          designation={designation}
          department={department}
          location={location}
          PFAccount={PFAccount}
          UAN={UAN}
          PAN={PAN}
          bank={bank}
          ESI={ESI}
          basic={basic}
          specialAllowance={specialAllowance}
          providentFund={providentFund}
          insurance={insurance}
          reimburse={reimburse}
          setMonth={setMonth}
          setYear={setYear}
          setId={setId}
          setName={setName}
          setDesignation={setDesignation}
          setDepartment={setDepartment}
          setLocation={setLocation}
          setPFAccount={setPFAccount}
          setUAN={setUAN}
          setPAN={setPAN}
          setBank={setBank}
          setESI={setESI}
          setBasic={setBasic}
          setSpecialAllowance={setSpecialAllowance}
          setProvidentFund={setProvidentFund}
          setInsurance={setInsurance}
          setReimburse={setReimburse}
        />

        <Button color="success" variant="contained" onClick={save}>
          Save Employee
        </Button>

        <ReactToPdf targetRef={body} filename={`${name}-${month}-${id}`}>
          {({ toPdf }) => (
            <Button variant="contained" color="secondary" onClick={toPdf}>
              Generate pdf
            </Button>
          )}
        </ReactToPdf>
      </div>
      <div className="body" ref={body}>
        
        <div className="watermark">
          <div>
            <b>3D Consult Services (opc) Private Limited</b>
            <br />
            305, Sector 8, opp Gymkhana Club, Karnal - 132001
          </div>

          <img src={logo} alt="3d" className="logo" />
        </div>
        <div>
          <p>
            Payslip for the month of : {month} - {year}
          </p>
          <div className="details">
            <div className="detailBox detailBoxOne">
              Employee Code: {id} <br />
              Name: {name} <br />
              Designation: {designation} <br />
              Department: {department} <br />
              Location: {location}
            </div>
            <div className="detailBox">
              PF Account Number: {PFAccount} <br />
              UAN: {UAN} <br />
              PAN Number: {PAN} <br />
              Bank Details: {bank} <br />
              ESI Number: {ESI}
            </div>
          </div>
        </div>
        <br />
        <div className="salary">
          <div className="earning records">
            <div className="info">
              <p>
                <b>Earnings</b>
              </p>
              <p>
                <b>Amount (Rs)</b>
              </p>
            </div>
            <hr />
            <div>
              <div className="value">
                <span>BASIC</span> <span>{basic}</span>
              </div>
              <div className="value">
                <span>Special Allowance</span>
                <span>{specialAllowance}</span>
              </div>
              <div className="value">
                <span>Reimbursement</span>
                <span>{reimburse}</span>
              </div>
            </div>
            <hr />

            <p>Total (Rs.) {parseInt(basic) + parseInt(specialAllowance) + parseInt(reimburse)} </p>
          </div>
          <div className="deduction records">
            <div className="info">
              <p>
                <b>Deduction</b>
              </p>
              <p>
                <b>Amount (Rs)</b>
              </p>
            </div>
            <hr />

            <div>
              <div className="value">
                <span>Provident Fund</span> <span>{providentFund}</span>
              </div>
              <div className="value">
                <span>Employee State Insurance</span> <span>{insurance}</span>
              </div>
              <br/>
            </div>
            <hr />

            <p>Total (Rs.) {parseInt(providentFund) + parseInt(insurance)}</p>
          </div>
        </div>

        <h4 className="amount">
          Net Amount:{" "}
          {parseInt(basic) +
            parseInt(specialAllowance) +
            parseInt(reimburse) -
            parseInt(providentFund) -
            parseInt(insurance)}
        </h4>
      </div>
    </div>
  );
}
