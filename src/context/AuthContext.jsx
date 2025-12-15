import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("pfm_token"));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMe() {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.user || res);
      } catch (err) {
        logout();
      } finally {
        setLoading(false);
      }
    }

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("pfm_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password });
    localStorage.setItem("pfm_token", res.token);
    setToken(res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = () => {
    localStorage.removeItem("pfm_token");
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
