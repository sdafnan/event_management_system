import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { syncUserRegistrations } from './redux/slices/registrationsSlice';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import ApiKeyModal from './components/ApiKeyModal';
import RegistrationModal from './components/RegistrationModal';
import DigitalPassModal from './components/DigitalPassModal';
import ProtectedRoute from './components/ProtectedRoute';

import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import MyEvents from './pages/MyEvents';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

function App() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.auth);

  // Sync user registrations when active user session changes
  useEffect(() => {
    dispatch(syncUserRegistrations(currentUser?.id || null));
  }, [currentUser, dispatch]);

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar />

      {/* Main Content Router Outlet */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/events" replace />} />
          <Route path="/events" element={<Events />} />
          <Route path="/events/:id" element={<EventDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Global Interactive Overlays & Modals */}
      <RegistrationModal />
      <DigitalPassModal />
      <ApiKeyModal />
      <ToastContainer />

      {/* Site Footer */}
      <Footer />
    </div>
  );
}

export default App;
