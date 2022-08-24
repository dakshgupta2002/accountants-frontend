import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

export default function Data({
  installmentsSchedule,
  paymentsHistory,
  principleTimespan,
  id,
}) {
  const installmentsAndPayment = {
    display: "flex",
    flexDirection: "row",
    alignContent: 'start',
    justifyContent: 'space-around'
  };
  return (
    <Table id={id}>
      <div style={installmentsAndPayment}>
        <Table size="small" aria-label="a dense table" sx={{ maxWidth: 650 }}>
          <TableHead>
            Installments Schedule
            <TableRow>
              <TableCell>Installment</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell align="right">Interest</TableCell>
              <TableCell align="right">Deposit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {installmentsSchedule.map((installment) => (
              <TableRow
                key={installment.installmentsNumber}
              >
                <TableCell component="th" scope="row">
                  {installment.installmentsNumber}
                </TableCell>
                <TableCell align="right">{installment.date}</TableCell>
                <TableCell align="right">{installment.amount}</TableCell>
                <TableCell align="right">{installment.interest}</TableCell>
                <TableCell align="right">{installment.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Table size="small" aria-label="a dense table" sx={{ maxWidth: 650 }}>
          <TableHead>
            Payments History
            <TableRow>
              <TableCell>Payment</TableCell>
              <TableCell align="right">Date</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentsHistory.map((payment, index) => (
              <TableRow
                key={index + 1}
              >
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell align="right">
                  {new Date(payment.paymentDate).toLocaleDateString("en-GB")}
                </TableCell>
                <TableCell align="right">{payment.paymentAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Table
        sx={{ minWidth: 650 }}
        size="small"
        aria-label="a dense table"
      >
        <TableHead>
          Interest Calculation
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Payment</TableCell>
            <TableCell align="right">Days</TableCell>
            <TableCell align="right">Principle</TableCell>
            <TableCell align="right">Interest</TableCell>
            <TableCell align="right">Cum. Int.</TableCell>
            <TableCell align="right">Penality</TableCell>
            <TableCell align="right">Cum. Pen.</TableCell>
            <TableCell align="right">Running Bal.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {principleTimespan.map((principle, index) => (
            <TableRow
              key={index + 1}
            >
              <TableCell component="th" scope="row">
                {principle.date}
              </TableCell>

              <TableCell align="right">{principle.payment}</TableCell>
              <TableCell align="right">{principle.days}</TableCell>
              <TableCell align="right">{principle.principle}</TableCell>
              <TableCell align="right">{principle.interest}</TableCell>
              <TableCell align="right">{principle.cumInterest}</TableCell>
              <TableCell align="right">{principle.penal}</TableCell>
              <TableCell align="right">{principle.cumPenal}</TableCell>
              <TableCell align="right">{principle.total}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Table>
  );
}
