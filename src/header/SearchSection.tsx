import { styled, Box } from "@mui/material";
import { useContext } from "react";
import { Context } from "../Context";

type props = {};

const SearchSection = ({}: props): JSX.Element => {
  const context = useContext(Context);
  return <SearchSectionStyle />;
};

export default SearchSection;

const SearchSectionStyle = styled(Box)({
  width: "400px",
  maxWidth: `calc(100% - 190px)`,
  boxSizing: "border-box",
  height: "10px",
  backgroundColor: "gray",
});
