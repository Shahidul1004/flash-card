import { styled, Box, Button } from "@mui/material";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../Context";

const HeaderSection = (): JSX.Element => {
  const context = useContext(Context);
  const navigate = useNavigate();
  return (
    <ToolBar>
      <Button onClick={() => navigate("/")}>Home</Button>
      {/* <SearchSection /> */}
      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "20px" }}>
        {context.isLoggedIn && (
          <Button onClick={() => navigate("/manage")}>Manages</Button>
        )}
        <Box
          sx={{
            width: "80px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {context.isLoggedIn ? (
            <Button onClick={context.logout}>Log Out</Button>
          ) : (
            <Button onClick={() => navigate("/auth")}>Log In</Button>
          )}
        </Box>
      </Box>
    </ToolBar>
  );
};

export default HeaderSection;

const ToolBar = styled(Box)({
  position: "fixed",
  top: "0px",
  width: "100%",
  height: "45px",
  boxSizing: "border-box",
  backgroundColor: "white",
  boxShadow: "0px 1px 4px 0px gray",
  padding: "10px",
  paddingLeft: "50px",
  paddingRight: "50px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "10px",
  zIndex: 900,
});
