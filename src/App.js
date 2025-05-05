import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './contexts/AuthContext';
import './App.css';

import CalorieCounter from './components/CalorieCounter';
import MealPlanner from './components/MealPlanner';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';


const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <CalorieCounter />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meal-planner"
                element={
                  <ProtectedRoute>
                    <MealPlanner />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
