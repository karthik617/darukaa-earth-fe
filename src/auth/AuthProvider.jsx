import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE || '';

let refreshPromise = null;

export function AuthProvider({ children, onLogout }) {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const authApi = axios.create({ baseURL: API_BASE, withCredentials: true });

  authApi.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });

  authApi.interceptors.response.use(
    (res) => res,
    async (err) => {
      const originalRequest = err.config;
      if (!originalRequest) return Promise.reject(err);

      if (err.response && err.response.status === 401 && !originalRequest._retry) {
        // single refresh in flight
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              const r = await axios.post(`${API_BASE}/auth/refresh`, null, {
                withCredentials: true,
              });
              setAccessToken(r.data.access_token);
              return r.data.access_token;
            } catch (e) {
              setAccessToken(null);
              setUser(null);
              if (onLogout) onLogout();
              throw e;
            } finally {
              refreshPromise = null;
            }
          })();
        }

        try {
          const newAccess = await refreshPromise;
          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return authApi(originalRequest);
        } catch (e) {
          return Promise.reject(e);
        }
      }
      return Promise.reject(err);
    }
  );

  const login = useCallback(async (email, password) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    setLoading(true);
    const resp = await axios.post(`${API_BASE}/auth/login`, params, { withCredentials: true });
    // backend returns access_token and sets refresh cookie automatically
    setAccessToken(resp.data.access_token);
    setUser({ email });
    setLoading(false);
    return resp.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post(`${API_BASE}/auth/logout`, null, { withCredentials: true });
    } catch (e) {
      // ignore
      console.error('logout failed', e);
    }
    setAccessToken(null);
    setUser(null);
    if (onLogout) onLogout();
  }, [onLogout]);

  return (
    <AuthContext.Provider
      value={{ authApi, login, logout, user, accessToken, setAccessToken, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
