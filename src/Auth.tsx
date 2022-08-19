import { Box, Button, Input, styled, Typography } from "@mui/material";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "./Context";
import { useHttpClient } from "./shared/hooks/http-hook";

const Auth = (): JSX.Element => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const context = useContext(Context);
  context.setLoading(isLoading);
  const [userName, setUserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const isValidInput = () => {
    if (userName.trim().length > 4 && password.trim().length > 7) return true;
    return false;
  };
  const navigate = useNavigate();
  const loginSubmitHandler = async () => {
    try {
      const responseData = await sendRequest(
        "/api/user/login",
        "POST",
        JSON.stringify({
          userName: userName,
          password: password,
        }),
        {
          "Content-Type": "application/json",
        }
      );
      context.login(responseData.userId, responseData.token);
      context.displayNotification(false);
      context.setNotification("logged in!", "success");
      context.displayNotification(true);
      setTimeout(() => {
        navigate("/");
      }, 10);
    } catch (err) {
      context.displayNotification(false);
      context.setNotification("something went wrong!", "error");
      context.displayNotification(true);
    }
  };
  return (
    <AuthpageStyle>
      <AuthSection>
        <AuthText>Login Required</AuthText>
        <hr style={{ height: "1px", width: "100%" }} />
        <AuthText sx={{ fontSize: "18px" }}>User Name</AuthText>
        <Input
          placeholder="Enter your username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          fullWidth
          type="text"
        />
        <AuthText sx={{ fontSize: "18px" }}>Password</AuthText>
        <Input
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          type="password"
        />
        <Button
          variant="contained"
          color="success"
          disabled={!isValidInput()}
          onClick={loginSubmitHandler}
        >
          LOGIN
        </Button>
      </AuthSection>
    </AuthpageStyle>
  );
};

export default Auth;

const AuthpageStyle = styled(Box)({
  position: "fixed",
  top: "60px",
  width: "100vw",
  height: "100vh",
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
});

const AuthSection = styled(Box)({
  width: "400px",
  height: "400px",
  boxSizing: "border-box",
  padding: "20px",
  paddingTop: "50px",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
});

const AuthText = styled(Typography)({
  fontSize: "24px",
  fontWeight: "500",
  color: "black",
});
