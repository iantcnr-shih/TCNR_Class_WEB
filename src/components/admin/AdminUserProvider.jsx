// AdminUserProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "@/api/axios";

const AdminUserContext = createContext(null);

export const AdminUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);


  return (
    <AdminUserContext.Provider value={{ user, setUser, loading, setLoading }}>
      {children}
    </AdminUserContext.Provider>
  );
};

export const useAdminUser = () => {
  const ctx = useContext(AdminUserContext);
  if (!ctx) {
    throw new Error("useAdminUser must be used inside AdminUserProvider");
  }
  return ctx;
};