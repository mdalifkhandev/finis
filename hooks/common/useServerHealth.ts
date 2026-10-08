import { useCallback, useEffect, useState } from "react";
import { API_BASE_URL } from "@/lib/config";
import { pingInternet } from "@/store/network.store";

export type ServerHealthStatus = "checking" | "stable" | "down";

export interface ServerHealthResult {
  status: ServerHealthStatus;
  latencyMs: number | null;
  errorMessage: string | null;
  isChecking: boolean;
  checkHealth: () => Promise<boolean>;
}

export function useServerHealth(autoCheck = true): ServerHealthResult {
  const [status, setStatus] = useState<ServerHealthStatus>("checking");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  const checkHealth = useCallback(async (): Promise<boolean> => {
    setIsChecking(true);
    setStatus("checking");
    setErrorMessage(null);
    const startTime = Date.now();

    try {
      // 1. Check if device actually has active internet first
      const hasInternet = await pingInternet(2500);
      if (!hasInternet) {
        setStatus("down");
        setLatencyMs(null);
        setErrorMessage("No internet connection on your mobile phone.");
        return false;
      }

      // 2. Direct fetch to /health endpoint with 4-second timeout
      // (Bypasses axios so it never triggers the offline modal)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const healthUrl = `${API_BASE_URL}/health`;
      const response = await fetch(healthUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Cache-Control": "no-cache",
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      const elapsed = Date.now() - startTime;
      if (response.ok) {
        setStatus("stable");
        setLatencyMs(elapsed);
        setErrorMessage(null);
        return true;
      } else {
        setStatus("down");
        setLatencyMs(null);
        setErrorMessage(`Backend returned error status (${response.status})`);
        return false;
      }
    } catch {
      // Device has internet, but backend server is off/unreachable
      setStatus("down");
      setLatencyMs(null);
      setErrorMessage("Backend server is offline or unreachable.");
      return false;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (autoCheck) {
      void checkHealth();
    }
  }, [autoCheck, checkHealth]);

  return {
    status,
    latencyMs,
    errorMessage,
    isChecking,
    checkHealth,
  };
}
