import React, { useState } from "react";
import "../../stylesheets/Salary.css";
import logo from "../../../assets/logos/3d.jpg";

export default function Salary() {
  const [month, setMonth] = useState("May");
  const [year, setYear] = useState(2022);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [department, useDepartment] = useState("");
  const [location, setLocation] = useState("Jaipur Airport");
  const [PFAccount, setPFAccount] = useState("");
  const [UAN, setUAN] = useState("");
  const [PAN, setPAN] = useState("");
  const [bank, setBank] = useState("");
  const [ESI, setESI] = useState("");
  const [basic, setBasic] = useState("");
  const [specialAllowance, setSpecialAllowance] = useState("");
  const [providentFund, setProvidentFund] = useState("");
  const [insurance, setInsurance] = useState("");

  return (
    <div>
      <div className="body">
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
            Payslip for the month of : {month} -{year}
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
              <p><b>Earnings</b></p>
              <p><b>Amount (Rs)</b></p>
            </div>
            <hr/>
            <div>
              <div>BASIC {basic}</div>
              <div>Special Allowance {specialAllowance}</div>
            </div>  
            <hr/>

            <p>Total (Rs.) {basic + specialAllowance}</p>
          </div>
          <div className="deduction records">
            <div className="info">
              <p><b>Deduction</b></p>
              <p><b>Amount (Rs)</b></p>
            </div>
            <hr/>

            <div>
              <div>Provident Fund {providentFund}</div>
              <div>Employee State Insurance {insurance}</div>
            </div>
            <hr/>

            <p>Total (Rs.) {providentFund + insurance}</p>
          </div>
        </div>

        <h4 className="amount">
          Net Amount: {basic + specialAllowance - providentFund - insurance}
        </h4>
      </div>
    </div>
  );
}
