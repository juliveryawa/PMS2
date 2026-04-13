import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SchedulingPage from "./pages/SchedulingPage";
import MaintenanceLogsPage from "./pages/MaintenanceLogsPage";
import MyTasksPage from "./pages/MyTasksPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scheduling" element={<SchedulingPage />} />
        <Route path="/logs" element={<MaintenanceLogsPage />} />
        <Route path="/tasks" element={<MyTasksPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;