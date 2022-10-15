import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/pages/Home.jsx";
import Login from "./Components/User/Login";
import Register from "./Components/User/Register";
import Error from "./Components/pages/Error";
import Verify from "./Components/User/Verify";
import Create from "./Components/User/Create";
import { ToastContainer } from "react-toastify";
import Allotment from "./Components/pages/Allotment/Allotment.jsx";
import Salary from "./Components/pages/Salary/Salary.jsx";

function App() {
  return (
    <>
      <ToastContainer/>
      <Router>
        <Routes>
          <Route exact path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/verify" element={<Verify />} />
          <Route path="/register/create" element={<Create />} />

          <Route exact path="/" element={<Home />} />
          <Route path="/allotment" element={<Allotment/>} />

          <Route exact path="/salary" element={<Salary/>} />

          <Route path="*" element={<Error />} />
        </Routes>
      </Router>

    </>
  );
}

export default App;
