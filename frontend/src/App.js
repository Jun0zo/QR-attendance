import logo from "./logo.svg";
import "./App.css";

// router
import { Routes, Route } from "react-router-dom";

// pages
import ScheduleManageDetailed from "./pages/ScheduleManageDetailed";
import ScheduleManage from "./pages/ScheduleManage";
import RegisterTransaction from "./pages/RegisterTransaction";

function App() {
  return (
    <Routes>
      <Route
        path="/schedule-manager-detailed"
        element={<ScheduleManageDetailed />}
      />
      \
      <Route path="/schedule-manager" element={<ScheduleManage />} />
      <Route
        path="/register-transaction/:storeId"
        element={<RegisterTransaction />}
      />
    </Routes>
  );
}

export default App;
