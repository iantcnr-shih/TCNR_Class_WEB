// AdminUserProvider.jsx
import { createContext, useContext, useState } from "react";

const AdminUserContext = createContext(null);

export const AdminUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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