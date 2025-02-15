import * as React from 'react';
import { useState, useEffect, createContext } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode} from 'jwt-decode';
export const UserContext = createContext({});

interface User {
    email: string;
    role: 'Student' | 'Teacher' | null
}

function AuthorizeView(props: { children: React.ReactNode }) {
    const [authorized, setAuthorized] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);
    const [user, setUser] = useState<User>({ email: "", role: null });
  
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
  
      if (!token || !refreshToken) {
        setLoading(false);
        return;
      }
  
      try {
        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
  
        if (decoded.exp < currentTime) {
          console.log("Access token expired. Attempting refresh...");
          refreshAccessToken(refreshToken);
        } else {
          setUser({ email: decoded.email, role: decoded.role });
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
  
      setLoading(false);
    }, []);
  
    async function refreshAccessToken(refreshToken: string) {
      try {
        const response = await fetch("/api/auth/refresh-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        });
  
        if (!response.ok) {
          console.error("Failed to refresh token");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          setAuthorized(false);
          return;
        }
  
        const data = await response.json();
        localStorage.setItem("accessToken", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);
  
        const decoded: any = jwtDecode(data.token);
        setUser({ email: decoded.email, role: decoded.role });
        setAuthorized(true);
      } catch (error) {
        console.error("Error refreshing token:", error);
      }
    }
  
    if (loading) return <div></div>;
  
    return authorized ? (
      <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
    ) : (
      <Navigate to="/login" />
    );
  }
  

export function AuthorizedUser(props: { value: string }) {
    const user: any = React.useContext(UserContext);
    console.log('user', user)
    return <>{user.email}</>;
}

export function getUserEmail() {
    const user: any = React.useContext(UserContext);

    return user.email;
}


export default AuthorizeView;