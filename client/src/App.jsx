import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Eager load critical pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Practice from './pages/Practice';
import ProblemDetail from './pages/ProblemDetail';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Roadmaps from './pages/Roadmaps';
import RoadmapDetail from './pages/RoadmapDetail';
import ResumeBuilder from './pages/ResumeBuilder';
import AIMentor from './pages/AIMentor';
import Community from './pages/Community';
import NotFound from './pages/NotFound';
import Placement from './pages/Placement';

// Lazy load feature pages
// const Courses = lazy(() => import('./pages/Courses'));
// const Practice = lazy(() => import('./pages/Practice'));
// const Companies = lazy(() => import('./pages/Companies'));
// const Roadmaps = lazy(() => import('./pages/Roadmaps'));
// const ResumeBuilder = lazy(() => import('./pages/ResumeBuilder'));
// const AIMentor = lazy(() => import('./pages/AIMentor'));
// const Community = lazy(() => import('./pages/Community'));

// Loading Fallback
const PageLoader = () => <LoadingSpinner fullScreen text="Loading page..." />;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ className: 'toast-custom' }} />
        <Routes>
          {/* Public Routes - Including ProblemDetail which has its own layout */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/practice/:id" element={<ProblemDetail />} />
          
          {/* Authenticated Layout Routes */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Feature Routes - to be implemented in phases */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/roadmaps" element={<Roadmaps />} />
            <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
            <Route path="/resume" element={<ResumeBuilder />} />
            <Route path="/ai-mentor" element={<AIMentor />} />
            <Route path="/community" element={<Community />} />
            <Route path="/placement" element={<Placement />} />
            <Route path="/admin" element={<div className="p-8">Admin Dashboard Coming Soon</div>} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
