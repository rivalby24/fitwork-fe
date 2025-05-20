import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import About from "./pages/About";
import DashboardPerusahaan from "./pages/DashboardPerusahaan";
import DashboardUser from "./pages/DashboardUser";
import ProtectedRoute from "./components/ProtectedRoute";
import ChatBot from "./pages/ChatBot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/about" element={<About />} />

        {/* Protected route for company admin */}
        <Route
          path="/c/dashboard"
          element={
            <ProtectedRoute requireCompanyAdmin={true}>
              <DashboardPerusahaan />
            </ProtectedRoute>
          }
        />

        {/* Protected route for normal user */}
        <Route
          path="/u/dashboard"
          element={
            <ProtectedRoute>
              <DashboardUser />
            </ProtectedRoute>
          }
        />

        {/* Protected AI chat route accessible only for logged-in users */}
        <Route
          path="/ai-chat"
          element={
            <ProtectedRoute>
              <ChatBot />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
