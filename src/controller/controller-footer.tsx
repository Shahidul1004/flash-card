import { Box, Button, IconButton, styled } from "@mui/material";
import { BoxProps } from "@mui/system";
import React from "react";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import FastForwardIcon from "@mui/icons-material/FastForward";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import FastRewindIcon from "@mui/icons-material/FastRewind";

type propTypes = {
  numberOfCard: number;
  selectedCardIndex: number;
  changeSelectedCardIndex: React.Dispatch<React.SetStateAction<number>>;
};
const CardController = ({
  numberOfCard,
  selectedCardIndex,
  changeSelectedCardIndex,
}: propTypes): JSX.Element => {
  let left = Math.max(0, selectedCardIndex - 2);
  let right = Math.min(numberOfCard - 1, left + 4);
  left = Math.max(0, right - 4);

  if (numberOfCard === undefined) return <></>;
  return (
    <FooterSection>
      {numberOfCard > 0 && (
        <>
          <Button>Edit this Card</Button>
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <IconButton
              sx={{
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #cee9ea",
                backgroundColor: "#e3ebec",
                ":hover": {
                  backgroundColor: "#cee9ea",
                },
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px",
              }}
              disabled={left <= 0}
              onClick={() => {
                changeSelectedCardIndex(Math.max(left - 3, 0));
              }}
            >
              <FastRewindIcon
                sx={{
                  width: "35px",
                  height: "28px",
                }}
              />
            </IconButton>
            <IconButton
              sx={{
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #cee9ea",
                backgroundColor: "#e3ebec",
                ":hover": {
                  backgroundColor: "#cee9ea",
                },
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px",
              }}
              disabled={selectedCardIndex <= 0}
              onClick={() =>
                changeSelectedCardIndex(Math.max(selectedCardIndex - 1, 0))
              }
            >
              <SkipPreviousIcon
                sx={{
                  width: "35px",
                  height: "28px",
                }}
              />
            </IconButton>
            {Array.from(Array(right - left + 1).keys()).map((a, index) => (
              <IndexButton
                key={index}
                active={selectedCardIndex === left + index ? 1 : 0}
                onClick={() => changeSelectedCardIndex(left + index)}
              >
                {left + index + 1}
              </IndexButton>
            ))}
            <IconButton
              sx={{
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #cee9ea",
                backgroundColor: "#e3ebec",
                ":hover": {
                  backgroundColor: "#cee9ea",
                },
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px",
              }}
              disabled={selectedCardIndex >= numberOfCard - 1}
              onClick={() =>
                changeSelectedCardIndex(
                  Math.min(selectedCardIndex + 1, numberOfCard - 1)
                )
              }
            >
              <SkipNextIcon
                sx={{
                  width: "35px",
                  height: "28px",
                }}
              />
            </IconButton>
            <IconButton
              sx={{
                boxSizing: "border-box",
                borderRadius: "4px",
                border: "1px solid #cee9ea",
                backgroundColor: "#e3ebec",
                ":hover": {
                  backgroundColor: "#cee9ea",
                },
                cursor: "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0px",
              }}
              disabled={right >= numberOfCard - 1}
              onClick={() =>
                changeSelectedCardIndex(Math.min(right + 3, numberOfCard - 1))
              }
            >
              <FastForwardIcon
                sx={{
                  width: "35px",
                  height: "28px",
                }}
              />
            </IconButton>
          </Box>
        </>
      )}
    </FooterSection>
  );
};
export default CardController;

const FooterSection = styled(Box)({
  position: "fixed",
  bottom: "0px",
  left: "0px",
  height: "55px",
  width: "100vw",
  boxSizing: "border-box",
  padding: "0px 10px",
  boxShadow: "0px -1px 4px 0px gray",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  gap: "10px",
});

interface IndexProps extends BoxProps {
  active: number;
}
const IndexButton = styled(Box)<IndexProps>(({ active }) => ({
  padding: "1px 2px",
  boxSizing: "border-box",
  borderRadius: "4px",
  border: "1px solid #cee9ea",
  backgroundColor: active ? "#cee9ea" : "white",
  cursor: active ? "default" : "pointer",
  height: "27px",
  minWidth: "30px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));
