import React from "react";
import { ModalContainer } from "../../sections";
import { TextField, MenuItem } from "@mui/material";

export default function AddAllottee({
  isOpen,
  close,
  username,
  setUsername,
  setAllotmentDate,
  allotmentDate,
  amountPrice,
  setAmountPrice,
  downPayment,
  setDownPayment,
  installmentsNumber,
  setInstallmentsNumber,
  rateInterest,
  setRateInterest,
  penalInterest,
  setPenalInterest,
  plot,
  setPlot,
}) {
  return (
    <ModalContainer isOpen={isOpen} close={close}>
      <div className="formData">
        <TextField
          label="Allotee name"
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
    </ModalContainer>
  );
}
