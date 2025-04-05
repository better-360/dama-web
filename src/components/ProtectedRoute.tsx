import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { useTranslation } from "react-i18next";

const ProtectedRoute = ({ children, requiredRole }:{children:any, requiredRole:string }) => {
  const [user, setUser] = useState<User>();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const {t} = useTranslation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if(currentUser) {
        setUser(currentUser);
        const userRole = await getUserRole(currentUser.uid);
        setRole(userRole);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <p>{t("common.loading")}</p>;

  if (!user || role !== requiredRole) {
    return <p>{t("common.accessDenied")}</p>;
  }

  return children;
};

export default ProtectedRoute;