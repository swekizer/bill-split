import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "https://bill-split-8orc.onrender.com";

  useEffect(() => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");
    if (email && password) {
      setUser({ email, password, credentials: btoa(email + ":" + password) });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const credentials = btoa(email + ":" + password);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);
        const userData = { email, password, credentials, ...data };
        setUser(userData);
        return { success: true };
      } else {
        const data = await response.json().catch(() => ({}));
        return { success: false, error: data.message || "Wrong email or password" };
      }
    } catch (err) {
      return { success: false, error: err.message || "Network error during login" };
    }
  };

  const register = async (username, email, password, upiId) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          upiId,
        }),
      });

      if (response.ok) {
        const text = await response.text();
        return { success: true, message: text };
      } else {
        const text = await response.text();
        return { success: false, error: text || "Registration failed" };
      }
    } catch (err) {
      return { success: false, error: err.message || "Network error occurred" };
    }
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("password");
    setUser(null);
  };

  const getAuthHeader = () => {
    return user ? { Authorization: "Basic " + user.credentials } : {};
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, getAuthHeader, loading, API_URL }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
