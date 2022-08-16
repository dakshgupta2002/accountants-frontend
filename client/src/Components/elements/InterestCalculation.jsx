import React from "react";
import { Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

export default function InterestCalculation({ principleTimespan }) {
  return (
    <Grid
      direction="row"
      container
      justifyContent="center"
    >
      <Grid item className="header" lg={6}>
        Interest and Penalty
      </Grid>
      <Grid
        item
        lg={11.5}
        sx={{
          overflowX: "scroll",
          marginTop: "3vh",
          height: "80vh",
          width: "100%",
        }}
      >
        <DataGrid
          columns={[
            { field: "date", headerName: "Date", width: 150 },
            { field: "days", headerName: "Days", width: 100 },
            {
              field: "principle",
              headerName: "Principle Amount",
              width: 200,
            },
            { field: "interest", headerName: "Interest", width: 200 },
            { field: "penal", headerName: "Penality", width: 200 },
            { field: "total", headerName: "Total", width: 300 },
          ]}
          rows={principleTimespan}
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
