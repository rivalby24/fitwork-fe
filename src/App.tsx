import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import About from "./pages/About";
import DashboardPerusahaan from "./pages/app/company/DashboardPerusahaan";
import DashboardUser from "./pages/app/user/DashboardUser";
import ChatBot from "./pages/app/user/ChatBot";
import Layout from "./pages/app/Layout";
import AssesmentCompany from "./pages/app/user/Assessment";
import AssesmentQuestion from "./pages/app/user/AssessmentQuestion";
import Compare from "./pages/app/user/Compare";
import { Toaster } from "./components/ui/sonner";
import NotFound from "./pages/NotFound";
import { CandidateRoutesWrapper, CompanyAdminRoutesWrapper } from "./components/auth/RoleBasedWrapper";
import UpdateEVP from "./pages/app/company/UpdateEVP";
import AssessmentDetail from "./pages/app/company/AssessmentDetail";
import CandidateView from "./pages/app/company/CandidateView";

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />}/>
        <Route path="app" element={<Layout />}>
          {/* Rute untuk Admin Perusahaan */}
          <Route element={<CompanyAdminRoutesWrapper />}>
            <Route path="c/dashboard" element={<DashboardPerusahaan />}/>
            <Route path="c/evp" element={<UpdateEVP />}/>
            <Route path="c/assessment" element={<AssessmentDetail />}/>
            <Route path="c/candidates" element={<CandidateView />}/>
          </Route>
          {/* Rute untuk Kandidat */}
          <Route element={<CandidateRoutesWrapper />}>
            <Route path="u/dashboard" element={<DashboardUser />}/>
            <Route path="u/assessment" element={<AssesmentCompany />} />
            <Route
              path="u/assessment/question/:companyId"
              element={<AssesmentQuestion />}
            />
            <Route path="u/ai-chat" element={<ChatBot />} />
            <Route path="u/compare" element={<Compare />} />
            {/* Tambah rute kandidat lain di sini */}
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
