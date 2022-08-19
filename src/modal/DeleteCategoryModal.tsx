import { Box, Button, styled, Typography } from "@mui/material";
import _ from "lodash";
import React, { useContext, useEffect } from "react";
import { Context } from "../Context";
import { categoryType } from "../Homepage";
import { useHttpClient } from "../shared/hooks/http-hook";

type propTypes = {
  category: categoryType;
  onClose: () => void;
  onUpdate: () => void;
};
const DeleteCategoryModal = ({
  category,
  onClose,
  onUpdate,
}: propTypes): JSX.Element => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const context = useContext(Context);
  context.setLoading(isLoading);

  useEffect(() => {
    return () => {
      context.setLoading(false);
    };
  }, []);

  const onSubmitHandler = async () => {
    try {
      await sendRequest(`/api/category/${category.id}`, "DELETE");
      context.displayNotification(false);
      context.setNotification("Category deleted", "success");
      context.displayNotification(true);
      onUpdate();
    } catch (err: any) {
      context.displayNotification(false);
      context.setNotification(
        err?.message || "Cannot delete category",
        "error"
      );
      context.displayNotification(true);
    }
  };
  return (
    <>
      <OverLay />
      <ModalContainer>
        <Box
          sx={{
            width: "300px",
            display: "flex",
            flexFlow: "column nowrap",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <Typography fontWeight="500">
            Do you want to delete Category?
          </Typography>

          <Typography>Card will be moved to trash</Typography>

          <Box sx={{ marginTop: "25px", display: "flex", gap: "20px" }}>
            <Button
              variant="outlined"
              color="warning"
              sx={{
                padding: "6px 8px",
              }}
              onClick={onSubmitHandler}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              sx={{
                padding: "6px 20px",
              }}
              onClick={onClose}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </ModalContainer>
    </>
  );
};
export default DeleteCategoryModal;

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
