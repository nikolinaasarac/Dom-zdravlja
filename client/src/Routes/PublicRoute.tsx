import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../store/store";
import { korisnikApi } from "../features/korisnik/korisnikApi";

export const PublicRoute = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { isLoading } = korisnikApi.useGetMyAccountQuery(undefined, { skip: isAuthenticated });

  if (isLoading) return <div>Loading...</div>; 

  if (isAuthenticated) {
    return <Navigate to="/homepage" replace />; 
  }

  return <Outlet />;
};