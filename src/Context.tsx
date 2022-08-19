import { Backdrop, CircularProgress } from "@mui/material";
import { createContext, ReactNode, useRef, useState } from "react";
import Notification from "./Notification";
import useAuth from "./shared/hooks/auth-hook";

type ContextType = {
  loading: boolean;
  setLoading: (newState: boolean) => void;
  setNotification: (newMsg: string, type: "success" | "error") => void;
  displayNotification: (newState: boolean) => void;
  isLoggedIn: boolean;
  token: string;
  userId: string;
  login: (uid: string, token: string) => void;
  logout: () => void;
};

export const Context = createContext<ContextType>({
  loading: false,
  setLoading(newState) {},
  setNotification() {},
  displayNotification(newState) {},
  isLoggedIn: false,
  token: "",
  userId: "",
  login(uid, token) {},
  logout() {},
});

type props = {
  children: ReactNode;
};

const ContextProvider = ({ children }: props): JSX.Element => {
  const { token, userId, login, logout } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const notificationMessage = useRef<string>("");
  const notificationType = useRef<"success" | "error">("success"); //based on mui "Alert" type

  const displayNotification = (newState: boolean) => {
    setShowNotification(newState);
  };
  const setNotification = (newMsg: string, type: "success" | "error") => {
    notificationMessage.current = newMsg;
    notificationType.current = type;
  };

  return (
    <Context.Provider
      value={{
        loading: loading,
        setLoading: (state: boolean) => {
          setTimeout(() => {
            setLoading(state);
          }, 10);
        },
        setNotification: setNotification,
        displayNotification: displayNotification,
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout,
      }}
    >
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Notification
        open={showNotification}
        setOpen={displayNotification}
        message={notificationMessage.current}
        type={notificationType.current}
      />
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;
