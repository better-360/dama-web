import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useAppDispatch } from "../store/hooks";
import { getUserTokens, removeTokens } from "../utils/storage";
import { getApplicatorProfile } from "../http/requests/applicator";
import { logOutApplicator, setApplicatorData } from "../store/slices/applicatorSlice";

interface FormProtectRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
}

export default function FormProtectRoute({
  children,
}: FormProtectRouteProps) {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const tokens = useMemo(() => getUserTokens(), []);

  const navigate = useNavigate();
  const getUserData = async () => {
    try {
      setLoading(true);
      const response =await getApplicatorProfile();
      dispatch(setApplicatorData(response));
      setLoading(false);
    } catch (error: any) {
      removeTokens();
      dispatch(logOutApplicator());
      toast.error("Could not retrieve your information. Please log back in.");
      navigate("/");
      console.error("Error fetching user data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokens) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!tokens) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (loading) {
    return <p>Loading</p>;
  }
  return <>{children}</>;
}
