import { styled, Box, Button, Menu, ListItem, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../Context";
import { cardType, categoryType } from "../Homepage";
import { useHttpClient } from "../shared/hooks/http-hook";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import _ from "lodash";

type props = {
  card: cardType;
  selectedCategoryId: number | undefined;
  categories: categoryType[];
  setCards: React.Dispatch<React.SetStateAction<cardType[]>>;
  onClose: () => void;
};

const ManageCard = ({
  card,
  selectedCategoryId,
  categories,
  setCards,
  onClose,
}: props): JSX.Element => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const context = useContext(Context);
  context.setLoading(isLoading);

  const [newCard, setNewCard] = useState<cardType>({ ...card });

  const [title, setTitle] = useState<string>(card.title);
  const categoryIdRef = useRef<number>(card.categoryId);
  const descriptionRef = useRef<any>(
    card.description
      ? EditorState.createWithContent(
          convertFromRaw(JSON.parse(card.description))
        )
      : EditorState.createEmpty()
  );
  const codeRef = useRef<any>(
    card.code
      ? EditorState.createWithContent(convertFromRaw(JSON.parse(card.code)))
      : EditorState.createEmpty()
  );
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    return () => {
      context.setLoading(false);
    };
  }, []);

  const handleExit = async () => {
    if (selectedCategoryId && newCard.id !== -1) {
      if (selectedCategoryId === newCard.categoryId) {
        setCards((prev) => {
          const prevCopy = _.cloneDeep(prev);
          const index = prevCopy.findIndex((cpy) => cpy.id === newCard.id);
          if (index === -1) prevCopy.push({ ...newCard });
          else prevCopy.splice(index, 1, { ...newCard });
          return prevCopy;
        });
      } else {
        setCards((prev) => {
          const prevCopy = _.cloneDeep(prev);
          const index = prevCopy.findIndex((cpy) => cpy.id === newCard.id);
          if (index !== -1) prevCopy.splice(index, 1);
          return prevCopy;
        });
      }
    }
    onClose();
  };
  const handleSave = async (type = 1) => {
    const newTitle = title.trim();
    const newCategoryId = categoryIdRef.current;
    const newDescription = JSON.stringify(
      convertToRaw(descriptionRef.current.getCurrentContent())
    );
    const newCode = JSON.stringify(
      convertToRaw(codeRef.current.getCurrentContent())
    );

    if (newCard.id === -1) {
      try {
        const response: cardType = await sendRequest(
          `/api/card/`,
          "POST",
          JSON.stringify({
            categoryId: newCategoryId,
            title: newTitle,
            description: newDescription,
            code: newCode,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        context.displayNotification(false);
        context.setNotification("added", "success");
        context.displayNotification(true);
        setNewCard({ ...response });

        if (type === 2) {
          if (selectedCategoryId && response.id !== -1) {
            if (selectedCategoryId === response.categoryId) {
              setCards((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const index = prevCopy.findIndex(
                  (cpy) => cpy.id === response.id
                );
                if (index === -1) prevCopy.push({ ...response });
                else prevCopy.splice(index, 1, { ...response });
                return prevCopy;
              });
            } else {
              setCards((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const index = prevCopy.findIndex(
                  (cpy) => cpy.id === response.id
                );
                if (index !== -1) prevCopy.splice(index, 1);
                return prevCopy;
              });
            }
          }
          onClose();
        }
      } catch (err: any) {
        context.displayNotification(false);
        context.setNotification(
          err?.message || "something went wrong",
          "error"
        );
        context.displayNotification(true);
      }
    } else {
      try {
        const response: any = await sendRequest(
          `/api/card/${newCard.id}`,
          "PATCH",
          JSON.stringify({
            categoryId: newCategoryId,
            title: newTitle,
            description: newDescription,
            code: newCode,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        context.displayNotification(false);
        context.setNotification("saved", "success");
        context.displayNotification(true);

        const newCardObj: cardType = {
          id: response.id,
          title: response.title,
          categoryId: response.categoryId,
          description: response.description,
          code: response.code,
          createdAt: response.createdAt,
          updatedAt: response.updatedAt,
        };
        setNewCard(newCardObj);
        if (type === 2) {
          if (selectedCategoryId && newCardObj.id !== -1) {
            if (selectedCategoryId === newCardObj.categoryId) {
              setCards((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const index = prevCopy.findIndex(
                  (cpy) => cpy.id === newCardObj.id
                );
                if (index === -1) prevCopy.push({ ...newCardObj });
                else prevCopy.splice(index, 1, { ...newCardObj });
                return prevCopy;
              });
            } else {
              setCards((prev) => {
                const prevCopy = _.cloneDeep(prev);
                const index = prevCopy.findIndex(
                  (cpy) => cpy.id === newCardObj.id
                );
                if (index !== -1) prevCopy.splice(index, 1);
                return prevCopy;
              });
            }
          }
          onClose();
        }
      } catch (err: any) {
        context.displayNotification(false);
        context.setNotification(
          err?.message || "something went wrong",
          "error"
        );
        context.displayNotification(true);
      }
    }
  };

  const handleSaveAndExit = async () => {
    await handleSave(2);
  };

  return (
    <>
      <Page>
        <Container>
          <Info>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Typography>Category:</Typography>
              <Box
                onClick={(e) => handleClick(e)}
                sx={{
                  width: "230px",
                  display: "flex",
                  alignitems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  backgroundColor: "#e4e7ed",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  ":hover": {
                    backgroundColor: "#c9ccd1",
                  },
                }}
              >
                <Typography
                  noWrap
                  fontWeight="500"
                  lineHeight="1.5"
                  letterSpacing="0.00938em"
                  fontSize="14px"
                  sx={{
                    color: "#4b4646",
                    maxWidth: "200px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {
                    categories.find((cat) => cat.id === categoryIdRef.current)
                      ?.title
                  }
                </Typography>
                {open ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <Button
                variant="outlined"
                color="warning"
                onClick={() => handleExit()}
              >
                Exit
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={!title.trim().length}
                onClick={() => handleSave(1)}
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="success"
                disabled={!title.trim().length}
                onClick={() => handleSaveAndExit()}
              >
                Save & Exit
              </Button>
            </Box>
          </Info>
          <Title>
            <Typography>Title:</Typography>
            <TextField
              variant="outlined"
              multiline
              sx={{
                "& .MuiInputBase-root": {
                  width: "900px",
                  maxWidth: "100%",
                  backgroundColor: "ButtonShadow",
                },
              }}
              defaultValue={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Title>
          <Editors>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: "7px",
                width: "100%",
              }}
            >
              <Typography fontSize="18px" fontWeight="500">
                Description
              </Typography>
              <Editor
                defaultEditorState={descriptionRef.current}
                onEditorStateChange={(newState) => {
                  descriptionRef.current = newState;
                }}
                toolbarClassName="toolbar-class"
                wrapperStyle={{
                  width: "100%",
                }}
                editorStyle={{
                  height: "auto",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
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
                width: "100%",
              }}
            >
              <Typography fontSize="18px" fontWeight="500">
                Code
              </Typography>
              <Editor
                defaultEditorState={codeRef.current}
                onEditorStateChange={(newState) => {
                  codeRef.current = newState;
                }}
                toolbarClassName="toolbar-class"
                wrapperStyle={{
                  width: "100%",
                }}
                editorStyle={{
                  height: "auto",
                  border: "1px solid #ccc",
                  boxSizing: "border-box",
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
        </Container>
      </Page>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: "270px",
            maxHeight: "200px",
            padding: "5px",
            overflowY: "auto",
            "& .MuiMenu-list": {
              padding: "0",
              overflow: "hidden",
            },
            "& .MuiListItem-root": {
              width: "100%",
              cursor: "pointer",
              margin: "0px",
              wordBreak: "break-word",
              textTransform: "capitalize",
              ":hover": {
                backgroundColor: "ButtonShadow",
              },
            },
          },
        }}
      >
        {categories
          .filter((cat) => cat.title !== "trash")
          .map((cat) => (
            <ListItem
              key={cat.id}
              onClick={() => {
                categoryIdRef.current = cat.id;
                handleClose();
              }}
            >
              <Box>{cat.title}</Box>
            </ListItem>
          ))}
      </Menu>
    </>
  );
};

export default ManageCard;

const Page = styled(Box)({
  position: "fixed",
  top: "45px",
  width: "100vw",
  height: "calc(100vh - 45px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "flex-start",
  backgroundColor: "white",
});

const Container = styled(Box)({
  marginTop: "25px",
  minHeight: "500px",
  height: "calc(100% - 100px)",
  maxWidth: "calc(100vw - 50px)",
  position: "fixed",
  overflow: "hidden",
  borderRadius: "8px",
  border: `1px solid rgb(204 204 204)`,
  boxSizing: "border-box",
  boxShadow: "grey 0px 0px 8px 2px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "20px",
  overflowY: "auto",
});

const Info = styled(Box)({
  marginBottom: "20px",
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
});

const Title = styled(Box)({
  width: "100%",
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  gap: "10px",
});

const Editors = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "flex-start",
  gap: "20px",
  width: "100%",
  [theme.breakpoints.down("lg")]: {
    flexDirection: "column",
    justifyContent: "flex-start",
    gap: "50px",
  },
}));
