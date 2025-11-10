// src/hooks/useAuthCheck.js
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const useAuthCheck = (expectedType) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/verify`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        const data = await res.json();
        if (res.ok && data.type === expectedType) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          navigate(`/login?type=${expectedType}`);
        }
      } catch (err) {
        console.error("Error verifying user:", err);
        setIsAuthenticated(false);
        navigate(`/login?type=${expectedType}`);
      }
    };

    checkAuth();
  }, [expectedType, navigate]);

  return isAuthenticated;
};

export default useAuthCheck;
