import { useState, useCallback, useEffect } from "react";

const useAuth = () => {
  const [token, setToken] = useState<string>("");
  const [userId, setUserId] = useState<string>("");

  const login = useCallback((uid: string, token: string) => {
    setToken(token);
    localStorage.setItem(
      "flashCardData",
      JSON.stringify({
        userId: uid,
        token: token,
      })
    );
    setUserId(uid);
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUserId("");
    localStorage.removeItem("flashCardData");
  }, []);

  useEffect(() => {
    const localData = JSON.parse(localStorage.getItem("flashCardData") || "{}");
    if (localData && localData.token) {
      setToken(localData.token);
      setUserId(localData.userId);
    }
  }, []);

  return { token, login, logout, userId };
};

export default useAuth;
