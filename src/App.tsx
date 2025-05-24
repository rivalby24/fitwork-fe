import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import About from "./pages/About";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardPerusahaan from "./pages/app/company/DashboardPerusahaan";
import DashboardUser from "./pages/app/user/DashboardUser";
import ChatBot from "./pages/app/user/ChatBot";
import Layout from "./pages/app/Layout";
import AssesmentCompany from "./pages/app/user/Assessment";
import AssesmentQuestion from "./pages/app/user/AssessmentQuestion";
import Compare from "./pages/app/user/Compare";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/about" element={<About />} />
        <Route path="app" element={<Layout />}>
          {/* Protected route for company admin */}
          <Route
            path="c/dashboard"
            element={
              <ProtectedRoute requireCompanyAdmin={true}>
                <DashboardPerusahaan />
              </ProtectedRoute>
            }
            index
          />
          {/* Rute untuk kandidat biasa */}
          <Route
            path="u/dashboard"
            element={
              <ProtectedRoute requireCandidate={true}>
                <DashboardUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="u/assessment"
            element={
              <ProtectedRoute requireCandidate={true}>
                <AssesmentCompany />
              </ProtectedRoute>
            }
          />
          <Route
            path="u/assessment/question"
            element={
              <ProtectedRoute requireCandidate={true}>
                <AssesmentQuestion />
              </ProtectedRoute>
            }
          />
          <Route
            path="u/ai-chat"
            element={
              <ProtectedRoute requireCandidate={true}>
                <ChatBot />
              </ProtectedRoute>
            }
          />
          <Route
            path="u/compare"
            element={
              <ProtectedRoute requireCandidate={true}>
                <Compare />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
