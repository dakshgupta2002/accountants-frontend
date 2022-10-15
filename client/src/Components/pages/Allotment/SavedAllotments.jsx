import React, { useState, useEffect } from "react";
import { FetchAllotment, RemoveAllotment } from "../../../Api/Allotment";
import { Button, Drawer, Divider } from "@mui/material";
import "../../stylesheets/SavedAllotment.css";

export default function SavedAllotments({
  setUsername,
  setAllotmentDate,
  setAmountPrice,
  setDownPayment,
  setRateInterest,
  setPenalInterest,
  setInstallmentsNumber,
  setPlot,
  setPaymentsHistory,
  fetchSaved,
  setFetchSaved,
  resetResult,
  setAllotmentId
}) {
  const [allotments, setAllotments] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const viewDetails = (index) => {
    const allotmentLog = allotments[index];

    setAllotmentId(allotmentLog._id)
    setUsername(allotmentLog.username);
    setAllotmentDate(allotmentLog.allotmentDate);
    setAmountPrice(allotmentLog.amountPrice);
    setDownPayment(allotmentLog.downPayment);
    setRateInterest(allotmentLog.rateInterest);
    setPenalInterest(allotmentLog.penalInterest);
    setInstallmentsNumber(allotmentLog.installmentsNumber);
    setPlot(allotmentLog.plot);
    setPaymentsHistory(allotmentLog.payments);
   
    resetResult();
    setDrawerOpen(false);
  };

  const deleteAllotment = async (index) => {
    const res = await RemoveAllotment({
      _id: allotments[index]._id,
    });
    setFetchSaved(fetchSaved - 1);
  };

  useEffect(() => {
    const fetchAllotments = async () => {
      const res = await FetchAllotment();
      setAllotments(res);
    };

    fetchAllotments();
  }, [fetchSaved]);

  return (
    <div>
      <Button variant="contained" color="warning" onClick={toggleDrawer(true)}>
        Saved Allotments
      </Button>

      <Drawer
        anchor={"right"}
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        sx={{ padding: "30px" }}
      >
        {allotments.length === 0 ? (
          <div className="savedAllotment">
            No Allotments saved in your account
          </div>
        ) : null}
        {allotments.map((allotmentLog, index) => {
          return (
            <div key={index} className="savedAllotment">
              Username:{" "}
              <span className="savedAllotmentVal">
                {allotmentLog?.username}
              </span>
              <br />
              Allotment Date:{" "}
              <span className="savedAllotmentVal">
                {new Date(allotmentLog?.allotmentDate).toLocaleDateString(
                  "en-GB"
                )}
              </span>
              <br />
              Amount of Plot:{" "}
              <span className="savedAllotmentVal">
                {allotmentLog?.amountPrice}
              </span>
              <br />
              <br />
              <Button
                variant="contained"
                color="success"
                onClick={() => viewDetails(index)}
              >
                View Details
              </Button>{" "}
              <Button
                variant="contained"
                color="error"
                onClick={() => deleteAllotment(index)}
              >
                Delete
              </Button>
              <br />
              <Divider />
            </div>
          );
        })}
      </Drawer>
    </div>
  );
}
