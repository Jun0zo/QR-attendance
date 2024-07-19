import logo from "./logo.svg";
import "./App.css";

// router
import { Routes, Route } from "react-router-dom";

// pages
import ScheduleManage from "./pages/ScheduleManage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<ScheduleManage />} />
    </Routes>
  );
}

export default App;
