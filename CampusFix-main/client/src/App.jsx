import { Routes, Route } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import UserDashboard from './pages/UserDashboard';
import CreateTicket from './pages/CreateTicket';
import MyTickets from './pages/MyTickets';
import TicketDetails from './pages/TicketDetails';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';

import AdminDashboard from './pages/AdminDashboard';
import AdminTickets from './pages/AdminTickets';
import CategoryManagement from './pages/CategoryManagement';
import StaffManagement from './pages/StaffManagement';

import StaffDashboard from './pages/StaffDashboard';
import AssignedTickets from './pages/AssignedTickets';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<DashboardLayout />}>
        {/* Shared authenticated pages */}
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/tickets/new" element={<ProtectedRoute><CreateTicket /></ProtectedRoute>} />
        <Route path="/tickets/my" element={<ProtectedRoute><MyTickets /></ProtectedRoute>} />
        <Route path="/tickets/:id" element={<ProtectedRoute><TicketDetails /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        {/* Admin only */}
        <Route path="/admin" element={<ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/tickets" element={<ProtectedRoute roles={['ADMIN']}><AdminTickets /></ProtectedRoute>} />
        <Route path="/admin/categories" element={<ProtectedRoute roles={['ADMIN']}><CategoryManagement /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={['ADMIN']}><StaffManagement /></ProtectedRoute>} />

        {/* Staff only */}
        <Route path="/staff" element={<ProtectedRoute roles={['STAFF']}><StaffDashboard /></ProtectedRoute>} />
        <Route path="/staff/tickets" element={<ProtectedRoute roles={['STAFF']}><AssignedTickets /></ProtectedRoute>} />
      </Route>

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
