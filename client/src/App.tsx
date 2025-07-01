import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { SchoolProvider } from './contexts/SchoolContext';

// Layout Components
import Layout from './components/Layout/Layout';
import PublicLayout from './components/Layout/PublicLayout';

// Authentication Components
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Dashboard Components
import AdminDashboard from './pages/dashboard/AdminDashboard';
import TeacherDashboard from './pages/dashboard/TeacherDashboard';
import ParentDashboard from './pages/dashboard/ParentDashboard';

// Feature Components
import Students from './pages/students/Students';
import StudentDetail from './pages/students/StudentDetail';
import AddStudent from './pages/students/AddStudent';
import EditStudent from './pages/students/EditStudent';

import Results from './pages/results/Results';
import AddResult from './pages/results/AddResult';
import EditResult from './pages/results/EditResult';
import ResultDetail from './pages/results/ResultDetail';

import Reports from './pages/reports/Reports';
import ReportDetail from './pages/reports/ReportDetail';

import Teachers from './pages/teachers/Teachers';
import TeacherDetail from './pages/teachers/TeacherDetail';
import AddTeacher from './pages/teachers/AddTeacher';

import SchoolSettings from './pages/school/SchoolSettings';
import Profile from './pages/profile/Profile';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

// Landing Page
import LandingPage from './pages/LandingPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Router>
        <AuthProvider>
          <SchoolProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              {/* Authentication Routes */}
              <Route element={<PublicLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
              </Route>

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  {/* Dashboard Routes */}
                  <Route path="/dashboard">
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="teacher" element={<TeacherDashboard />} />
                    <Route path="parent" element={<ParentDashboard />} />
                  </Route>

                  {/* Student Management Routes */}
                  <Route path="/students">
                    <Route index element={<Students />} />
                    <Route path="add" element={<AddStudent />} />
                    <Route path=":id" element={<StudentDetail />} />
                    <Route path=":id/edit" element={<EditStudent />} />
                  </Route>

                  {/* Results Management Routes */}
                  <Route path="/results">
                    <Route index element={<Results />} />
                    <Route path="add" element={<AddResult />} />
                    <Route path=":id" element={<ResultDetail />} />
                    <Route path=":id/edit" element={<EditResult />} />
                  </Route>

                  {/* Reports Routes */}
                  <Route path="/reports">
                    <Route index element={<Reports />} />
                    <Route path=":id" element={<ReportDetail />} />
                  </Route>

                  {/* Teacher Management Routes */}
                  <Route path="/teachers">
                    <Route index element={<Teachers />} />
                    <Route path="add" element={<AddTeacher />} />
                    <Route path=":id" element={<TeacherDetail />} />
                  </Route>

                  {/* School Settings */}
                  <Route path="/school-settings" element={<SchoolSettings />} />

                  {/* Profile */}
                  <Route path="/profile" element={<Profile />} />

                  {/* Catch all route - redirect to appropriate dashboard */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>
            </Routes>

            {/* Global Toast Notifications */}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  style: {
                    background: '#10b981',
                  },
                },
                error: {
                  duration: 5000,
                  style: {
                    background: '#ef4444',
                  },
                },
              }}
            />
          </SchoolProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
