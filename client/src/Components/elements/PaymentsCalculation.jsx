import React from "react";
import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function PaymentsCalculation({ paymentsHistory }) {
  return (
    <Grid
      direction="row"
      container
      justifyContent="center"
    >
      <Grid item className="header" lg={6}>
        Payments History
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
            { field: "paymentDate", headerName: "Payment Data", width: 200 },
            {
              field: "paymentAmount",
              headerName: "Payment Amount",
              width: 300,
            },
          ]}
          rows={paymentsHistory}
          getRowId={() => {
            return Math.ceil(Math.random() * 1000);
          }}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      </Grid>
    </Grid>
  );
}
