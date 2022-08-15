import React from "react";
import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function InstallmentCalculation({installmentsSchedule}) {
  return (
    <Grid
      direction="row"
      container
      justifyContent="center"
    >
      <Grid item className="header" lg={6}>
        Installments Schedule
      </Grid>
      <Grid
        item
        lg={11.5}
        sx={{
          overflowX: "scroll",
          marginTop: "3vh",
          height: "60vh",
          width: "100%",
        }}
      >
        <DataGrid
          columns={[
            {
              field: "installmentNumber",
              headerName: "Installment",
              width: 100,
            },
            { field: "date", headerName: "Date", width: 150 },
            { field: "amount", headerName: "Amount", width: 250 },
            { field: "interest", headerName: "Interest", width: 150 },
            { field: "total", headerName: "Deposit", width: 300 },
          ]}
          rows={installmentsSchedule}
          pageSize={10}
          getRowId={() => {
            return Math.ceil(Math.random() * 1000);
          }}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      </Grid>
    </Grid>
  );
}
