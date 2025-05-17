import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import About from "./pages/About";
import DashboardPerusahaan from "./pages/DashboardPerusahaan";
import DashboardUser from "./pages/DashboardUser";
import AssesmentCompany from "./pages/AssesmentCompany";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm/>} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/c" element={<DashboardPerusahaan />} />
        <Route 
          path="/u/dashboard" 
          element={
          <ProtectedRoute>
            <DashboardUser/>
          </ProtectedRoute>} />
        <Route path="/ya" element={<AssesmentCompany />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;