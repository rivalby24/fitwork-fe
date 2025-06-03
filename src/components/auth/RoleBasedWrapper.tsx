import React from "react";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";

export const CandidateRoutesWrapper: React.FC = () => (
  <ProtectedRoute requireCandidate={true}>
    <Outlet /> {/* Akan merender rute anak untuk kandidat */}
  </ProtectedRoute>
);

export const CompanyAdminRoutesWrapper: React.FC = () => (
  <ProtectedRoute requireCompanyAdmin={true}>
    <Outlet /> {/* Akan merender rute anak untuk admin perusahaan */}
  </ProtectedRoute>
);

export const FitworkAdminRoutesWrapper: React.FC = () => (
  <ProtectedRoute requireFitworkAdmin={true}>
    <Outlet /> {/* Akan merender rute anak untuk admin perusahaan */}
  </ProtectedRoute>
);