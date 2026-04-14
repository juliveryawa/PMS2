import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import SchedulingPage from "./pages/SchedulingPage";
import MaintenanceLogsPage from "./pages/MaintenanceLogsPage";
import MyTasksPage from "./pages/MyTasksPage";
import UserManagementPage from "./pages/UserManagementPage";
import AssetManagementPage from "./pages/AssetManagementPage";
import DesktopMonitoringPage from "./pages/DesktopMonitoringPage";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route — always accessible */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes — redirect to /login if no token */}
        <Route path="/dashboard"  element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/scheduling" element={<ProtectedRoute><SchedulingPage /></ProtectedRoute>} />
        <Route path="/logs"       element={<ProtectedRoute><MaintenanceLogsPage /></ProtectedRoute>} />
        <Route path="/tasks"      element={<ProtectedRoute><MyTasksPage /></ProtectedRoute>} />
        <Route path="/users"      element={<ProtectedRoute><UserManagementPage /></ProtectedRoute>} />
        <Route path="/assets"     element={<ProtectedRoute><AssetManagementPage /></ProtectedRoute>} />
        <Route path="/monitoring" element={<ProtectedRoute><DesktopMonitoringPage /></ProtectedRoute>} />

        {/* Catch-all — redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;