import { useState, useCallback, useRef, useEffect } from "react";
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const activeHttpRequests = useRef<AbortController[]>([]);

  const sendRequest = useCallback(
    async (url: string, method = "GET", body: any = null, headers = {}) => {
      setTimeout(() => setIsLoading(true), 10);

      const httpAbortCtrl = new AbortController();

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_ENDPOINT + url}`,
          {
            method,
            body,
            headers,
            signal: httpAbortCtrl.signal,
          }
        );
        const responseData = await response.json();

        activeHttpRequests.current = activeHttpRequests.current.filter(
          (e) => e !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setTimeout(() => setIsLoading(false), 10);
        return responseData;
      } catch (err: any) {
        setError(err?.message || "request cannot be made");
        setTimeout(() => setIsLoading(false), 10);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError("");
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((element) => {
        element.abort();
      });
    };
  }, []);

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};
