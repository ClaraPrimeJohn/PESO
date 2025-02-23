import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "./firebase";
import axios from "axios";
import { useActivity } from './ActivityContext';

export const useActivityMonitor = () => {
  const location = useLocation();
  const [userIp, setUserIp] = useState(null);
  const { logActivity } = useActivity();

  const isAdmin = auth.currentUser?.email === 'primiel1423@gmail.com';

  const fetchIp = useCallback(async () => {
    if (isAdmin) return null;

    const ipServices = [
      "https://api.ipify.org?format=json",
      "https://api64.ipify.org?format=json",
      "https://api.ip.sb/ip",
      "https://icanhazip.com"
    ];

    for (const service of ipServices) {
      try {
        const response = await axios.get(service);
        const ip = typeof response.data === 'object' ? response.data.ip : response.data.trim();
        setUserIp(ip);
        return ip;
      } catch (error) {
        console.error(`Failed to fetch IP from ${service}:`, error);
        continue;
      }
    }

    logActivity("System", {
      type: "warning",
      message: "Failed to fetch IP address from all services",
      path: location.pathname,
      user: auth.currentUser?.email || 'anonymous'
    });
    return null;
  }, [logActivity, location.pathname, isAdmin]);

  useEffect(() => {
    fetchIp();
  }, [fetchIp]);

  useEffect(() => {
    if (isAdmin) return;

    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        logActivity("API Request", {
          url: config.url,
          method: config.method,
          params: config.params,
          userIp: userIp || 'unknown',
          user: auth.currentUser?.email || 'anonymous',
          path: location.pathname
        });
        return config;
      },
      (error) => {
        logActivity("API Error", {
          message: error.message,
          userIp: userIp || 'unknown',
          user: auth.currentUser?.email || 'anonymous',
          path: location.pathname
        });
        return Promise.reject(error);
      }
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        logActivity("API Response", {
          url: response.config.url,
          status: response.status,
          statusText: response.statusText,
          userIp: userIp || 'unknown',
          user: auth.currentUser?.email || 'anonymous',
          path: location.pathname
        });
        return response;
      },
      (error) => {
        logActivity("API Error", {
          url: error.config?.url,
          status: error.response?.status,
          message: error.message,
          userIp: userIp || 'unknown',
          user: auth.currentUser?.email || 'anonymous',
          path: location.pathname
        });
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, [logActivity, userIp, location.pathname, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;

    logActivity("Page View", {
      path: location.pathname,
      referrer: document.referrer,
      userIp: userIp || 'unknown',
      user: auth.currentUser?.email || 'anonymous'
    });
  }, [location.pathname, logActivity, userIp, isAdmin]);

  useEffect(() => {
    if (isAdmin) return;

    const unsubscribe = auth.onAuthStateChanged((user) => {
      logActivity("Authentication", {
        status: user ? "signed_in" : "signed_out",
        email: user?.email,
        userIp: userIp || 'unknown',
        path: location.pathname
      });
    });

    return () => unsubscribe();
  }, [logActivity, userIp, location.pathname, isAdmin]);
};
