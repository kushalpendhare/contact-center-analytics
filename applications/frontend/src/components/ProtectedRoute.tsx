import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { getAccessToken } from "../services/authService";

type Props = {
  children: ReactNode;
};

function ProtectedRoute({ children }: Props) {
  if (!getAccessToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
