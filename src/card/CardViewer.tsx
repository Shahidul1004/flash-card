import { Box, styled, Typography, useMediaQuery } from "@mui/material";
import { cardType } from "../Homepage";
import { useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { convertFromRaw, EditorState } from "draft-js";

type propsType = {
  card: cardType | null;
};

const CardViewer = ({ card }: propsType): JSX.Element => {
  const [mode, setMode] = useState<"view" | "edit">("view");
  const smallDevice = useMediaQuery("(min-width:1200px)");

  return (
    <ViewSection>
      <Container>
        {card ? (
          <>
            <Title>
              <Box>Title:</Box>
              <Box
                sx={{
                  backgroundColor: "ButtonShadow",
                  maxWidth: "850px",
                  fontSize: "18px",
                  padding: "8px",
                }}
              >
                {card.title}
              </Box>
            </Title>
            <Editors>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "7px",
                }}
              >
                <Typography fontSize="18px" fontWeight="500">
                  Description
                </Typography>
                <Editor
                  readOnly
                  defaultEditorState={
                    card.description
                      ? EditorState.createWithContent(
                          convertFromRaw(JSON.parse(card.description))
                        )
                      : EditorState.createEmpty()
                  }
                  toolbarStyle={{
                    display: "none",
                  }}
                  wrapperStyle={{
                    width: "100%",
                  }}
                  editorStyle={{
                    height: "auto",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    width: `${
                      smallDevice ? "calc(50vw - 185px)" : "calc(100vw - 350px)"
                    }`,
                    overflow: "hidden",
                  }}
                  toolbar={{
                    fontFamily: {
                      options: ["Roboto", "Source Code Pro"],
                    },
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: "7px",
                }}
              >
                <Typography fontSize="18px" fontWeight="500">
                  Code
                </Typography>
                <Editor
                  readOnly
                  defaultEditorState={
                    card.code
                      ? EditorState.createWithContent(
                          convertFromRaw(JSON.parse(card.code))
                        )
                      : EditorState.createEmpty()
                  }
                  toolbarStyle={{
                    display: "none",
                  }}
                  wrapperStyle={{
                    width: "100%",
                  }}
                  editorStyle={{
                    height: "auto",
                    border: "1px solid #ccc",
                    boxSizing: "border-box",
                    width: `${
                      smallDevice ? "calc(50vw - 185px)" : "calc(100vw - 350px)"
                    }`,
                    overflow: "hidden",
                  }}
                  toolbar={{
                    fontFamily: {
                      options: ["Roboto", "Source Code Pro"],
                    },
                  }}
                />
              </Box>
            </Editors>
          </>
        ) : (
          <Typography> no card found</Typography>
        )}
      </Container>
    </ViewSection>
  );
};

export default CardViewer;

const ViewSection = styled(Box)({
  position: "fixed",
  top: "45px",
  right: "300px",
  height: "calc(100vh - 45px)",
  width: "calc(100vw - 300px)",
  boxSizing: "border-box",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
});

const Container = styled(Box)({
  paddingTop: "25px",
  paddingLeft: "25px",
  paddingBottom: "25px",
  minHeight: "500px",
  height: "calc(100% - 100px)",
  width: "calc(100vw - 300px)",
  position: "fixed",
  overflow: "hidden",
  boxSizing: "border-box",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "20px",
  overflowY: "auto",
});

const Title = styled(Box)({
  width: "calc(100% - 50px)",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "10px",
});

const Editors = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "20px",
  width: "calc(100vw - 350px)",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: "50px",
  },
}));
