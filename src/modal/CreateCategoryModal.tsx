import { Box, Button, styled, TextField, Typography } from "@mui/material";
import _ from "lodash";
import React, { useContext, useEffect, useState } from "react";
import { Context } from "../Context";
import { categoryType } from "../Homepage";
import { useHttpClient } from "../shared/hooks/http-hook";

type propTypes = {
  category: categoryType | null;
  onClose: () => void;
  setCategories: React.Dispatch<React.SetStateAction<categoryType[]>>;
};
const CategoryModal = ({
  category,
  onClose,
  setCategories,
}: propTypes): JSX.Element => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const context = useContext(Context);
  context.setLoading(isLoading);
  const [title, setTitle] = useState<string>(category ? category.title : "");

  useEffect(() => {
    return () => {
      context.setLoading(false);
    };
  }, []);

  const onSubmitHandler = async () => {
    if (category) {
      try {
        const createdCategory: categoryType = await sendRequest(
          `/api/category/${category.id}`,
          "PATCH",
          JSON.stringify({
            title: title.trim().toLowerCase(),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        context.displayNotification(false);
        context.setNotification("Category updated", "success");
        context.displayNotification(true);
        setCategories((prev) => {
          const prevCopy = _.cloneDeep(prev);
          const index = prevCopy.findIndex((cat) => cat.id === category.id);
          prevCopy[index] = createdCategory;
          return prevCopy;
        });
        onClose();
      } catch (err) {
        context.displayNotification(false);
        context.setNotification("Cannot update category", "error");
        context.displayNotification(true);
      }
    } else {
      try {
        const createdCategory: categoryType = await sendRequest(
          "/api/category",
          "POST",
          JSON.stringify({
            title: title.trim().toLowerCase(),
          }),
          {
            "Content-Type": "application/json",
          }
        );
        context.displayNotification(false);
        context.setNotification("New Category added", "success");
        context.displayNotification(true);
        setCategories((prev) => {
          const prevCopy = _.cloneDeep(prev);
          prevCopy.push(createdCategory);
          return prevCopy;
        });
        onClose();
      } catch (err) {
        context.displayNotification(false);
        context.setNotification("Cannot create new category", "error");
        context.displayNotification(true);
      }
    }
  };
  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "400px",
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Typography fontWeight="500">
            {category ? "Update Category" : "Add New Modal"}
          </Typography>

          <Box
            sx={{
              marginTop: "20px",
              width: "95%",
              display: "flex",
              flexFlow: "column nowrap",
              alignItems: "flex-start",
            }}
          >
            <Typography fontSize={14}>Category Name</Typography>
            <TextField
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-input": {
                  padding: "10px",
                },
              }}
            />
          </Box>

          <Box sx={{ marginTop: "25px", display: "flex", gap: "10px" }}>
            <Button
              variant="outlined"
              onClick={onClose}
              sx={{
                padding: "6px 8px",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={onSubmitHandler}
              sx={{
                padding: "6px 20px",
              }}
              disabled={
                category
                  ? category.title !== title.trim() && title.trim().length
                    ? false
                    : true
                  : !title.trim().length
              }
            >
              {category ? "Update" : "Create"}
            </Button>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default CategoryModal;

const OverLay = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.3)",
  zIndex: 1000,
});

const ModalContainer = styled(Box)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "#fff",
  padding: "20px",
  zIndex: 1000,
  borderRadius: "5px",
});
