import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SchedulingPage from "./pages/SchedulingPage";
import MaintenanceLogsPage from "./pages/MaintenanceLogsPage";
import MyTasksPage from "./pages/MyTasksPage";
import UserManagementPage from "./pages/UserManagementPage";
import AssetManagementPage from "./pages/AssetManagementPage";
import DesktopMonitoringPage from "./pages/DesktopMonitoringPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/scheduling" element={<SchedulingPage />} />
        <Route path="/logs" element={<MaintenanceLogsPage />} />
        <Route path="/tasks" element={<MyTasksPage />} />
        <Route path="/users" element={<UserManagementPage />} />
        <Route path="/assets" element={<AssetManagementPage />} />
        <Route path="/monitoring" element={<DesktopMonitoringPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;